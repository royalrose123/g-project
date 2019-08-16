import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Column from './components/Column'
import Display from './components/Display'
import Group from './components/Group'
import GroupName from './components/GroupName'
import Input from './components/Input'
import InputText from './components/InputText'
import Label from './components/Label'
import Radio from './components/Radio'
import Checkbox from './components/Checkbox'
import Row from './components/Row'
import Select from './components/Select'

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

Form.Column = Column
Form.Display = Display
Form.Group = Group
Form.GroupName = GroupName
Form.Input = Input
Form.InputText = InputText
Form.Label = Label
Form.Radio = Radio
Form.Checkbox = Checkbox
Form.Row = Row
Form.Select = Select

export default Form
