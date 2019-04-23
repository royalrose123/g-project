import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Video from './components/Video'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Camera (props) {
  const cameraIp1 = '255.123.131.1'
  const cameraIp2 = '255.123.131.2'

  return (
    <div className={cx('home-camera')}>
      <div className={cx('home-camera__column')}>
        <h2 className={cx('home-camera__title')}>Camera 1 : {cameraIp1}</h2>
        <div className={cx('home-camera__video-wrapper')}>
          <Video className={cx('home-camera__video')} src='https://www.cloud-interactive.com/assets/copy/videos/video.mp4' />
        </div>
      </div>
      <div className={cx('home-camera__column')}>
        <h2 className={cx('home-camera__title')}>Camera 2 : {cameraIp2}</h2>
        <div className={cx('home-camera__video-wrapper')}>
          <Video className={cx('home-camera__video')} src='https://www.cloud-interactive.com/assets/copy/videos/video.mp4' />
        </div>
      </div>
    </div>
  )
}

Camera.propTypes = propTypes

export default Camera
