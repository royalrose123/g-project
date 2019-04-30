import Service from '../service'

class Normalizer {
  static ProbableItem ({ image, similarity, peopleId, peopleName }) {
    return {
      image,
      // TODO: 暫時先用假的圖片
      // image: 'https://fakeimg.pl/280x360',
      similarity,
      id: peopleId,
      name: peopleName,
      // TODO: 暫時先用假的等級
      level: ['green', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * Math.floor(3))],
    }
  }

  static ProbableList (payload) {
    return Service.normalizeList(payload, Normalizer.ProbableItem)
  }

  static DetectionItem ({ type, faceImage, background, rect, result }) {
    return {
      type,
      snapshot: faceImage,
      // TODO: 暫時先用假的圖片
      // snapshot: 'https://fakeimg.pl/280x360',
      background,
      rect,
      probableList: Normalizer.ProbableList(result),
    }
  }

  static DetectionList (payload) {
    return Service.normalizeList(payload, Normalizer.DetectionItem)
  }
}

export default Normalizer
