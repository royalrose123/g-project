class Denormalizer {
  static FetchDetectionList ({ tableNumber }) {
    return {
      // TODO: 暫時先寫死，未來會從 config 帶值
      table: tableNumber,
    }
  }

  static FetchCameraList ({ tableNumber }) {
    console.warn(tableNumber)
    return {
      // TODO: 暫時先寫死，未來會從 config 帶值
      table: 'Table-0822',
    }
  }
}

export default Denormalizer
