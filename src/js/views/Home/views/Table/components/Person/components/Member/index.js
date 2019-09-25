import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Avatar from '../Avatar'
import Body from '../Body'
import Header from '../Header'
import Footer from '../Footer'
// import Icon from '../../../../../../../../components/Icon'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../../../constants/PersonType'
const cx = classnames.bind(styles)

export const propTypes = {
  title: PropTypes.oneOf(['id', 'level']),
  mode: PropTypes.oneOf(['compare']),
  person: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    level: PropTypes.string,
    image: PropTypes.string,
    compareImage: PropTypes.string,
  }).isRequired,
  renderFooter: PropTypes.func,
}

function Person (props) {
  const { title, mode, person, renderFooter } = props
  const { id, level, image, name, compareImage } = person

  return (
    <div className={cx('home-table-person-member')} data-mode={mode}>
      <Header type={PERSON_TYPE.MEMBER}>
        {/* <Icon className={cx('home-table-person-member__header-icon')} data-level={level} name='crown' mode='01' />  // 目前先拿掉 */}
        {title === 'id' ? `#${id}` : level}
      </Header>
      <Body>
        <Avatar src={image} alt={name} />
        {mode === 'compare' && <Avatar src={compareImage} alt={name} />}
        <div className={cx('home-table-person-member__name')}>{name}</div>
      </Body>
      {typeof renderFooter === 'function' && <Footer>{renderFooter(person)}</Footer>}
    </div>
  )
}

Person.propTypes = propTypes

export default Person
