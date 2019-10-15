import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Coordinate {
  static getCoordinate ({ tableNumber, seatedCoordinate }) {
    const service = new Service(
      {
        url: '/get-coordinate',
        method: 'get',
        params: {
          tableNumber,
          seatedCoordinate,
        },
      },
      {
        denormalizer: Denormalizer.FetchCoordinate,
        normalizer: Normalizer.GetCoordinate,
      }
    )

    return service.callApi()
  }

  static postCoordinate ({ tableNumber, cameraA, cameraB }) {
    const service = new Service(
      {
        url: '/set-coordinate',
        method: 'POST',
        data: {
          tableNumber,
          cameraA,
          cameraB,
        },
      },
      {
        denormalizer: Denormalizer.PostCoordinate,
      }
    )

    return service.callApi()
  }
}

export default Coordinate
