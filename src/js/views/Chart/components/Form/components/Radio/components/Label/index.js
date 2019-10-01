import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
}

function Label (props) {
  const { isDisabled, className, ...restProps } = props

  return <span className={cx('chart-form-radio-label', className)} data-is-disabled={isDisabled} {...restProps} />
}

Label.propTypes = propTypes

export default Label
