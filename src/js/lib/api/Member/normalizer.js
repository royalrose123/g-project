// import CARD_TYPE from '../../../constants/CardType'
import toBase64Src from '../../utils/to-base64-src'

class Normalizer {
  static MemberDetail ({ cid, cnm, ctc, dob, gen, idDocNo, pgpDen, pic, drp, ptn, pgp, abt, awl, ptcfg, pra }) {
    return {
      id: String(cid),
      name: cnm,
      // transform base64 to src
      image: toBase64Src(pic),
      level: ctc,
      playTimes: pgpDen,
      gender: gen,
      birthday: dob,
      documentNumber: idDocNo,
      drop: drp,
      propPlay: pgp,
      averageBet: abt,
      actualWin: awl,
      playTypeList: ptcfg ? ptcfg.pt : [], // 後端 ptcfg.pt 為陣列
      playTypeNumber: ptn,
      praValue: pra,
    }
  }

  static MemberDetailByMemberCard ({ dpiCid, dpiCnm, dpiCtc, dpiCtd, dpiCti, dpiDob, dpiGen, pic }) {
    return {
      id: String(dpiCid),
      name: dpiCnm,
      // transform base64 to src
      image: toBase64Src(pic),
      level: dpiCtc,
      // dpiCtd,
      // dpiCti,
      gender: dpiGen,
      birthday: dpiDob,
    }
  }
}

export default Normalizer
