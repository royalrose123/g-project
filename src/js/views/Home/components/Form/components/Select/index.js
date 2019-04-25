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
  className: PropTypes.string,
}

function Select (props) {
  const { className, ...restProps } = props

  return <select type='text' className={cx('home-form-select', className)} {...restProps} />
}

Select.propTypes = propTypes

export default Select
