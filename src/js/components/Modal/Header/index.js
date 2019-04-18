import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
}

function Header (props) {
  const { className, ...restProps } = props

  return <header className={cx(className, 'modal-header')} {...restProps} />
}

Header.propTypes = propTypes

export default Header
