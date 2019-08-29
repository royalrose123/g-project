import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Member {
  // require clock in
  static fetchMemberDetailById ({ id }) {
    const service = new Service(
      {
        // url: '/enquiry-customer', // 此 API 如果 clock in/out into Dynamiq 沒勾，就沒辦法 call 此 API
        url: '/fetch-gcdi', /// / 此 API 抓不到會員照片跟 document number，目前先用此 API，之後有需要用到document number 再調整
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
