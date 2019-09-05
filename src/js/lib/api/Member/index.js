import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Member {
  static fetchMemberDetailByIdWithType ({ id, type, tableNumber }) {
    const service = new Service(
      {
        url: '/get-clockoutInfo', // 由後端判斷 clock in/out member/anonymous into Dynamiq 是否被勾選，傳回對應 API 的 response
        method: 'POST',
        data: {
          id,
          type,
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.FetchMemberDetailByIdWithType,
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
