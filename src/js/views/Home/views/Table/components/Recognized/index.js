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
    name: 'Mark Elliot Zuckerberg',
    isMember: true,
    serialNumber: 1234567,
    rank: 'green',
    avatar: 'https://fakeimg.pl/140x180',
  },
  {
    name: null,
    isMember: false,
    serialNumber: 7654321,
    rank: null,
    avatar: 'https://fakeimg.pl/140x180',
  },
  {
    name: 'Slavcho Karbashewski',
    isMember: true,
    serialNumber: 7654321,
    rank: 'gold',
    avatar: 'https://fakeimg.pl/140x180',
  },
  {
    name: 'Wan Gengxin',
    isMember: true,
    serialNumber: 7654321,
    rank: 'platunum',
    avatar: 'https://fakeimg.pl/140x180',
  },
  {
    name: 'Amelia Edwards',
    isMember: true,
    serialNumber: 7654321,
    rank: 'silver',
    avatar: 'https://fakeimg.pl/140x180',
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
        slideWidth='180px'
        cellSpacing={-20}
        speed={800}
      >
        {[...persons, ...persons, ...persons, ...persons, ...persons, ...persons].map((person, index) => (
          <div key={index} style={{ padding: '0 20px' }}>
            <Person person={person} isClockable={isClockable} onClockIn={onClockIn} />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

Recognized.propTypes = propTypes

export default Recognized
