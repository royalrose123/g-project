import Denormalizer from './denormalizer'

import Service from '../service'

class Game {
  static anonymousClockIn ({ snapshot }) {
    const service = new Service(
      {
        url: '/clock-in/anonymous',
        method: 'POST',
        data: {
          name,
          snapshot,
        },
      },
      {
        denormalizer: Denormalizer.AnonymousClockIn,
      }
    )

    return service.callApi()
  }

  static memberClockInById ({ id }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          id,
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
        url: '/clock-in/member',
        method: 'POST',
        data: {
          cardNumber,
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
      {
        denormalizer: Denormalizer.ClockOut,
      }
    )

    return service.callApi()
  }
}

export default Game
