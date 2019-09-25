class Denormalizer {
  static FetchMemberDetailByIdWithType ({ id, type, tableNumber, cardType }) {
    console.log('cardType', cardType)
    return {
      cid: String(id),
      tableName: tableNumber,
      type,
      ctc: cardType,
    }
  }

  static FetchMemberDetailByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }
}

export default Denormalizer
