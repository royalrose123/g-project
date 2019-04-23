import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  seatList: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  onSeatSelect: PropTypes.func,
}

export const defaultProps = {
  onSeatSelect: () => null,
}

function Seated (props) {
  const { seatList, selectedIndex, onSeatSelect } = props

  return (
    <div className={cx('home-table-seated')}>
      {seatList.map((seatItem, index) => (
        <button
          key={index}
          type='button'
          className={cx('home-table-seated__seat')}
          onClick={event => onSeatSelect(event, index, seatItem)}
          data-is-selected={index === selectedIndex}
        >
          {seatItem.isSeated ? (
            <img className={cx('home-table-seated__seat-image')} src={seatItem.detectedPhoto} />
          ) : (
            <span className={cx('home-table-seated__seat-empty')}> {seatItem.content}</span>
          )}
        </button>
      ))}
      <div className={cx('home-table-seated__desk')} />
    </div>
  )
}

Seated.propTypes = propTypes
Seated.defaultProps = defaultProps

export default Seated
