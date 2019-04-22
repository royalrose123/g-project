import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import ClockInModal from './components/ClockInModal'
import Recognized from './components/Recognized'
import Seated from './components/Seated'
import Standing from './components/Standing'

// Lib MISC
import useDeepCompareEffect from '../../../../lib/effects/useDeepCompareEffect'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

const persons = [
  {
    name: 'Mark Elliot Zuckerberg',
    similarity: 90.5,
    serialNumber: 1234567,
    rank: 'green',
    avatar: 'https://fakeimg.pl/280x360',
  },
  {
    name: null,
    similarity: 72,
    serialNumber: 7654321,
    rank: null,
    avatar: 'https://fakeimg.pl/280x360',
  },
  {
    name: 'Slavcho Karbashewski',
    similarity: 95,
    serialNumber: 1234567,
    rank: 'gold',
    avatar: 'https://fakeimg.pl/280x360',
  },
  {
    name: null,
    similarity: 77,
    serialNumber: 7654321,
    rank: null,
    avatar: 'https://fakeimg.pl/280x360',
  },
  {
    name: 'Wan Gengxin',
    similarity: 92.5,
    serialNumber: 1234567,
    rank: 'platunum',
    avatar: 'https://fakeimg.pl/280x360',
  },
  {
    name: 'Amelia Edwards',
    similarity: 94,
    serialNumber: 1234567,
    rank: 'silver',
    avatar: 'https://fakeimg.pl/280x360',
  },
]

export const propTypes = {}

function Table (props) {
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null)
  const [currentPerson, setCurrentPerson] = useState(null)
  const [isClockInModalOpened, setIsClockInModalOpened] = useState(false)

  const seated = { seatSize: '102px' }
  const standing = { row: 3, column: 6, placeSize: '102px', placeMargin: '25px' }
  useDeepCompareEffect(() => {
    document.documentElement.style.setProperty('--seated-seat-size', seated.seatSize)

    document.documentElement.style.setProperty('--standing-row', standing.row)
    document.documentElement.style.setProperty('--standing-column', standing.column)
    document.documentElement.style.setProperty('--standing-place-size', standing.placeSize)
    document.documentElement.style.setProperty('--standing-place-margin', standing.placeMargin)
  }, [seated, standing])

  // Seat
  const onSeatSelect = (event, index) => (selectedSeatIndex === index ? setSelectedSeatIndex(null) : setSelectedSeatIndex(index))

  // Recognized
  const isClockable = selectedSeatIndex !== null
  const onClockIn = (event, person) => {
    setIsClockInModalOpened(true)
    setCurrentPerson(person)
  }

  // Modal
  const onModalClose = event => {
    setIsClockInModalOpened(false)
    setCurrentPerson(null)
  }

  return (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated selectedIndex={selectedSeatIndex} onSeatSelect={onSeatSelect} />
          <h2 className={cx('home-table__title')}>Seated</h2>
        </div>
        <div className={cx('home-table__column')}>
          <Standing row={standing.row} column={standing.column} />
          <h2 className={cx('home-table__title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>
        <Recognized persons={persons} isClockable={isClockable} onClockIn={onClockIn} />
      </div>
      <ClockInModal person={currentPerson} isOpened={isClockInModalOpened} onClose={onModalClose} />
    </div>
  )
}

Table.propTypes = propTypes

export default Table
