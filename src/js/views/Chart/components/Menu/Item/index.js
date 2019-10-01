import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

function Item (props) {
  const { className, children, ...restProps } = props

  return (
    <li className={cx('chart-menu-item', className)} {...restProps}>
      {children}
    </li>
  )
}

Item.propTypes = propTypes

export default Item
