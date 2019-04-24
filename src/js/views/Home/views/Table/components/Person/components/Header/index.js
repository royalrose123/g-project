import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../../../constants/PersonType'
const cx = classnames.bind(styles)

export const propTypes = {
  type: PropTypes.oneOf([PERSON_TYPE.ANONYMOUS, PERSON_TYPE.MEMBER]),
}

function Header (props) {
  const { type, ...restProps } = props

  return <div className={cx('home-table-person-header')} data-type={type} {...restProps} />
}

Header.propTypes = propTypes

export default Header
