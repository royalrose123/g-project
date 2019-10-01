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
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
}

function Group (props) {
  const { width, className, style, ...restProps } = props

  return <div className={cx('chart-form-group', className)} style={{ ...style, width }} {...restProps} />
}

Group.propTypes = propTypes

export default Group
