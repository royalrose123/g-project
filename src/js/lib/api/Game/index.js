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

  static clockOut ({ id, playTypeNumber, propPlay, averageBet, actualWin, drop, overage, tableNumber, overallWinner, type }) {
    const service = new Service(
      {
        url: '/clock-out',
        method: 'POST',
        data: {
          id, // requierd
          playTypeNumber,
          propPlay,
          averageBet,
          overallWinner,
          actualWin, // requierd
          drop,
          overage,
          tableNumber,
          type,
        },
      },
      {
        denormalizer: Denormalizer.ClockOut,
      }
    )

    return service.callApi()
  }

  static clockOutAll ({ memberIdList, tableNumber }) {
    const service = new Service(
      {
        url: '/clock-out/batch',
        method: 'POST',
        data: {
          memberIdList,
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.ClockOutAll,
      }
    )

    return service.callApi()
  }
}

export default Game
