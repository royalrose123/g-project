import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { ErrorMessage } from 'formik'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isFocused: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
}

function Input (props) {
  const { isFocused, className, name, ...restProps } = props

  return (
    <>
      <input type='text' className={cx('chart-form-input', className)} data-is-focused={isFocused} name={name} {...restProps} />
      <ErrorMessage name={name} component='span' className={cx('chart-form-input--error')} />
    </>
  )
}

Input.propTypes = propTypes

export default Input
