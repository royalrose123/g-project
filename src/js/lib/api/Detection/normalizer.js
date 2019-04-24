import Service from '../service'

class Normalizer {
  static ProbableItem ({ image, similarity, peopleId, peopleName }) {
    return {
      // image,
      // TODO: 暫時先用假的圖片
      image: 'https://fakeimg.pl/280x360',
      similarity,
      id: peopleId,
      name: peopleName,
    }
  }

  static ProbableList (payload) {
    return Service.normalizeList(payload, Normalizer.ProbableItem)
  }

  static DetectionItem ({ cameraId, type, faceImage, background, rect, dateTime, standing, result }) {
    return {
      cameraId,
      type,
      // image: faceImage,
      // TODO: 暫時先用假的圖片
      image: 'https://fakeimg.pl/280x360',
      background,
      rect,
      dateTime,
      isStanding: standing,
      probableList: Normalizer.ProbableList(result),
    }
  }

  static DetectionList (payload) {
    return Service.normalizeList(payload, Normalizer.DetectionItem)
  }
}

export default Normalizer
