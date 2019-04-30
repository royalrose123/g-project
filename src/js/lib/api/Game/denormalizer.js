class Denormalizer {
  static AnonymousClockIn ({ snapshot }) {
    return {
      // 格式為 [RandomString]
      cnm: `[${Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)}]`,
      pic: snapshot,
    }
  }

  static MemberClockInById ({ id }) {
    return {
      cid: Number(id),
    }
  }

  static MemberClockInByCardNumber ({ cardNumber }) {
    return {
      cda: Number(cardNumber),
    }
  }

  static ClockOut ({ id, playType, propPlay, averageBet, actualWin, drop, overage }) {
    return {
      cid: Number(id),
      ptn: Number(playType),
      pgp: propPlay.length === 0 ? null : Number(propPlay),
      abt: averageBet.length === 0 ? null : Number(averageBet),
      aws: actualWin.length === 0 ? null : Number(actualWin),
      drp: drop.length === 0 ? null : Number(drop),
      ovg: overage.length === 0 ? null : Number(overage),
    }
  }
}

export default Denormalizer
