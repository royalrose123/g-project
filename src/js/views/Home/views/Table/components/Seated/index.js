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
  seatedList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    })
  ).isRequired,
  selectedIndex: PropTypes.number,
  onPlaceSelect: PropTypes.func,
}

function Seated (props) {
  const { seatedList, selectedIndex, onPlaceSelect } = props

  return (
    <div className={cx('home-table-seated')}>
      {seatedList.map((seatedItem, index) => (
        <button
          key={index}
          type='button'
          className={cx('home-table-seated__seat')}
          onClick={event => onPlaceSelect(event, { index, place: seatedItem, isStanding: false })}
          data-is-selected={index === selectedIndex}
        >
          {typeof seatedItem === 'object' ? (
            <img className={cx('home-table-seated__seat-image')} src={seatedItem.image} />
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
