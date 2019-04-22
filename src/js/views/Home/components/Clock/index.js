import React, { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import classnames from 'classnames/bind'

// Components
import Svg from '../../../../components/Svg'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

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

  return (
    <div className={cx('home-clock')}>
      <Svg
        size={38}
        data='M19 0c10.488.013 18.987 8.512 19 19 0 10.493-8.507 19-19 19S0 29.493 0 19 8.507 0 19 0zm.815 36.329c8.94-.423 16.095-7.573 16.522-16.514h-3.35a.815.815 0 0 1 0-1.63h3.342C35.902 9.247 28.753 2.098 19.815 1.67v3.342a.815.815 0 0 1-1.63 0V1.67C9.247 2.098 2.098 9.247 1.67 18.185h3.342a.815.815 0 0 1 0 1.63H1.67c.427 8.938 7.576 16.087 16.514 16.514v-3.342a.815.815 0 0 1 1.63 0v3.342zM27.6 26.58a.816.816 0 1 1-1.165 1.142L18.42 19.57a.815.815 0 0 1-.236-.571v-8.559a.815.815 0 0 1 1.63 0v8.225L27.6 26.58z'
      />
      <span className={cx('home-clock__text')}>{format(dateTime, 'hh : mm / yyyy.MMM dd').toUpperCase()}</span>
    </div>
  )
}

export default Clock
