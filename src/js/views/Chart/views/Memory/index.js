import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  prop: PropTypes.any,
}

export const defaultProps = {
  prop: 'prop',
}

function Memory (props) {
  const { prop } = props
  const [state] = useState('state')

  useEffect(() => {})

  return (
    <div className={cx('memory')}>
      {prop}
      {state}
    </div>
  )
}

Memory.propTypes = propTypes
Memory.defaultProps = defaultProps

export default Memory
