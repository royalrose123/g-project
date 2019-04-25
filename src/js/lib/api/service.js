import axios from 'axios'
import { omitBy, isUndefined, isNull, isPlainObject } from 'lodash'

import toCaseKeys, { CASES } from '../utils/to-case-keys'
import toPredicateValues from '../utils/to-predicate-values'

export const defaultNormalizer = response => response
const warn = (url, error, message) => console.warn(`${url} \n - status: ${error.response.status} \n - message: ${message}`, error.response)
const isValidObject = parameter => !isNull(parameter) && isPlainObject(parameter)
const predicator = value => omitBy(value, isUndefined)
const handleParameter = (denormalizer, parameter) => toPredicateValues(denormalizer(toCaseKeys(parameter, CASES.CAMEL)), predicator)

class Service {
  constructor (config = {}, { denormalizer = defaultNormalizer, normalizer = defaultNormalizer } = {}) {
    const { params, data, ...restConfig } = config

    this.config = restConfig
    this.normalizer = normalizer

    if (isValidObject(params)) {
      this.config.params = handleParameter(denormalizer, params)
    }

    if (isValidObject(data)) {
      this.config.data = handleParameter(denormalizer, data)
    }
  }

  static apiConfig = {
    baseURL: 'http://10.1.1.55:45088/v1',
  }

  static normalizeList (list, normalizer) {
    return list.map(item => normalizer(item))
  }

  callApi () {
    const axiosInstance = axios.create(Service.apiConfig)

    return axiosInstance(this.config).then(
      response => this.normalizer(toCaseKeys(response.data.data, CASES.CAMEL)),
      error => {
        let message = ''

        switch (error.response.status) {
          default:
            message = 'Has error!'
        }

        warn(this.config.url, error, message)

        return Promise.reject(Object.assign(error.response, { message }))
      }
    )
  }
}

export default Service
