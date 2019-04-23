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
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
}

function Radio (props) {
  const { checked, disabled, className, children, ...restProps } = props

  return (
    <label className={cx('home-form-radio')} role='radio'>
      <span className={cx('home-form-radio__inner')}>
        <Input checked={checked} disabled={disabled} {...restProps} />
        <Icon checked={checked} disabled={disabled} />
      </span>
      {children && <Label disabled={disabled}>{children}</Label>}
    </label>
  )
}

Radio.propTypes = propTypes

Radio.Group = Group

export default Radio
