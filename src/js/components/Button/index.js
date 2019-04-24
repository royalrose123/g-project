import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isRounded: PropTypes.bool.isRequired,
  isFilled: PropTypes.bool.isRequired,
  isBlock: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  setRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  contentProps: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export const defaultProps = {
  isRounded: false,
  isFilled: true,
  isBlock: false,
  size: 'md',
  contentProps: {},
}

function Button (props) {
  const { isRounded, isFilled, isBlock, size, setRef, prefix, suffix, contentProps, className, children, ...restProps } = props
  const { className: contentClassName } = contentProps

  return (
    <button
      className={cx(className, 'button')}
      data-is-rounded={isRounded}
      data-is-filled={isFilled}
      data-is-block={isBlock}
      data-size={size}
      ref={setRef}
      {...restProps}
    >
      {prefix}
      <span className={cx(contentClassName, 'button__content')} {...contentProps}>
        {children}
      </span>
      {suffix}
    </button>
  )
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
