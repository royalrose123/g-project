import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class TEMPLATE {
  static MethodName ({ parametersOfFrontEndKey } = {}) {
    const service = new Service(
      {
        url: '/',
        method: 'GET',
        params: {
          parametersOfFrontEndKey,
        },
      },
      {
        denormalizer: Denormalizer.MethodName,
        normalizer: Normalizer.DataName,
      }
    )

    return service.callApiWithAccessToken()
  }
}

export default TEMPLATE
