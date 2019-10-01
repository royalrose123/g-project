import Denormalizer from './denormalizer'
// import Normalizer from './normalizer'

import Service from '../service'

class Game {
  static anonymousClockIn ({ tempId, name, snapshot, tableNumber, seatNumber, cardType }) {
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
          cardType,
        },
      },
      {
        denormalizer: Denormalizer.AnonymousClockIn,
      }
    )

    return service.callApi()
  }

  static memberClockInById ({ id, tableNumber, seatNumber, cardType }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          id,
          tableNumber,
          seatNumber,
          cardType,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInById,
      }
    )

    return service.callApi()
  }

  static memberClockInByMemberCard ({ memberCard, seatNumber, cardType }) {
    const service = new Service(
      {
        url: '/clock-in/member',
        method: 'POST',
        data: {
          memberCard,
          seatNumber,
          cardType,
        },
      },
      {
        denormalizer: Denormalizer.MemberClockInByMemberCard,
      }
    )

    return service.callApi()
  }

  static clockOut ({
    id,
    tempId,
    playTypeNumber,
    propPlay,
    averageBet,
    actualWin,
    drop,
    overage,
    playTypeNumberOverride,
    propPlayOverride,
    averageBetOverride,
    actualWinOverride,
    tableNumber,
    overallWinner,
    type,
    cardType,
    praValue,
    seatNumber,
  }) {
    const service = new Service(
      {
        url: '/clock-out',
        method: 'POST',
        data: {
          id, // requierd
          tempId,
          playTypeNumber,
          propPlay,
          averageBet,
          overallWinner,
          actualWin, // requierd
          drop,
          overage,
          playTypeNumberOverride,
          propPlayOverride,
          averageBetOverride,
          actualWinOverride,
          tableNumber,
          type,
          cardType,
          praValue,
          seatNumber,
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
