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

function Footer (props) {
  const { className, ...restProps } = props

  return <footer className={cx(className, 'modal-footer')} {...restProps} />
}

Footer.propTypes = propTypes

export default Footer
