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
}

export default Denormalizer
