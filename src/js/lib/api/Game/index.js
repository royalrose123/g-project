import Denormalizer from './denormalizer'

import Service from '../service'

class Game {
  static memberClockInById ({ id }) {
    const service = new Service(
      {
        url: '/clock-in',
        method: 'POST',
        data: {
          body: {
            id,
          },
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInById,
      }
    )

    return service.callApi()
  }

  static memberClockInByCardNumber ({ cardNumber }) {
    const service = new Service(
      {
        url: '/clock-in',
        method: 'POST',
        data: {
          body: {
            cardNumber,
          },
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInByCardNumber,
      }
    )

    return service.callApi()
  }

  static clockOut ({ id, playType, propPlay, averageBet, whoWin, actualWin, drop, overage }) {
    const service = new Service(
      {
        url: '/clock-out',
        method: 'POST',
        data: {
          body: {
            id,
            playType,
            propPlay,
            averageBet,
            whoWin,
            actualWin,
            drop,
            overage,
          },
        },
      },
      {
        denormalizer: Denormalizer.ClockOut,
      }
    )

    return service.callApi()
  }
}

export default Game
