import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}

function Column (props) {
  const { size, className, ...restProps } = props

  return <div className={cx('home-form-column', className)} data-size={size} {...restProps} />
}

Column.propTypes = propTypes

export default Column
