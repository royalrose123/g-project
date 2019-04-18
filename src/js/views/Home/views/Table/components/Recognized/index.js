import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'

// Components
import Person from './components/Person'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isClockable: PropTypes.bool,
  onClockIn: PropTypes.func,
}

const persons = [
  {
    isMember: true,
    serialNumber: 1234567,
    avatar: 'https://fakeimg.pl/120x160',
  },
  {
    isMember: false,
    serialNumber: 7654321,
    avatar: 'https://fakeimg.pl/120x160',
  },
]

function Recognized (props) {
  const { isClockable, onClockIn } = props

  return (
    <div className={cx('home-table-recognized')}>
      <Carousel
        autoGenerateStyleTag={false}
        withoutControls
        heightMode='current'
        edgeEasing='easeBackOut'
        slidesToScroll='auto'
        slideWidth='160px'
        speed={800}
      >
        {[...persons, ...persons, ...persons, ...persons, ...persons, ...persons].map((person, index) => (
          <div key={index} className={cx('home-table-recognized__person-wrapper')}>
            <Person person={person} isClockable={isClockable} onClockIn={onClockIn} />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

Recognized.propTypes = propTypes

export default Recognized
