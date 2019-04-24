import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import ClockInModal from './components/ClockInModal'
import Detection from './components/Detection'
import Seated from './components/Seated'
import Standing from './components/Standing'

// Views
import MemberDetail from './views/MemberDetail'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

const seated = { count: 7, seatSize: '102px' }
const standing = { row: 3, column: 6, placeSize: '102px', placeMargin: '25px' }
const person = { width: '280px' }

const defaultSeatList = new Array(seated.count).fill()

export const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
}

function Table (props) {
  const { match, history } = props
  const { params } = match
  const { memberId } = params

  const isDetailVisible = typeof memberId === 'string'

  const [seatList, setSeatList] = useState(defaultSeatList)
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null)
  const [currentMember, setCurrentMember] = useState(null)
  const [isClockInModalOpened, setIsClockInModalOpened] = useState(false)
  const [currentDetectionItem, setCurrentDetectionItem] = useState(null)

  // private methods
  const initializeSelectedSeatIndex = () => setSelectedSeatIndex(null)
  const openClockInModal = () => setIsClockInModalOpened(true)
  const closeClockInModal = () => setIsClockInModalOpened(false)
  const initializeCurrentDetectionItem = () => setCurrentDetectionItem(null)

  // 設定初始值
  useEffect(() => {
    document.documentElement.style.setProperty('--seated-seat-size', seated.seatSize)

    document.documentElement.style.setProperty('--standing-row', standing.row)
    document.documentElement.style.setProperty('--standing-column', standing.column)
    document.documentElement.style.setProperty('--standing-place-size', standing.placeSize)
    document.documentElement.style.setProperty('--standing-place-margin', standing.placeMargin)

    document.documentElement.style.setProperty('--person-width', person.width)
  }, [])

  // Seat
  const onSeatClick = (event, index, seat) => {
    // 如果座位已經有人，打開 detail
    if (typeof seat === 'object') {
      setCurrentMember(seat)
      // TODO: 改成 member id
      history.push(`${match.url}/${seat.id}`)
      return
    }

    // 如果座位還沒有人，設定選取座位索引
    if (selectedSeatIndex === index) {
      initializeSelectedSeatIndex()
    } else {
      setSelectedSeatIndex(index)
    }
  }

  // Detection
  const onDetectionItemActionClick = (event, detectionItem) => {
    openClockInModal()
    setCurrentDetectionItem(detectionItem)
  }

  // ClockInModal
  const onClockInModalClose = event => closeClockInModal()
  const afterClockInModalClose = event => initializeCurrentDetectionItem()
  const onClockIn = (event, person) => {
    setSeatList(seatList.map((seatItem, index) => (index === selectedSeatIndex ? { id: '987685649864', image: person.image } : seatItem)))
    closeClockInModal()
    initializeCurrentDetectionItem()
    initializeSelectedSeatIndex()
  }

  return isDetailVisible ? (
    <MemberDetail member={currentMember} {...props} />
  ) : (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated seatList={seatList} selectedIndex={selectedSeatIndex} onSeatClick={onSeatClick} />
          <h2 className={cx('home-table__title')}>Seated</h2>
        </div>
        <div className={cx('home-table__column')}>
          <Standing row={standing.row} column={standing.column} />
          <h2 className={cx('home-table__title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>
        <Detection isSeatSelected={selectedSeatIndex !== null} onItemActionClick={onDetectionItemActionClick} />
      </div>
      <ClockInModal
        detectionItem={currentDetectionItem}
        isOpened={isClockInModalOpened}
        onClose={onClockInModalClose}
        afterClose={afterClockInModalClose}
        onClockIn={onClockIn}
      />
    </div>
  )
}

Table.propTypes = propTypes

export default Table
