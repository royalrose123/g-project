class Denormalizer {
  static GetChartDataByType ({ chartDate, chartType }) {
    return {
      date: chartDate,
      type: chartType,
    }
  }
}

export default Denormalizer
