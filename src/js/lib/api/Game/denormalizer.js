class Denormalizer {
  static MemberClockInById ({ body: { id } }) {
    return {
      body: {
        cid: Number(id),
      },
    }
  }

  static MemberClockInByCardNumber ({ body: { cardNumber } }) {
    return {
      body: {
        cda: Number(cardNumber),
      },
    }
  }

  static ClockOut ({ body: { id, playType, propPlay, averageBet, whoWin, actualWin, drop, overage } }) {
    return {
      body: {
        cid: Number(id),
        ptn: Number(playType),
        pgp: propPlay.length === 0 ? null : Number(propPlay),
        abt: averageBet.length === 0 ? null : Number(averageBet),

        // whoWin,
        aws: actualWin.length === 0 ? null : Number(actualWin),
        drp: drop.length === 0 ? null : Number(drop),
        ovg: overage.length === 0 ? null : Number(overage),
      },
    }
  }
}

export default Denormalizer
