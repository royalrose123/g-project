import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

function Avatar (props) {
  const { src, className, style, ...restProps } = props

  return <div className={cx('home-table-person-avatar', className)} style={{ ...style, backgroundImage: `url(${src})` }} {...restProps} />
}

Avatar.propTypes = propTypes

export default Avatar
