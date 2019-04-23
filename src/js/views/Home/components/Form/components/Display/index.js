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

function Display (props) {
  const { className, ...restProps } = props

  return <div className={cx('home-form-display', className)} {...restProps} />
}

Display.propTypes = propTypes

export default Display
