import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
}

function GroupName (props) {
  const { className, ...restProps } = props

  return <h3 className={cx('chart-form-group-name', className)} {...restProps} />
}

GroupName.propTypes = propTypes

export default GroupName
