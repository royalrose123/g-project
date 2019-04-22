import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import BigNumber from 'bignumber.js'

// Components
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isClockable: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  showSerialNumber: PropTypes.bool,
  person: PropTypes.shape({
    name: PropTypes.string,
    similarity: PropTypes.number,
    serialNumber: PropTypes.number.isRequired,
    rank: PropTypes.string,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  onClockIn: PropTypes.func,
}

function Person (props) {
  const { isClockable, isSelectable, isSelected, showSerialNumber, person, onClockIn } = props
  const { name, similarity, serialNumber, rank, avatar } = person

  const identifyThrottle = 80
  const isMember = new BigNumber(similarity).isGreaterThanOrEqualTo(identifyThrottle)

  return (
    <div className={cx('home-table-person')} data-is-selectable={isSelectable} data-is-selected={isSelected}>
      <div className={cx('home-table-person__header')} data-is-member={isMember}>
        {isMember ? (
          <>
            <Icon className={cx('home-table-person__header-icon')} data-rank={rank} name='crown' mode='01' />
            {showSerialNumber ? `#${serialNumber}` : rank}
          </>
        ) : (
          'Anonymous'
        )}
      </div>
      <div className={cx('home-table-person__body')}>
        <img src={avatar} alt={name} />
        {isMember && <div className={cx('home-table-person__name')}>{name}</div>}
      </div>
      <div className={cx('home-table-person__footer')}>
        <Button isBlock className={cx('home-table-person__action')} type='button' onClick={event => onClockIn(event, person)} disabled={!isClockable}>
          Clock-In
        </Button>
      </div>
    </div>
  )
}

Person.propTypes = propTypes

export default Person
