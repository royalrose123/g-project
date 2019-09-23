import Denormalizer from './denormalizer'
// import Normalizer from './normalizer'

import Service from '../service'

class Game {
  static anonymousClockIn ({ tempId, name, snapshot, tableNumber, seatNumber }) {
    const service = new Service(
      {
        url: '/clock-in/anonymous',
        method: 'POST',
        data: {
          tempId,
          name,
          snapshot,
          tableNumber,
          seatNumber,
        },
      },
      {
        denormalizer: Denormalizer.AnonymousClockIn,
      }
    )

    return service.callApi()
  }

  static memberClockInById ({ id, tableNumber, seatNumber }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          id,
          tableNumber,
          seatNumber,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInById,
      }
    )

    return service.callApi()
  }

  static memberClockInByMemberCard ({ memberCard, seatNumber }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          memberCard,
          seatNumber,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInByMemberCard,
      }
    )

    return service.callApi()
  }

  static clockOut ({ id, playTypeNumber, propPlay, averageBet, actualWin, drop, overage, tableNumber, overallWinner, type, praValue }) {
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
          praValue,
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
