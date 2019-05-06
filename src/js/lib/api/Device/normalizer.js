import { BigNumber } from 'bignumber.js'

import CARD_TYPE from '../../../constants/CardType'
import Service from '../service'

class Normalizer {
  static ProbableItem ({ image, similarity, idcard, peopleId, peopleName, ctc }) {
    return {
      image,
      // 來的時候是小數點，需要乘以一百，再無條件捨去
      similarity: Number(new BigNumber(similarity).multipliedBy(100).integerValue(BigNumber.ROUND_FLOOR)),
      id: idcard,
      tempId: peopleId,
      name: peopleName,
      level: CARD_TYPE[ctc],
    }
  }

  static ProbableList (payload) {
    return Service.normalizeList(payload, Normalizer.ProbableItem)
  }

  static DetectionItem ({ type, faceImage, background, rect, result }) {
    return {
      type,
      snapshot: faceImage,
      background,
      rect,
      probableList: Normalizer.ProbableList(result),
    }
  }

  static DetectionList (payload) {
    return Service.normalizeList(payload, Normalizer.DetectionItem)
  }

  static CameraItem ({ cameraId, url }) {
    const serverIp = '192.168.100.18:10080'

    return {
      id: cameraId,
      rtspUrl: url,
      websocketUrl: `ws://${serverIp}/camera_relay?tcpaddr=${window.encodeURIComponent(url.replace('rtsp://', ''))}`,
    }
  }

  static CameraList (payload) {
    return Service.normalizeList(payload, Normalizer.CameraItem)
  }
}

export default Normalizer
