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

function InputText (props) {
  const { className, ...restProps } = props

  return <span type='text' className={cx('chart-form-input-text', className)} {...restProps} />
}

InputText.propTypes = propTypes

export default InputText
