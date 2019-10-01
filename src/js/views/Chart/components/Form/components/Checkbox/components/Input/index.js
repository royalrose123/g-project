import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
}

function Input (props) {
  const { checked, className, ...restProps } = props
  return <input className={cx('chart-form-checkbox-input', className)} type='checkbox' checked={checked} {...restProps} />
}

Input.propTypes = propTypes

export default Input
