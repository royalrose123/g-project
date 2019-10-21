import LogOnId from '../../../constants/LogOnId'
class Denormalizer {
  static LogOnTable ({ tableNumber, account, password }) {
    return {
      tableName: tableNumber,
      // uid: process.env.LOG_ON_ID, // 目前寫死在前端 // Dual PC：'DYFR', CI: '1'
      // upw: process.env.LOG_ON_PASSWORD, // 目前寫死在前端    // Dual PC：'1', CI: '1'
      uid: LogOnId[tableNumber]?.account, // TODO: 未來拿到對應的 Table user, password 再填入
      upw: LogOnId[tableNumber]?.password, // TODO: 未來拿到對應的 Table user, password 再填入
    }
  }

  static LogOffTable ({ tableNumber }) {
    return {
      tableName: tableNumber,
    }
  }
}

export default Denormalizer
