import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Device {
  static fetchDetectionList ({ table } = {}) {
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

  static fetchCameraList ({ table } = {}) {
    const service = new Service(
      {
        url: '/camera',
        method: 'GET',
        params: {
          table,
        },
      },
      {
        denormalizer: Denormalizer.FetchCameraList,
        normalizer: Normalizer.CameraList,
      }
    )

    return service.callApi()
  }
}

export default Device
