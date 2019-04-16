import React, { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Clock (props) {
  const [dateTime, setDateTime] = useState(new Date())
  const intervalId = useRef(null)

  useEffect(() => {
    const millisecond = 1000

    intervalId.current = setInterval(() => {
      setDateTime(new Date())
    }, millisecond)

    return () => clearInterval(intervalId.current)
  }, [])

  return <div className={cx('home-clock')}>{format(dateTime, 'hh : mm : ss / yyyy.MMM dd').toUpperCase()}</div>
}

Clock.propTypes = propTypes

export default Clock
