import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Body from '../Body'
import Header from '../Header'
import Footer from '../Footer'
import Icon from '../../../../../../../../components/Icon'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../../../constants/PersonType'
const cx = classnames.bind(styles)

export const propTypes = {
  title: PropTypes.oneOf(['id', 'level']),
  person: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    level: PropTypes.oneOf(['green', 'silver', 'gold', 'platinum']),
    image: PropTypes.string,
  }).isRequired,
  renderFooter: PropTypes.func,
}

function Person (props) {
  const { title, person, renderFooter } = props
  const { image, level } = person

  return (
    <div className={cx('home-table-person-member')}>
      <Header type={PERSON_TYPE.MEMBER}>
        <Icon className={cx('home-table-person-member__header-icon')} data-level={level} name='crown' mode='01' />
        {person[title]}
      </Header>
      <Body>
        <img src={image} alt={name} />
        <div className={cx('home-table-person-member__name')}>{name}</div>
      </Body>
      {typeof renderFooter === 'function' && <Footer>{renderFooter(person)}</Footer>}
    </div>
  )
}

Person.propTypes = propTypes

export default Person
