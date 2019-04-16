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

function Camera (props) {
  return <div className={cx('home-camera')}>Camera view</div>
}

Camera.propTypes = propTypes

export default Camera
