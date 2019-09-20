import React from 'react'
import classnames from 'classnames/bind'
// import 'antd/dist/antd.css'

// Components

// Lib MISC
import { DatePicker } from 'antd'
import moment from 'moment'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

function Date (props) {
  const dateFormat = 'YYYY/MM/DD'

  return (
    <div className={cx('date')}>
      <div>
        <div style={{ margin: 24 }}>
          <DatePicker defaultValue={moment()} format={dateFormat} />
        </div>
        ,
      </div>
    </div>
  )
}

export default Date
