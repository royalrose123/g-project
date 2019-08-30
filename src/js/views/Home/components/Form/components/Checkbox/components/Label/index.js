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

function Label (props) {
  const { className, ...restProps } = props
  return <span className={cx('home-form-checkbox-label', className)} {...restProps} />
}

Label.propTypes = propTypes

export default Label
