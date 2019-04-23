import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

function Video (props) {
  const { src, className, ...restProps } = props

  return (
    <video className={cx('home-camera-video', className)} autoPlay='autoplay' preload='auto' muted='muted' {...restProps}>
      <source src={src} />
    </video>
  )
}

Video.propTypes = propTypes

export default Video
