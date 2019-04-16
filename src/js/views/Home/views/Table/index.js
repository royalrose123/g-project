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

function Table (props) {
  return <div className={cx('home-table')}>Table view</div>
}

Table.propTypes = propTypes

export default Table
