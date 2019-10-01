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

function Content (props) {
  const { className, children, ...restProps } = props

  return (
    <main className={cx('chart-layout-content', className)} {...restProps}>
      {children}
    </main>
  )
}

Content.propTypes = propTypes

export default Content
