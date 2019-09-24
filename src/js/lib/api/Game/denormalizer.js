class Denormalizer {
  static AnonymousClockIn ({ tempId, name, snapshot, tableNumber, seatNumber, cardType }) {
    return {
      tempId,
      // 格式為 [RandomString]
      cnm: `[${name}-${Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)}]`,
      pic: snapshot,
      tableName: tableNumber,
      seatNo: seatNumber,
      ctc: cardType,
    }
  }

  static MemberClockInById ({ id, tableNumber, seatNumber, cardType }) {
    return {
      // 跟後端協調後，收到時為 string，送出時轉成 number
      cid: Number(id),
      tableName: tableNumber,
      seatNo: seatNumber,
      ctc: cardType,
    }
  }

  static MemberClockInByMemberCard ({ memberCard, seatNumber, cardType }) {
    return {
      cda: memberCard,
      seatNo: seatNumber,
      ctc: cardType,
    }
  }

  static ClockOut ({
    id,
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
    overallWinner,
    tableNumber,
    type,
    cardType,
    praValue,
  }) {
    return {
      cid: Number(id),
      ptn: playTypeNumber?.length === 0 ? null : Number(playTypeNumber),
      pgp: propPlay?.length === 0 ? null : Number(propPlay),
      abt: averageBet?.length === 0 ? null : Number(averageBet),
      awl: actualWin?.length === 0 ? null : Number(actualWin),
      drp: drop?.length === 0 ? null : Number(drop),
      ovg: overage?.length === 0 ? null : Number(overage),
      ptnMmOvr: playTypeNumberOverride,
      pgpMmOvr: propPlayOverride,
      abtMmOvr: averageBetOverride,
      awlMmOvr: actualWinOverride,
      tableName: tableNumber,
      whoWin: overallWinner,
      type,
      ctc: cardType,
      pra: Number(praValue),
    }
  }

  static ClockOutAll ({ memberIdList, tableNumber }) {
    return {
      clockOutDtl: memberIdList,
      tableName: tableNumber,
    }
  }
}

export default Denormalizer
