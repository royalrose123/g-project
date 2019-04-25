class Denormalizer {
  static FetchMemberDetail ({ id }) {
    return {
      cid: Number(id),
    }
  }
}

export default Denormalizer
