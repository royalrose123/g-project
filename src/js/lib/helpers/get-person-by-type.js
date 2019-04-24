import { BigNumber } from 'bignumber.js'

import PERSON_TYPE from '../../constants/PersonType'

export default function getPersonByTypeFromDetectionItem (type, detectionItem) {
  const { snapshot, probableList } = detectionItem

  const similarityMatchPercent = 80
  let person = null

  switch (type) {
    case PERSON_TYPE.MEMBER:
      person = {
        ...probableList.sort((probableA, probableB) => new BigNumber(probableB.similarity).comparedTo(probableA.similarity))[0],
        compareImage: snapshot,
      }
      break

    case PERSON_TYPE.ANONYMOUS:
      person = {
        image: snapshot,
        isProbablyMember: probableList.some(probableItem => new BigNumber(probableItem.similarity).isGreaterThanOrEqualTo(similarityMatchPercent)),
      }
      break
  }

  return person
}
