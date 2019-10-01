class Denormalizer {
  static FetchMemberDetailByIdWithType ({ id, type, tableNumber, cardType, seatNumber }) {
    return {
      cid: String(id),
      tableName: tableNumber,
      type,
      ctc: cardType,
      seatNo: seatNumber,
    }
  }

  static FetchMemberDetailByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }
}

export default Denormalizer
