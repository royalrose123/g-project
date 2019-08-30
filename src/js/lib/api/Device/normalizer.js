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

  static DetectionItem ({ type, faceImage, background, rect, result, dateTime, cameraId }) {
    return {
      type,
      snapshot: faceImage,
      background,
      rect,
      probableList: Normalizer.ProbableList(result),
      dateTime,
      cameraId,
    }
  }

  static DetectionList (payload) {
    return {
      detectionList: Service.normalizeList(payload.peopleDetectionDTO, Normalizer.DetectionItem),
      stay: payload.stay,
      leave: payload.leave,
    }
  }

  static CameraItem ({ cameraId, url }) {
    const serverIp = '10.1.1.19:10080'

    return {
      id: cameraId,
      rtspUrl: url,
      // websocketUrl: `ws://${window.encodeURIComponent(url.replace('rtsp://', ''))}/camera_relay?tcpaddr=${serverIp}`,
      websocketUrl: `ws://${serverIp}/camera_relay?tcpaddr=${window.encodeURIComponent(url.replace('rtsp://', ''))}`,
    }
  }

  static CameraList (payload) {
    return Service.normalizeList(payload, Normalizer.CameraItem)
  }
}

export default Normalizer
