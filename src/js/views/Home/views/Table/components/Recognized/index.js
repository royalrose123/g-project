import React, { useRef } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'

// Components
import Person from './components/Person'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

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
  // isClockable
  // onClockIn

  const aaa = useRef()

  console.log('aaa', aaa)

  return (
    <div className={cx('home-table-recognized')}>
      <Carousel
        autoGenerateStyleTag={false}
        withoutControls
        heightMode='current'
        edgeEasing='easeBackOut'
        // framePadding='0 20px'
        // cellSpacing={40}
        slideWidth='200px'
        slidesToScroll='auto'
        speed={800}
        ref={aaa}
      >
        {[...persons, ...persons, ...persons, ...persons, ...persons, ...persons].map((person, index) => (
          <Person key={index} person={person} isClockable />
        ))}
      </Carousel>
    </div>
  )
}

Recognized.propTypes = propTypes

export default Recognized
