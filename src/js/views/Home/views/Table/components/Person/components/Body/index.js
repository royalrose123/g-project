import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Body (props) {
  return <div className={cx('home-table-person-body')} {...props} />
}

Body.propTypes = propTypes

export default Body
