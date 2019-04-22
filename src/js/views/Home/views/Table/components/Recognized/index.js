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
  persons: PropTypes.arrayOf(PersonPropTypes.person),
  isClockable: PropTypes.bool,
  onClockIn: PropTypes.func,
}

function Recognized (props) {
  const { persons, isClockable, onClockIn } = props

  const itemWidth = 280
  const itemSpacing = 40
  const itemBorder = 6

  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  return (
    <div className={cx('home-table-recognized')}>
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
        {[...persons, ...persons].map((person, index) => (
          <div key={index} style={{ padding: `${itemBorder}px ${itemSpacing}px` }}>
            <Person person={person} isClockable={isClockable} onClockIn={onClockIn} />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

Recognized.propTypes = propTypes

export default Recognized
