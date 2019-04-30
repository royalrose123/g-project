import axios from 'axios'
import { omitBy, isUndefined, isPlainObject } from 'lodash'

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
    baseURL: 'http://10.1.1.55:45088/v1',
  }

  static normalizeList (list, normalizer) {
    return list.map(item => normalizer(item))
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

  getErrorMessage (error) {
    const { status } = error.response

    const messages = {}

    return messages[status] || 'Has unhandled error!'
  }

  debug (error, message) {
    const { url } = this.config
    const { response } = error
    const { status } = response

    console.warn(`${url} \n - status: ${status} \n - message: ${message}`, response)
  }

  handleParameter (parameter) {
    const casedParameter = toCaseKeys(parameter, Service.option.toRequestCase)
    const denormalizedParameter = this.denormalizer(casedParameter)
    const predicator = value => omitBy(value, isUndefined)
    const predicatedParameter = toPredicateValues(denormalizedParameter, predicator)

    return predicatedParameter
  }

  handleSuccess (response) {
    const casedResponse = toCaseKeys(response.data.data, Service.option.toResponseCase)
    const normalizedResponse = this.normalizer(casedResponse)

    return normalizedResponse
  }

  handleFailure (error) {
    const message = this.getErrorMessage(error)
    const reason = Object.assign(error.response, { message })

    this.debug(error, message)

    return Promise.reject(reason)
  }

  callApi () {
    const axiosInstance = this.getAxiosInstance()
    const requestConfig = this.getRequestConfig()

    return axiosInstance(requestConfig).then(response => this.handleSuccess(response), error => this.handleFailure(error))
  }
}

export default Service
