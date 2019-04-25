import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Member {
  static fetchMemberDetail ({ id }) {
    const service = new Service(
      {
        url: '/enquiry-customer',
        method: 'GET',
        params: {
          id,
        },
      },
      {
        denormalizer: Denormalizer.FetchMemberDetail,
        normalizer: Normalizer.MemberDetail,
      }
    )

    return service.callApi()
  }
}

export default Member
