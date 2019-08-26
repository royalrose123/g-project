import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Device {
  static fetchDetectionList ({ tableNumber } = {}) {
    const service = new Service(
      {
        url: '/people-detection-enhance',
        method: 'GET',
        params: {
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.FetchDetectionList,
        normalizer: Normalizer.DetectionList,
      }
    )

    return service.callApi()
  }

  static fetchCameraList ({ tableNumber } = {}) {
    const service = new Service(
      {
        url: '/camera',
        method: 'GET',
        params: {
          tableNumber,
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
