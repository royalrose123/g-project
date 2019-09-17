import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Svg from '../../../../../../components/Svg'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  standingList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    })
  ).isRequired,
  selectedIndex: PropTypes.number,
  onPlaceSelect: PropTypes.func,
}

export const defaultProps = {
  onPlaceSelect: () => null,
}

function Standing (props) {
  const { standingList, selectedIndex, onPlaceSelect } = props
  return (
    <div className={cx('home-table-standing')}>
      {standingList.map((standingItem, index) => {
        return (
          <button
            key={index}
            type='button'
            className={cx('home-table-standing__place')}
            onClick={event => onPlaceSelect(event, { index, place: standingItem, isStanding: true })}
            data-is-selected={index === selectedIndex}
            data-has-image={typeof seatedItem === 'object'}
            data-is-auto-clock={typeof standingItem === 'object' && standingItem.isAuto}
          >
            {typeof standingItem === 'object' ? (
              <>
                <p className={cx('home-table-standing__seat-number')}>{standingItem.seatNumber}</p>
                <img className={cx('home-table-standing__place-image')} src={standingItem.image} />
              </>
            ) : (
              <Svg
                className={cx('home-table-standing__place-empty')}
                size={52}
                data='M39,13 C39,20.367 33.367,26 26,26 C18.633,26 13,20.367 13,13 C13,5.633 18.633,0 26,0 C33.367,0 39,5.633 39,13 Z M0,47.667 C0,39 17.333,34.233 26,34.233 C34.667,34.233 52,39 52,47.667 L52,52 L0,52 L0,47.667 Z'
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

Standing.propTypes = propTypes
Standing.defaultProps = defaultProps

export default Standing
