import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Anonymous, { propTypes as AnonymousPropTypes } from './components/Anonymous'
import Member, { propTypes as MemberPropTypes } from './components/Member'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../constants/PersonType'
const cx = classnames.bind(styles)
const getComponentByType = type => (type === PERSON_TYPE.ANONYMOUS ? Anonymous : type === PERSON_TYPE.MEMBER && Member)

export const propTypes = {
  ...AnonymousPropTypes,
  ...MemberPropTypes,
  type: PropTypes.oneOf([PERSON_TYPE.ANONYMOUS, PERSON_TYPE.MEMBER]).isRequired,
  isSelected: PropTypes.bool,
  person: PropTypes.oneOfType([AnonymousPropTypes.person, MemberPropTypes.person]).isRequired,
  onClick: PropTypes.func,
}

function Person (props) {
  const { type, isSelected, onClick, ...restProps } = props

  const Component = getComponentByType(type)

  return (
    <div className={cx('home-table-person')} data-is-selected={isSelected} onClick={onClick}>
      <Component {...restProps} />
    </div>
  )
}

Person.propTypes = propTypes

export default Person
