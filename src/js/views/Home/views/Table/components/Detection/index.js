import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'

// Components
import Person, { propTypes as PersonPropTypes } from '../Person'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  detectionList: PropTypes.arrayOf(PersonPropTypes.person),
  isActionDisabled: PropTypes.bool,
  onActionClick: PropTypes.func,
}

function Detection (props) {
  const { detectionList, isActionDisabled, onActionClick } = props

  const itemWidth = 280
  const itemSpacing = 40
  const itemBorder = 6

  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  return (
    <div className={cx('home-table-detection')}>
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
        {[...detectionList, ...detectionList].map((person, index) => (
          <div key={index} style={{ padding: `${itemBorder}px ${itemSpacing}px` }}>
            <Person
              person={person}
              isClockable
              isSelectable={false}
              showSerialNumber={false}
              showSimilarity={false}
              isActionDisabled={isActionDisabled}
              onActionClick={onActionClick}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

Detection.propTypes = propTypes

export default Detection
