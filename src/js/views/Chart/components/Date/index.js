import React from 'react'
import PropTypes from 'prop-types'
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

export const propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

function Date (props) {
  const { className, onChange } = props
  const dateFormat = 'YYYY/MM/DD'

  return (
    <div className={cx('date', className)}>
      <DatePicker defaultValue={moment()} format={dateFormat} onChange={onChange} />
    </div>
  )
}
Date.propTypes = propTypes

export default Date
