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

function Icon (props) {
  const { checked, className, ...restProps } = props

  return <span className={cx('home-form-checkbox-icon', className)} data-is-checked={checked} {...restProps} />
}

Icon.propTypes = propTypes

export default Icon
