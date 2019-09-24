class Denormalizer {
  static FetchMemberDetailByIdWithType ({ id, type, tableNumber, cardType }) {
    return {
      cid: Number(id),
      tableName: tableNumber,
      type,
      cardType,
    }
  }

  static FetchMemberDetailByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }
}

export default Denormalizer
