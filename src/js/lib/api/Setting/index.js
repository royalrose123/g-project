import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Setting {
  static fetchSettingDetail ({ tableNumber }) {
    const service = new Service(
      {
        url: '/setting/system',
        method: 'GET',
        params: {
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.FetchSettingDetail,
        normalizer: Normalizer.SettingDetail,
      }
    )
    return service.callApi()
  }

  static postSettingDetail ({ systemSettings, autoSettings, defaultRecord }) {
    const service = new Service(
      {
        url: '/setting/system',
        method: 'POST',
        data: {
          systemSettings,
          autoSettings,
          defaultRecord,
        },
      },
      {
        denormalizer: Denormalizer.PostSettingDetail,
      }
    )
    return service.callApi()
  }

  static getTableList ({ tableList }) {
    const service = new Service(
      {
        url: '/active-table',
        method: 'GET',
        params: {
          tableList,
        },
      },
      {
        denormalizer: Denormalizer.FetchTableList,
        normalizer: Normalizer.GetTableList,
      }
    )
    return service.callApi()
  }

  static activeTable ({ selectedTableName }) {
    const service = new Service(
      {
        url: '/active-table',
        method: 'POST',
        params: {
          selectedTableName,
        },
      },
      {
        denormalizer: Denormalizer.ActiveTable,
      }
    )
    return service.callApi()
  }

  static deactiveTable ({ tableNumber }) {
    const service = new Service(
      {
        url: '/shutdown-table',
        method: 'POST',
        params: {
          tableNumber,
        },
      },
      {
        denormalizer: Denormalizer.DeactiveTable,
      }
    )
    return service.callApi()
  }
}

export default Setting
