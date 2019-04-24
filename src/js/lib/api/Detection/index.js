import Normalizer from './normalizer'

import Service from '../service'

class Detection {
  static fetchDetectionList () {
    const service = new Service(
      {
        url: '/people-detection',
        method: 'GET',
      },
      {
        normalizer: Normalizer.DetectionList,
      }
    )

    return service.callApi()
  }
}

export default Detection
