import { BigNumber } from 'bignumber.js'

import PERSON_TYPE from '../../constants/PersonType'

export default function getPersonByTypeFromDetectionItem (type, detectionItem, matchPercent) {
  const { snapshot, probableList } = detectionItem
  const SIMILARITY_MATCH_PERCENT = matchPercent //  probableList 有人 similarity 大於 SIMILARITY_MATCH_PERCENT 才傳回 probableList

  let person = null
  const { image, ...member } = probableList.sort((a, b) => new BigNumber(b.similarity).comparedTo(a.similarity))[0] || {}

  switch (type) {
    case PERSON_TYPE.MEMBER:
      person = {
        image: snapshot,
        compareImage: image,
        ...member,
      }
      break

    case PERSON_TYPE.ANONYMOUS:
      person = {
        image: snapshot,
        isProbablyMember: probableList.some(
          probableItem => probableItem.id && new BigNumber(probableItem.similarity).isGreaterThanOrEqualTo(SIMILARITY_MATCH_PERCENT)
        ),
        ...member,
      }
      break
  }

  return person
}
