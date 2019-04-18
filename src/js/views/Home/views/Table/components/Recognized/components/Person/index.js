import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../../../../../components/Button'
import Icon from '../../../../../../../../components/Icon'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isClockable: PropTypes.bool.isRequired,
  person: PropTypes.shape({
    name: PropTypes.bool,
    isMember: PropTypes.bool.isRequired,
    serialNumber: PropTypes.number.isRequired,
    rank: PropTypes.string,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onClockIn: PropTypes.func,
}

function Person (props) {
  const { isClockable, person, onClockIn } = props
  const { name, isMember, rank, avatar } = person

  return (
    <div className={cx('home-table-recognized-person')}>
      <div className={cx('home-table-recognized-person__title')} data-is-member={isMember}>
        {isMember ? (
          <>
            <Icon className={cx('home-table-recognized-person__title-icon')} data-rank={rank} name='crown' mode='01' />
            {rank}
          </>
        ) : (
          'Anonymous'
        )}
      </div>
      <div className={cx('home-table-recognized-person__image-wrapper')}>
        <img src={avatar} alt='serialNumber' />
        {isMember && <div className={cx('home-table-recognized-person__name')}>{name}</div>}
      </div>
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
