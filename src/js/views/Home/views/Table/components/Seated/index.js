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
  selectedIndex: PropTypes.number,
  onSeatSelect: PropTypes.func,
}

export const defaultProps = {
  onSeatSelect: () => null,
}

function Seated (props) {
  const { selectedIndex, onSeatSelect } = props

  const count = 7

  return (
    <div className={cx('home-table-seated')}>
      {new Array(count).fill().map((empty, index) => (
        <button
          key={index}
          type='button'
          className={cx('home-table-seated__seat')}
          onClick={event => onSeatSelect(event, index)}
          data-is-selected={index === selectedIndex}
        >
          {index + 1}
        </button>
      ))}
      <div className={cx('home-table-seated__desk')} />
    </div>
  )
}

Seated.propTypes = propTypes
Seated.defaultProps = defaultProps

export default Seated
