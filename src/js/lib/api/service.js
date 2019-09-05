import axios from 'axios'
import flow from 'lodash/fp/flow'
import omitBy from 'lodash/fp/omitBy'
import mapValues from 'lodash/fp/mapValues'
import isUndefined from 'lodash/fp/isUndefined'
import isPlainObject from 'lodash/fp/isPlainObject'

import toCaseKeys, { CASES } from '../utils/to-case-keys'
import toPredicateValues from '../utils/to-predicate-values'

export const defaultNormalizer = response => response

class Service {
  constructor (config = {}, { denormalizer = defaultNormalizer, normalizer = defaultNormalizer } = {}) {
    this.config = config
    this.denormalizer = denormalizer
    this.normalizer = normalizer
  }

  static option = {
    toResponseCase: CASES.CAMEL,
    toRequestCase: CASES.CAMEL,
  }

  static apiConfig = {
    baseURL: process.env.API_URL,
  }

  static normalizeList (list, normalizer) {
    return [...(list || [])].map(item => normalizer(item))
  }

  static normalizeListWithPagination ({ count, list, page, pagingIndex, pagingSize, requestDate }, normalizer) {
    return {
      count,
      list: Service.normalizeList(list, normalizer),
      page,
      pagingIndex,
      pagingSize,
      requestDateTime: requestDate,
    }
  }

  getAxiosInstance () {
    return axios.create(Service.apiConfig)
  }

  getRequestConfig () {
    const { params, data, ...restConfig } = this.config

    const requestConfig = restConfig

    if (isPlainObject(params)) {
      requestConfig.params = this.handleParameter(params)
    }

    if (isPlainObject(data)) {
      requestConfig.data = { body: this.handleParameter(data) }
    }

    return requestConfig
  }

  getErrorMessage (response) {
    const { status } = response

    const messages = {}

    return messages[status] || 'Unhandled Error!'
  }

  debug (reason) {
    const { url } = this.config
    const { status, message } = reason

    console.warn(`${url} \n - status: ${status} \n - message: ${message}`, reason)
  }

  handleParameter (parameter) {
    const denormalizedParameter = this.denormalizer(parameter)
    const casedParameter = toCaseKeys(denormalizedParameter, Service.option.toRequestCase)

    const predicator = object =>
      Array.isArray(object)
        ? object.filter(value => !isUndefined(value))
        : flow(
          omitBy(isUndefined),
          mapValues(value => (typeof value === 'string' ? value.trim() : value))
        )(object)
    const predicatedParameter = toPredicateValues(casedParameter, predicator)

    return predicatedParameter
  }

  handleSuccess (response) {
    const casedData = toCaseKeys(response.data.data, Service.option.toResponseCase)
    const normalizedData = this.normalizer(casedData)

    const predicator = object => (Array.isArray(object) ? object.filter(value => !isUndefined(value)) : flow(omitBy(isUndefined))(object))
    const predicatedData = toPredicateValues(normalizedData, predicator)
    response = predicatedData

    return response
  }

  handleFailure (error) {
    let reason = null

    if (!isUndefined(error.response)) {
      const { response } = error
      const message = this.getErrorMessage(response)
      reason = Object.assign(error, Object.assign(response, { message }))

      this.debug(reason)
    } else {
      reason = error
    }

    return Promise.reject(reason)
  }

  callApi () {
    const axiosInstance = this.getAxiosInstance()
    const requestConfig = this.getRequestConfig()
    return axiosInstance(requestConfig).then(response => this.handleSuccess(response), error => this.handleFailure(error))
  }
}

export default Service
