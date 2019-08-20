import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Game {
  static anonymousClockIn ({ tempId, name, snapshot, tableNumber, cid }) {
    const service = new Service(
      {
        url: '/clock-in/anonymous',
        method: 'POST',
        data: {
          tempId,
          name,
          snapshot,
          tableNumber,
          cid,
        },
      },
      {
        denormalizer: Denormalizer.AnonymousClockIn,
        normalizer: Normalizer.GetAnnoymousCid,
      }
    )

    return service.callApi()
  }

  static memberClockInById ({ id, tableNumber }) {
    console.warn('clockMember', tableNumber)
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          id,
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInById,
      }
    )

    return service.callApi()
  }

  static memberClockInByMemberCard ({ memberCard }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          memberCard,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInByMemberCard,
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
