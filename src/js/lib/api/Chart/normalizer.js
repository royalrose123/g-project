// import Service from '../service'

class Normalizer {
  static ChartDataByType (payload) {
    return {
      payload: payload.map(data => ({ ...data, time: data.time.map(date => date.split(' ')[1]) })), // 將日期 2019/09/15 23:00:00 轉換成 23:00:00
    }
  }
}

export default Normalizer
