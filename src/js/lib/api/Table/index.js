import Denormalizer from './denormalizer'
// import Normalizer from './normalizer'

import Service from '../service'

class Table {
  static logOnTable ({ tableNumber, account, password }) {
    const service = new Service(
      {
        url: '/log-on',
        method: 'POST',
        data: {
          tableNumber,
          account,
          password,
        },
      },
      {
        denormalizer: Denormalizer.LogOnTable,
      }
    )

    return service.callApi()
  }

  static logOffTable ({ tableNumber }) {
    const service = new Service(
      {
        url: '/log-off',
        method: 'POST',
        data: {
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.LogOffTable,
      }
    )

    return service.callApi()
  }
}

export default Table
