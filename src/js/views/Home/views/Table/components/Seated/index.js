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
  seatList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    })
  ).isRequired,
  selectedIndex: PropTypes.number,
  onPlaceSelect: PropTypes.func,
}

function Seated (props) {
  const { seatList, selectedIndex, onPlaceSelect } = props

  return (
    <div className={cx('home-table-seated')}>
      {seatList.map((seatItem, index) => (
        <button
          key={index}
          type='button'
          className={cx('home-table-seated__seat')}
          onClick={event => onPlaceSelect(event, { index, place: seatItem, isStanding: false })}
          data-is-selected={index === selectedIndex}
        >
          {typeof seatItem === 'object' ? (
            <img className={cx('home-table-seated__seat-image')} src={seatItem.image} />
          ) : (
            <span className={cx('home-table-seated__seat-empty')}>{index + 1}</span>
          )}
        </button>
      ))}
      <div className={cx('home-table-seated__desk')} />
    </div>
  )
}

Seated.propTypes = propTypes

export default Seated
