import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames/bind'
import { NumericKeyboard } from 'numeric-keyboard/dist/numeric_keyboard.react.js'
import * as keys from 'numeric-keyboard/lib/keys'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

function Keyboard (props) {
  useEffect(() => {
    document.querySelector('#root').style.setProperty('height', 'calc(100vh - 277px)')

    return () => document.querySelector('#root').style.removeProperty('height')
  }, [])

  return ReactDOM.createPortal(
    <div className={cx('home-keyboard')}>
      <NumericKeyboard layout='tel' {...props} />
    </div>,
    document.body
  )
}

export { keys }
export default Keyboard
