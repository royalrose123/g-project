import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  size: PropTypes.number.isRequired,
  data: PropTypes.string.isRequired,
  className: PropTypes.string,
}

function Icon (props) {
  const { size, data, className, ...restProps } = props

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      focusable={false}
      className={cx(className, 'modal-icon')}
      {...restProps}
    >
      <path d={data} />
    </svg>
  )
}

Icon.propTypes = propTypes

export default Icon
