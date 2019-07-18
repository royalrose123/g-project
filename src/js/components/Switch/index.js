import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'react-decoration'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

class Switch extends Component {
  static propTypes = propTypes

  constructor (props) {
    super(props)

    const { isChecked } = props

    this.state = {
      isChecked: isChecked || false,
    }
  }

  @autobind
  onClick (event) {
    const { isDisabled, onChange } = this.props
    const { isChecked } = this.state

    if (isDisabled) return

    this.setState({ isChecked: !isChecked })

    if (onChange) {
      onChange(event, !isChecked)
    }
  }

  render () {
    const { prefix, suffix, isChecked: propIsChecked, isDisabled, className } = this.props
    const { isChecked: stateIsChecked } = this.state

    const isChecked = typeof propIsChecked === 'boolean' ? propIsChecked : stateIsChecked

    return (
      <button
        type='button'
        role='switch'
        className={cx(className, 'switch')}
        data-is-checked={isChecked}
        onClick={this.onClick}
        disabled={isDisabled}
      >
        {(prefix || suffix) && <span className={cx('switch__inner')}>{isChecked ? prefix : suffix}</span>}
      </button>
    )
  }
}

export const switchGroupPropTypes = {
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  groupClassName: PropTypes.string,
}

export const switchGroupDefaultProps = {
  labelProps: {},
}

class SwitchGroup extends Component {
  static propTypes = switchGroupPropTypes
  static defaultProps = switchGroupDefaultProps

  @autobind
  renderLabel () {
    const { label, labelProps } = this.props
    const { className, ...restProps } = labelProps

    return (
      <span className={cx(className, 'switch-group__label')} {...restProps}>
        {label}
      </span>
    )
  }

  @autobind
  renderSwitch () {
    const { label, labelProps, groupClassName, ...restProps } = this.props

    return <Switch {...restProps} />
  }

  render () {
    const { groupClassName } = this.props

    return (
      <div className={cx(groupClassName, 'switch-group')}>
        {this.renderLabel()}
        {this.renderSwitch()}
      </div>
    )
  }
}

Switch.Group = SwitchGroup

export { Switch, SwitchGroup }
export default Switch
