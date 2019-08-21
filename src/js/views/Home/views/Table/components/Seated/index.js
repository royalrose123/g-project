import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components

// Lib MISC
// import DeviceApi from '../../../../../../lib/api/Device'
// import useFetcher from '../../../../../../lib/effects/useFetcher'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  seatedList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    })
  ).isRequired,
  selectedIndex: PropTypes.number,
  onPlaceSelect: PropTypes.func,
  tableNumber: PropTypes.string,
}

function Seated (props) {
  const { seatedList, selectedIndex, onPlaceSelect, tableNumber } = props
  // const { isLoaded, response: cameraList } = useFetcher(null, DeviceApi.fetchCameraList)
  // console.log(isLoaded, cameraList)
  return (
    <div className={cx('home-table-seated')}>
      {seatedList.map((seatedItem, index) => (
        <button
          key={index}
          type='button'
          className={cx('home-table-seated__seat')}
          onClick={event => onPlaceSelect(event, { index, place: seatedItem, isStanding: false })}
          data-is-selected={index === selectedIndex}
          data-has-image={typeof seatedItem === 'object'}
          data-is-auto-clock={typeof seatedItem === 'object' && seatedItem.isAuto}
        >
          {typeof seatedItem === 'object' ? (
            <img className={cx('home-table-seated__seat-image')} src={seatedItem.image} />
          ) : (
            <span className={cx('home-table-seated__seat-empty')}>{index + 1}</span>
          )}
        </button>
      ))}
      <div className={cx('home-table-seated__desk')}>
        {/* {isLoaded && cameraList[0].id.slice(0, -2)} */}
        {tableNumber}
        <p className={cx('home-table-seated__desk__number')} />
      </div>
    </div>
  )
}

Seated.propTypes = propTypes

export default Seated
