import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Recognized from './components/Recognized'
import Seated from './components/Seated'
import Standing from './components/Standing'

// Lib MISC
import useDeepCompareEffect from '../../../../lib/effects/useDeepCompareEffect'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Table (props) {
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null)

  const seated = { seatSize: '40px' }
  const standing = { row: 3, column: 7, placeSize: '40px', placeMargin: '10px' }
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
  const onClockIn = (event, person) => console.log(person)

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
        <Recognized isClockable={isClockable} onClockIn={onClockIn} />
      </div>
    </div>
  )
}

Table.propTypes = propTypes

export default Table
