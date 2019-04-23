import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import BigNumber from 'bignumber.js'

// Components
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'

// Lib MISC
import THROTTLE from '../../../../../../constants/Throttle'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isClockable: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  isActionDisabled: PropTypes.bool,
  showSerialNumber: PropTypes.bool,
  showSimilarity: PropTypes.bool,
  person: PropTypes.shape({
    detectedPhoto: PropTypes.string.isRequired,
    probable: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        similarity: PropTypes.number,
        serialNumber: PropTypes.number.isRequired,
        rank: PropTypes.string,
        avatar: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onActionClick: PropTypes.func,
}

function Person (props) {
  const { isClockable, isSelectable, isSelected, isActionDisabled, showSerialNumber, showSimilarity, person, onActionClick } = props
  const { detectedPhoto, probable } = person

  const member = probable
    .filter(p => new BigNumber(p.similarity).isGreaterThanOrEqualTo(THROTTLE.IDENTIFIED))
    .sort((a, b) => new BigNumber(b.similarity).minus(a.similarity))[0]

  const isMember = typeof member !== 'undefined'

  return (
    <div className={cx('home-table-person')} data-is-selectable={isSelectable} data-is-selected={isSelected}>
      <div className={cx('home-table-person__header')} data-is-member={isMember}>
        {isMember ? (
          <>
            <Icon className={cx('home-table-person__header-icon')} data-rank={member.rank} name='crown' mode='01' />
            {showSerialNumber ? `#${member.serialNumber}` : member.rank}
          </>
        ) : (
          'Anonymous'
        )}
      </div>
      <div className={cx('home-table-person__body')}>
        <img src={isMember ? member.avatar : detectedPhoto} alt={name} />
        {isMember && <div className={cx('home-table-person__name')}>{name}</div>}
      </div>
      <div className={cx('home-table-person__footer')}>
        {isClockable && (
          <Button
            isBlock
            className={cx('home-table-person__action')}
            type='button'
            onClick={event => onActionClick(event, person)}
            disabled={!isActionDisabled}
          >
            Clock-In
          </Button>
        )}
        {isMember && showSimilarity && <div className={cx('home-table-person__similarity')}>{member.similarity}</div>}
      </div>
    </div>
  )
}

Person.propTypes = propTypes

export default Person
