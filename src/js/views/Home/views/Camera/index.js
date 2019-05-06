import React from 'react'
import classnames from 'classnames/bind'

// Components

// Lib MISC
import DeviceApi from '../../../../lib/api/Device'
import useFetcher from '../../../../lib/effects/useFetcher'
// import Player from '../../../../lib/utils/player/player'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Camera (props) {
  const { isLoaded, response: cameraList } = useFetcher(null, DeviceApi.fetchCameraList)

  // TODO: 先用 iframe，待播放器問題解決後再用正規方式處理
  // useEffect(() => {
  // if (!isLoaded) return

  // const options = cameraList.map(({ id, websocketUrl, rtspUrl }, index) => ({
  //   video: document.getElementById(`video${id}`),
  //   canvas: document.getElementById(`canvas${id}`),
  //   wsUrl: websocketUrl, // ws://192.168.100.18/camera_relay?tcpaddr=admin%3Aadmin%40192.168.100.182%3A8554%2Flive
  //   rtspUrl, // rtsp://admin:admin@192.168.100.48:8554/live
  //   user: 'admin',
  //   pwd: 'youwillsee!',
  // }))

  // const players = options.map(option => new Player(option))

  // players.forEach(player => {
  //   player.init()
  //   player.on('error', () => console.log('error'))
  //   player.on('noStream', () => console.log('noStream'))
  //   player.on('canplay', () => console.log('canplay'))
  //   player.connect()
  // })
  // }, [])

  return (
    <div className={cx('home-camera')}>
      {isLoaded &&
        cameraList.map(({ id }, index) => (
          <div key={index} className={cx('home-camera__column')}>
            <h2 className={cx('home-camera__title')}>
              Camera {index + 1} : {id}
            </h2>
            <div className={cx('home-camera__video-wrapper')}>
              <iframe className={cx('home-camera__video')} src={`/camera${index + 1}/index.html`} frameBorder='0' />
            </div>
          </div>
        ))}
    </div>
  )
}

Camera.propTypes = propTypes

export default Camera
