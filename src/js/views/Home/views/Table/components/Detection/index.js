import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'

// Lib MISC
import useFetcher from '../../../../../../lib/effects/useFetcher'
import DetectionApi from '../../../../../../lib/api/Detection'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../constants/PersonType'
const cx = classnames.bind(styles)
const getPersonByType = payload => {
  if (payload.type === PERSON_TYPE.ANONYMOUS) {
    return { image: payload.snapshot }
  } else if (payload.type === PERSON_TYPE.MEMBER) {
    return { ...payload.probableList.sort((probableA, probableB) => new BigNumber(probableA.similarity).comparedTo(probableB.similarity))[0] }
  }
}

export const propTypes = {
  isSeatSelected: PropTypes.bool,
  onItemActionClick: PropTypes.func,
}

function Detection (props) {
  const { isSeatSelected, onItemActionClick } = props

  const { isLoaded, response: detectionList } = useFetcher(null, DetectionApi.fetchDetectionList)

  const itemWidth = 280
  const itemSpacing = 40
  const itemBorder = 6

  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  return (
    <div className={cx('home-table-detection')}>
      {isLoaded ? (
        <Carousel
          autoGenerateStyleTag={false}
          withoutControls
          heightMode='current'
          edgeEasing='easeBackOut'
          slidesToScroll='auto'
          slideWidth={slideWidth}
          cellSpacing={slideSpacing}
          speed={800}
        >
          {detectionList.map((detectionItem, index) => (
            <div key={index} style={{ padding: `${itemBorder}px ${itemSpacing}px` }}>
              <Person
                title='level'
                type={detectionItem.type}
                person={getPersonByType(detectionItem)}
                renderFooter={() => (
                  <Button isBlock disabled={!isSeatSelected} onClick={event => onItemActionClick(event, detectionItem)}>
                    Clock-In
                  </Button>
                )}
              />
            </div>
          ))}
        </Carousel>
      ) : null}
    </div>
  )
}

Detection.propTypes = propTypes

export default Detection
