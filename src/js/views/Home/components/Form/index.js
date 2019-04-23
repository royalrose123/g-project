import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Control from './components/Control'
import Display from './components/Display'
import Group from './components/Group'
import Label from './components/Label'
import Radio from './components/Radio'
import Row from './components/Row'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
}

function Form (props) {
  const { className, ...restProps } = props

  return <form className={cx('home-form', className)} {...restProps} />
}

Form.propTypes = propTypes

Form.Display = Display
Form.Control = Control
Form.Group = Group
Form.Label = Label
Form.Radio = Radio
Form.Row = Row

export default Form
