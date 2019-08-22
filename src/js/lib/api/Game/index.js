import Denormalizer from './denormalizer'
// import Normalizer from './normalizer'

import Service from '../service'

class Game {
  static anonymousClockIn ({ tempId, name, snapshot, tableNumber }) {
    const service = new Service(
      {
        url: '/clock-in/anonymous',
        method: 'POST',
        data: {
          tempId,
          name,
          snapshot,
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.AnonymousClockIn,
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

  static clockOut ({ id, playType, propPlay, averageBet, actualWin, drop, overage, tableNumber, overallWinner }) {
    console.log('gameApi clockout tableName', tableNumber)
    console.log('gameApi clockout overallWinner', overallWinner)
    const service = new Service(
      {
        url: '/clock-out',
        method: 'POST',
        data: {
          id, // requierd
          playType,
          propPlay,
          averageBet,
          overallWinner,
          actualWin, // requierd
          drop,
          overage,
          tableNumber,
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
