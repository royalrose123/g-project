import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Settings (props) {
  return <div className={cx('home-settings')}>Settings view</div>
}

Settings.propTypes = propTypes

export default Settings
