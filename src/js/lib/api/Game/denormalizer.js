class Denormalizer {
  static AnonymousClockIn ({ tempId, name, snapshot, tableNumber }) {
    return {
      tempId,
      // 格式為 [RandomString]
      cnm: `[${name}-${Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)}]`,
      pic: snapshot,
      tableName: tableNumber,
    }
  }

  static MemberClockInById ({ id, tableNumber }) {
    return {
      // 跟後端協調後，收到時為 string，送出時轉成 number
      cid: Number(id),
      tableName: tableNumber,
    }
  }

  static MemberClockInByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }

  static ClockOut ({ id, playType, propPlay, averageBet, actualWin, drop, overage, overallWinner, tableNumber }) {
    return {
      cid: Number(id),
      ptn: Number(playType),
      pgp: propPlay.length === 0 ? null : Number(propPlay),
      abt: averageBet.length === 0 ? null : Number(averageBet),
      awl: actualWin.length === 0 ? null : Number(actualWin),
      drp: drop.length === 0 ? null : Number(drop),
      ovg: overage.length === 0 ? null : Number(overage),
      tableName: tableNumber,
      whoWin: overallWinner,
      // whoWin:
    }
  }
}

export default Denormalizer
