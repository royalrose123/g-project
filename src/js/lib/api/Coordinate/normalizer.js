class Normalizer {
  static GetCoordinate ({ tableNumber, seatedCoordinate }) {
    return {
      tableName: tableNumber,
      cameraA: JSON.parse(seatedCoordinate.cameraA), // 後端回傳字串，需轉成 json 檔
      cameraB: JSON.parse(seatedCoordinate.cameraB),
    }
  }
}

export default Normalizer
