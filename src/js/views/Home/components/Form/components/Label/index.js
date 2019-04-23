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

function Label (props) {
  const { className, ...restProps } = props

  return <label className={cx('home-form-label', className)} {...restProps} />
}

Label.propTypes = propTypes

export default Label
