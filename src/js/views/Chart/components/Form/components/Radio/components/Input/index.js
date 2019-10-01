import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

function Input (props) {
  const { checked, disabled, className, ...restProps } = props

  return <input className={cx('chart-form-radio-input', className)} type='radio' checked={checked} disabled={disabled} {...restProps} />
}

Input.propTypes = propTypes

export default Input
