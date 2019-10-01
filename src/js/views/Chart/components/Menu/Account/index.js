import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Svg from '../../../../../components/Svg'

// Lib MISC
import { requestFullscreen, exitFullScreen } from '../../../../../lib/utils/full-screen-operations'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const icon = {
  data:
    'M7.19240526,30.5474612 C10.0929368,33.048054 13.8699015,34.56 18,34.56 C22.2036446,34.56 26.0414665,32.9937271 28.9617102,30.412937 C26.817295,23.668062 23.1970099,20.4076755 18.0415598,20.4518147 C12.8453313,20.4954057 9.25006222,23.8008409 7.19240526,30.5474612 Z M6.03195296,29.4455363 C7.81124684,24.0772941 10.6620017,20.7469362 14.5566964,19.5324123 C12.2047732,18.2935261 10.60128,15.825061 10.60128,12.98208 C10.60128,8.89587978 13.9137998,5.58336 18,5.58336 C22.0862002,5.58336 25.39872,8.89587978 25.39872,12.98208 C25.39872,15.7912477 23.8331427,18.2347552 21.5269032,19.4876874 C25.3973304,20.6529272 28.2669755,23.9489092 30.1088032,29.2965719 C32.8701609,26.3379447 34.56,22.3663139 34.56,18 C34.56,8.85416454 27.1458355,1.44 18,1.44 C8.85416454,1.44 1.44,8.85416454 1.44,18 C1.44,22.4400214 3.18737287,26.4719221 6.03195296,29.4455363 Z M18,36 C8.0588745,36 0,27.9411255 0,18 C0,8.0588745 8.0588745,0 18,0 C27.9411255,0 36,8.0588745 36,18 C36,27.9411255 27.9411255,36 18,36 Z M18,18.9408 C21.2909102,18.9408 23.95872,16.2729902 23.95872,12.98208 C23.95872,9.69116982 21.2909102,7.02336 18,7.02336 C14.7090898,7.02336 12.04128,9.69116982 12.04128,12.98208 C12.04128,16.2729902 14.7090898,18.9408 18,18.9408 Z',
  size: 36,
}

export const propTypes = {
  className: PropTypes.string,
}

function Account (props) {
  const { className } = props

  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <span className={cx('chart-menu-account', className)}>
      <Svg
        className={cx('chart-menu-account__icon')}
        {...icon}
        onClick={
          isFullScreen
            ? event => {
              setIsFullScreen(false)
              exitFullScreen()
            }
            : event => {
              setIsFullScreen(true)
              requestFullscreen(document.documentElement)
            }
        }
      />
      {/* Dynamiq API 目前不提供 supervisor 跟  dealer，等未來有提供再加上 */}

      {/* <span className={cx('chart-menu-account__main')}>
        David Melrose <span className={cx('chart-menu-account__sub')}>(Supervisor)</span>
      </span>
      <span
        className={cx('chart-menu-account__main')}
        onClick={
          isFullScreen
            ? event => {
              setIsFullScreen(false)
              exitFullScreen()
            }
            : event => {
              setIsFullScreen(true)
              requestFullscreen(document.documentElement)
            }
        }
      >
        Ben Ryan <span className={cx('chart-menu-account__sub')}>(Dealer)</span>
      </span> */}
    </span>
  )
}

Account.propTypes = propTypes

export default Account
