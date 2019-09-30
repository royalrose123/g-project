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
  disabled: PropTypes.bool,
}

function Icon (props) {
  const { checked, className, disabled, ...restProps } = props

  return <span className={cx('home-form-checkbox-icon', className)} data-is-checked={checked} data-is-disabled={disabled} {...restProps} />
}

Icon.propTypes = propTypes

export default Icon
