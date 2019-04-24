import axios from 'axios'
import { omitBy, isUndefined, isObject } from 'lodash'

import to, { CASES } from '../utils/to-case-keys'

export const defaultNormalizer = response => response

const handleParameter = (denormalizer, parameter) => omitBy(to(denormalizer(parameter), CASES.SNAKE), isUndefined)
const warn = (url, error, message) => console.warn(`${url} \n - status: ${error.response.status} \n - message: ${message}`, error.response)

class Service {
  constructor (config = {}, { denormalizer = defaultNormalizer, normalizer = defaultNormalizer } = {}) {
    const { params, data, ...restConfig } = config

    if (isObject(params)) {
      this.config.params = handleParameter(denormalizer, params)
    }

    if (isObject(data)) {
      this.config.data = handleParameter(denormalizer, data)
    }

    this.config = restConfig
    this.normalizer = normalizer
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
      response => this.normalizer(to(response.data.data, CASES.CAMEL)),
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
