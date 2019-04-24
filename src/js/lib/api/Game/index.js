import Denormalizer from './denormalizer'

import Service from '../service'

class Game {
  static memberClockIn ({ customerId, memberCardNumber }) {
    const service = new Service(
      {
        url: '/clock-in',
        method: 'POST',
        data: {
          body: {
            customerId,
            memberCardNumber,
          },
        },
      },
      {
        denormalizer: Denormalizer.MemberClockIn,
      }
    )

    return service.callApi()
  }
}

export default Game
