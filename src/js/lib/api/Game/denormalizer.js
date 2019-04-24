class Denormalizer {
  static MemberClockIn ({ body: { customerId, memberCardNumber } }) {
    return {
      body: {
        cid: customerId,
        cda: memberCardNumber,
      },
    }
  }
}

export default Denormalizer
