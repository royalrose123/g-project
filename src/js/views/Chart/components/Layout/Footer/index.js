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

function Footer (props) {
  const { className, children, ...restProps } = props

  return (
    <footer className={cx('chart-layout-footer', className)} {...restProps}>
      {children}
    </footer>
  )
}

Footer.propTypes = propTypes

export default Footer
