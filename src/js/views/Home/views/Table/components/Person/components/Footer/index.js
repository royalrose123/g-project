import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Footer (props) {
  return <div className={cx('home-table-person-footer')} {...props} />
}

Footer.propTypes = propTypes

export default Footer
