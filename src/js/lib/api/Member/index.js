import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Member {
  // require clock in
  static fetchMemberDetailById ({ id }) {
    const service = new Service(
      {
        url: '/enquiry-customer',
        method: 'GET',
        params: {
          id,
        },
      },
      {
        denormalizer: Denormalizer.FetchMemberDetailById,
        normalizer: Normalizer.MemberDetail,
      }
    )

    return service.callApi()
  }

  static fetchMemberDetailByMemberCard ({ memberCard }) {
    const service = new Service(
      {
        url: '/customer/card',
        method: 'GET',
        params: {
          memberCard,
        },
      },
      {
        denormalizer: Denormalizer.FetchMemberDetailByMemberCard,
        normalizer: Normalizer.MemberDetailByMemberCard,
      }
    )

    return service.callApi()
  }
}

export default Member
