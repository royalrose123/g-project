import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { connect } from 'react-redux'

// Components

// Modules
import { selectors as tableSelectors } from '../../../../lib/redux/modules/table'

// Lib MISC
import DeviceApi from '../../../../lib/api/Device'
import useFetcher from '../../../../lib/effects/useFetcher'
import Player from '../../../../lib/utils/player/player'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  tableNumber: PropTypes.string,
}

export function Camera (props) {
  const { tableNumber } = props
  const { isLoaded, response: cameraList } = useFetcher(null, DeviceApi.fetchCameraList, { tableNumber })

  useEffect(() => {
    if (!isLoaded) return

    const options = cameraList.map(({ id, websocketUrl, rtspUrl }, index) => ({
      video: document.getElementById(`video${id}`),
      canvas: document.getElementById(`canvas${id}`),
      rtspUrl,
      wsUrl: websocketUrl,
      user: 'admin',
      pwd: 'youwillsee!',
    }))

    const players = options.map(option => new Player(option))
    players.forEach(player => {
      player.on('error', () => console.warn('連接失敗'))

      player.on('noStream', () => {
        console.log('noStream')
        player.close()
        player = null
        player = new Player(options)
        player.init()
        player.connect()
      })

      player.on('canplay', () => console.warn('canplay'))

      player.init()
      player.connect()
    })

    return () => {
      // 卸載 component 時，需關閉 webscoket 連線
      players.forEach(player => {
        player.close()
      })
    }
  }, [cameraList, isLoaded])

  return (
    <div className={cx('home-camera')}>
      {isLoaded &&
        cameraList.map(({ id, websocketUrl, rtspUrl }, index) => (
          <div key={index} className={cx('home-camera__column')}>
            <h2 className={cx('home-camera__title')}>
              Camera {index + 1} : {id}
            </h2>
            <div className={cx('home-camera__video-wrapper')}>
              <video width='100%' height='100%' autoPlay id={`video${id}`} />
              <canvas id={`canvas${id}`} />
            </div>
          </div>
        ))}
    </div>
  )
}

Camera.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)
