import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
}

function Body (props) {
  const { className, ...restProps } = props

  return <main className={cx(className, 'modal-body')} {...restProps} />
}

Body.propTypes = propTypes

export default Body
