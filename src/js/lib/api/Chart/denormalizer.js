class Denormalizer {
  static GetChartDataByType ({ chartDateTime, chartType }) {
    return {
      date: chartDateTime,
      type: chartType,
    }
  }
}

export default Denormalizer
