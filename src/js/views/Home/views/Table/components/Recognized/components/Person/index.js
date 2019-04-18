import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../../../../../components/Button'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isClockable: PropTypes.bool.isRequired,
  person: PropTypes.shape({
    isMember: PropTypes.bool.isRequired,
    serialNumber: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onClockIn: PropTypes.func,
}

function Person (props) {
  const { isClockable, person, onClockIn } = props
  const { isMember, serialNumber, avatar } = person

  return (
    <div className={cx('home-table-recognized-person')}>
      <div className={cx('home-table-recognized-person__title')} data-is-member={isMember}>
        #{serialNumber}
      </div>
      <img className={cx('home-table-recognized-person__image')} src={avatar} alt='serialNumber' />
      <Button
        isBlock
        className={cx('home-table-recognized-person__action')}
        type='button'
        onClick={event => onClockIn(event, person)}
        disabled={!isClockable}
      >
        Clock-In
      </Button>
    </div>
  )
}

Person.propTypes = propTypes

export default Person
