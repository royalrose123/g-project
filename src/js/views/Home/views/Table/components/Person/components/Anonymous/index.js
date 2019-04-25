import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Avatar from '../Avatar'
import Body from '../Body'
import Footer from '../Footer'
import Header from '../Header'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../../../constants/PersonType'
const cx = classnames.bind(styles)

export const propTypes = {
  person: PropTypes.shape({
    image: PropTypes.string,
  }).isRequired,
  renderFooter: PropTypes.func,
}

function Anonymous (props) {
  const { person, renderFooter } = props
  const { image } = person

  return (
    <div className={cx('home-table-person-anonymous')}>
      <Header type={PERSON_TYPE.ANONYMOUS}>Anonymous</Header>
      <Body>
        <Avatar src={image} alt={name} />
      </Body>
      {typeof renderFooter === 'function' && <Footer>{renderFooter(person)}</Footer>}
    </div>
  )
}

Anonymous.propTypes = propTypes

export default Anonymous
