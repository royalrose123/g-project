import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.string.isRequired,
  className: PropTypes.string,
}

function Svg (props) {
  const { size, width, height, data, className, ...restProps } = props

  const svgWidth = typeof width === 'number' ? width : size
  const svgHeight = typeof height === 'number' ? height : size

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      aria-hidden
      focusable={false}
      className={cx(className, 'svg')}
      {...restProps}
    >
      <path d={data} />
    </svg>
  )
}

Svg.propTypes = propTypes

export default Svg
