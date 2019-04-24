import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'

// Components
import Person from '../Person'

// Lib MISC
import useFetcher from '../../../../../../lib/effects/useFetcher'
import DetectionApi from '../../../../../../lib/api/Detection'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isActionDisabled: PropTypes.bool,
  onActionClick: PropTypes.func,
}

function Detection (props) {
  const { isActionDisabled, onActionClick } = props

  const { isLoaded, response: detectionList } = useFetcher(null, DetectionApi.fetchDetectionList)

  console.log('detectionList :', detectionList)

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
          {detectionList.map((person, index) => (
            <div key={index} style={{ padding: `${itemBorder}px ${itemSpacing}px` }}>
              <Person
                person={person}
                isClockable
                isSelectable={false}
                showId={false}
                showSimilarity={false}
                isActionDisabled={isActionDisabled}
                onActionClick={onActionClick}
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
