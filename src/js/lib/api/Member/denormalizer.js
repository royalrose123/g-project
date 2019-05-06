class Denormalizer {
  static FetchMemberDetailById ({ id }) {
    return {
      cid: Number(id),
    }
  }

  static FetchMemberDetailByMemberCard ({ memberCard }) {
    return {
      cda: memberCard,
    }
  }
}

export default Denormalizer
