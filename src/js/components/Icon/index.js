import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Svg from '../Svg'

// Style
import styles from './style.module.scss'

// Variables / Functions
import paths from './paths'
const cx = classnames.bind(styles)

export const propTypes = {
  name: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  flipped: PropTypes.oneOf(['vertically', 'horizontally']),
  rotated: PropTypes.oneOf(['clockwise', 'counterclockwise']),
  className: PropTypes.string,
}

export const defaultProps = {
  mode: '01',
}

function Icon (props) {
  const { name, mode, flipped, rotated, className, ...restProps } = props
  const pathProps = paths[name][mode]

  return <Svg className={cx(className, 'icon')} data-flipped={flipped} data-rotated={rotated} {...pathProps} {...restProps} />
}

Icon.propTypes = propTypes
Icon.defaultProps = defaultProps

export default Icon
