import CARD_TYPE from '../../../constants/CardType'
import toBase64Src from '../../utils/to-base64-src'

class Normalizer {
  static MemberDetail ({ cid, cnm, ctc, dob, gen, idDocNo, pgpDen, pic, drp, ptn, pgp, abt, awl }) {
    return {
      id: String(cid),
      name: cnm,
      // transform base64 to src
      image: toBase64Src(pic),
      level: CARD_TYPE[ctc],
      playTimes: pgpDen,
      gender: gen,
      birthday: dob,
      documentNumber: idDocNo,
      drop: drp,
      playType: ptn,
      propPlay: pgp,
      averageBet: abt,
      actualWin: awl,
    }
  }

  static MemberDetailByMemberCard ({ dpiCid, dpiCnm, dpiCtc, dpiCtd, dpiCti, dpiDob, dpiGen, pic }) {
    return {
      id: String(dpiCid),
      name: dpiCnm,
      // transform base64 to src
      image: toBase64Src(pic),
      level: CARD_TYPE[dpiCtc],
      // dpiCtd,
      // dpiCti,
      gender: dpiGen,
      birthday: dpiDob,
    }
  }
}

export default Normalizer
