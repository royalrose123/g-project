import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Detection {
  static fetchDetectionList ({ table }) {
    const service = new Service(
      {
        url: '/people-detection',
        method: 'GET',
        params: {
          table,
        },
      },
      {
        denormalizer: Denormalizer.FetchDetectionList,
        normalizer: Normalizer.DetectionList,
      }
    )

    return service.callApi()
  }
}

export default Detection
