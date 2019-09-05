class Denormalizer {
  static FetchMemberDetailByIdWithType ({ id, type, tableNumber }) {
    return {
      cid: Number(id),
      tableName: tableNumber,
      type: type,
    }
  }

  static FetchMemberDetailByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }
}

export default Denormalizer
