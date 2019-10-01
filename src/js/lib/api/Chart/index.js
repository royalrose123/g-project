import Denormalizer from './denormalizer'
import Normalizer from './normalizer'

import Service from '../service'

class Chart {
  static getChartDataByType ({ chartDate, chartType }) {
    const service = new Service(
      {
        url: '/monitor-performance',
        method: 'GET',
        params: {
          chartDate,
          chartType,
        },
      },
      {
        denormalizer: Denormalizer.GetChartDataByType,
        normalizer: Normalizer.ChartDataByType,
      }
    )

    return service.callApi()
  }
}

export default Chart
