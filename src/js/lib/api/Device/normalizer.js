import { BigNumber } from 'bignumber.js'
import LocationHostname from '../../../constants/LocationHostname'

import Service from '../service'

class Normalizer {
  static ProbableItem ({ image, similarity, idcard, peopleId, peopleName, ctc }) {
    return {
      image: `https://${LocationHostname}:450${image}`,
      // 來的時候是小數點，需要乘以一百，再無條件捨去
      similarity: Number(new BigNumber(similarity).multipliedBy(100).integerValue(BigNumber.ROUND_FLOOR)),
      id: idcard,
      tempId: peopleId,
      name: peopleName,
      level: ctc,
    }
  }

  static ProbableList (payload) {
    return Service.normalizeList(payload, Normalizer.ProbableItem)
  }

  static DetectionItem ({ type, faceImage, background, rect, result, dateTime, cameraId }) {
    return {
      type,
      snapshot: `https://${LocationHostname}:450${faceImage}`,
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
    // const serverIp = process.env.FR_SERVER_IP_PORT // 寫在 package.json，npm start/build 時直接注入
    const serverIp = `${LocationHostname}:450` // 取得 localhost IP
    return {
      id: cameraId,
      rtspUrl: url,
      websocketUrl: `wss://${serverIp}/camera_relay?tcpaddr=${window.encodeURIComponent(url.replace('rtsp://', ''))}`,
    }
  }

  static CameraList (payload) {
    return Service.normalizeList(payload, Normalizer.CameraItem)
  }
}

export default Normalizer
