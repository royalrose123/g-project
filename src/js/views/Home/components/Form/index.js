import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Control from './components/Control'
import Display from './components/Display'
import Group from './components/Group'
import Label from './components/Label'
import Row from './components/Row'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
}

function Form (props) {
  const { width, className, style, ...restProps } = props

  return <form className={cx('home-form', className)} style={{ ...style, width }} {...restProps} />
}

Form.propTypes = propTypes

Form.Display = Display
Form.Control = Control
Form.Group = Group
Form.Label = Label
Form.Row = Row

export default Form
