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
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  onPlaceSelect: PropTypes.func,
}

export const defaultProps = {
  onPlaceSelect: () => null,
}

function Standing (props) {
  const { row, column, onPlaceSelect } = props

  const count = row * column

  return (
    <div className={cx('home-table-standing')}>
      {new Array(count).fill().map((empty, index) => (
        <button key={index} type='button' className={cx('home-table-standing__place')} onClick={event => onPlaceSelect(event, index)}>
          <img src='https://fakeimg.pl/28' alt='' />
        </button>
      ))}
    </div>
  )
}

Standing.propTypes = propTypes
Standing.defaultProps = defaultProps

export default Standing
