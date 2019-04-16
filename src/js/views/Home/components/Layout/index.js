import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Content from './Content'
import Header from './Header'

// Style
import styles from './style.module.scss'

const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

function Layout (props) {
  const { className, children, ...restProps } = props

  return (
    <section className={cx('home-layout', className)} {...restProps}>
      {children}
    </section>
  )
}

Layout.propTypes = propTypes

Layout.Content = Content
Layout.Header = Header

export default Layout
