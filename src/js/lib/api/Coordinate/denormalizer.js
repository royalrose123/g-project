class Denormalizer {
  static FetchCoordinate ({ tableNumber }) {
    return {
      tableName: tableNumber,
    }
  }

  static PostCoordinate ({ tableNumber, cameraA, cameraB }) {
    return {
      tableName: tableNumber,
      seatedCoordinateA: cameraA,
      seatedCoordinateB: cameraB,
    }
  }
}

export default Denormalizer
