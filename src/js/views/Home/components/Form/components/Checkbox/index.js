import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Group from './components/Group'
import Icon from './components/Icon'
import Input from './components/Input'
import Label from './components/Label'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
  disabled: PropTypes.func,
}

function Checkbox (props) {
  const { checked, className, children, disabled, ...restProps } = props
  return (
    <label className={cx('home-form-checkbox')} role='checkbox'>
      <span className={cx('home-form-checkbox_inner')}>
        <Input checked={checked} {...restProps} disabled={disabled} />
        <Icon checked={checked} disabled={disabled} />
      </span>
      {children && <Label>{children}</Label>}
    </label>
  )
}

Checkbox.propTypes = propTypes

Checkbox.Group = Group

export default Checkbox
