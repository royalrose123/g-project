import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
}

function Group (props) {
  const { className, ...restProps } = props

  return <div className={cx('chart-form-radio-group', className)} {...restProps} />
}

Group.propTypes = propTypes

export default Group
