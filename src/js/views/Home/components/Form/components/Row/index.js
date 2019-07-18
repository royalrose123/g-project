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
  align: PropTypes.string,
}

function Row (props) {
  const { className, align, ...restProps } = props

  return <div className={cx('home-form-row', className)} data-align={align} {...restProps} />
}

Row.propTypes = propTypes

export default Row
