import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

function Header (props) {
  const { className, children, ...restProps } = props

  return (
    <header className={cx('chart-layout-header', className)} {...restProps}>
      {children}
    </header>
  )
}

Header.propTypes = propTypes

export default Header
