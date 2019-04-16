import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Item from './Item'
import Link from './Link'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  children: PropTypes.any.isRequired,
}

function Menu (props) {
  const { children } = props

  return <ul className={cx('home-menu')}>{children}</ul>
}

Menu.propTypes = propTypes

Menu.Item = Item
Menu.Link = Link

export default Menu
