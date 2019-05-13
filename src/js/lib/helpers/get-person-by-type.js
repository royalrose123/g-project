import { BigNumber } from 'bignumber.js'

import PERSON_TYPE from '../../constants/PersonType'

const SIMILARITY_MATCH_PERCENT = 90

export default function getPersonByTypeFromDetectionItem (type, detectionItem) {
  const { snapshot, probableList } = detectionItem

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
        compareImage: image,
        isProbablyMember: probableList.some(
          probableItem => probableItem.id && new BigNumber(probableItem.similarity).isGreaterThanOrEqualTo(SIMILARITY_MATCH_PERCENT)
        ),
        ...member,
      }
      break
  }

  return person
}
