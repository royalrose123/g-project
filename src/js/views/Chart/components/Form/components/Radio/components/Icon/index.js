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

function Icon (props) {
  const { checked, disabled, className, ...restProps } = props

  return <span className={cx('chart-form-radio-icon', className)} data-is-checked={checked} data-is-disabled={disabled} {...restProps} />
}

Icon.propTypes = propTypes

export default Icon
