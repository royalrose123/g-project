import axios from 'axios'
import { omitBy, isUndefined, isPlainObject } from 'lodash'

import toCaseKeys, { CASES } from '../utils/to-case-keys'
import toPredicateValues from '../utils/to-predicate-values'

export const defaultNormalizer = response => response

class Service {
  constructor (config = {}, { withAccessToken = false, denormalizer = defaultNormalizer, normalizer = defaultNormalizer } = {}) {
    this.config = config
    this.withAccessToken = withAccessToken
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
    let apiConfig = null

    if (this.withAccessToken) {
      apiConfig = Object.assign(Service.apiConfig, { headers: { Authorization: `Bearer ${AuthApi.getAccessToken()}` } })
    } else {
      apiConfig = Service.apiConfig
    }

    return axios.create(apiConfig)
  }

  getRequestConfig () {
    const { params, data, ...restConfig } = this.config

    let requestConfig = restConfig

    if (isPlainObject(params)) {
      this.config.params = this.handleParameter(params)
    }

    if (isPlainObject(data)) {
      this.config.data = this.handleParameter(data)
    }

    return requestConfig
  }

  getErrorMessage (error) {
    const { status } = error.response

    const messagesWithoutAccessToken = {
      400: '參數錯誤',
      403: '沒有權限',
    }
    const messagesWithAccessToken = {}

    let message = ''

    if (this.withAccessToken) {
      message = messagesWithoutAccessToken[status]
    } else {
      message = messagesWithAccessToken[status]
    }

    return message || 'Has unhandled error!'
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

    return toPredicateValues(denormalizedParameter, predicator)
  }

  handleSuccess (response) {
    const casedResponse = toCaseKeys(response.data, Service.option.toResponseCase)
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

    return axiosInstance(requestConfig).then(this.handleSuccess, this.handleFailure)
  }
}

export default Service
