import toBase64Src from '../../utils/to-base64-src'

class Normalizer {
  static MemberDetail ({ cid, gen, pic, cnm, dob, idDocNo }) {
    return {
      id: String(cid),
      name: cnm,
      // transform base64 to src
      image: toBase64Src(pic),
      // TODO: 暫時先用假的等級
      level: ['green', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 3)],
      // TODO: 暫時先用假的遊戲總數
      playTimes: 80,
      gender: gen,
      birthday: dob,
      documentNumber: idDocNo,
    }
  }
}

export default Normalizer
