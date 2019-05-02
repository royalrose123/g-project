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
import GameApi from '../../../../lib/api/Game'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../constants/PersonType'
const cx = classnames.bind(styles)

const seated = { count: 7, seatSize: '102px' }
const standing = { row: 3, column: 6, placeSize: '102px', placeMargin: '25px' }
const person = { width: '280px', height: '360px' }

const defaultSeatList = new Array(seated.count).fill()
const defaultStandingList = new Array(standing.row * standing.column).fill()

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
  const [standingList, setStandingList] = useState(defaultStandingList)
  const [isSelectedPlaceStanding, setIsSelectedPlaceStanding] = useState(null)
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
  const [isClockInModalOpened, setIsClockInModalOpened] = useState(false)
  const [currentDetectionItem, setCurrentDetectionItem] = useState(null)

  // private methods
  const initializeIsSelectedPlaceStanding = () => setIsSelectedPlaceStanding(null)
  const initializeSelectedPlaceIndex = () => setSelectedPlaceIndex(null)
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
    document.documentElement.style.setProperty('--person-height', person.height)
  }, [])

  // Seat, Standing
  const onPlaceClick = (event, { index, place, isStanding }) => {
    // 如果位置已經有人，打開 detail
    if (typeof place === 'object') {
      history.push(`${match.url}/${place.id}`)
      return
    }

    // 如果位置還沒有人，設定選取座位索引
    if (isSelectedPlaceStanding === isStanding && selectedPlaceIndex === index) {
      initializeIsSelectedPlaceStanding()
      initializeSelectedPlaceIndex()
    } else {
      setIsSelectedPlaceStanding(isStanding)
      setSelectedPlaceIndex(index)
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
  const onClockIn = async (event, person) => {
    const { id, image, identify } = person

    if (identify === PERSON_TYPE.ANONYMOUS) {
      // 若是 anonymous
      // 即自動建立臨時帳號
      await GameApi.anonymousClockIn({ snapshot: image })
    } else if (identify === PERSON_TYPE.MEMBER_CARD) {
      // 若是 anonymous with member card
      // 即為會員，使用荷官輸入的 card number
      await GameApi.memberClockInByCardNumber({ cardNumber: id })
    } else {
      // 若不是 anonymous 或者 anonymous with member card
      // 即為荷官辨識出該會員，使用資料庫中原有的 id
      await GameApi.memberClockInById({ id })
    }

    // 根據是否站立，設定位置列表的內容
    if (isSelectedPlaceStanding) {
      setStandingList(standingList.map((standingItem, index) => (index === selectedPlaceIndex ? { id, image } : standingItem)))
    } else {
      setSeatList(seatList.map((seatItem, index) => (index === selectedPlaceIndex ? { id, image } : seatItem)))
    }

    closeClockInModal()
    initializeIsSelectedPlaceStanding()
    initializeSelectedPlaceIndex()
  }

  return isDetailVisible ? (
    <MemberDetail {...props} />
  ) : (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated seatList={seatList} selectedIndex={isSelectedPlaceStanding ? null : selectedPlaceIndex} onPlaceSelect={onPlaceClick} />
          <h2 className={cx('home-table__title')}>Seated</h2>
        </div>
        <div className={cx('home-table__column')}>
          <Standing standingList={standingList} selectedIndex={isSelectedPlaceStanding ? selectedPlaceIndex : null} onPlaceSelect={onPlaceClick} />
          <h2 className={cx('home-table__title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>
        <Detection isPlaceSelected={selectedPlaceIndex !== null} onItemActionClick={onDetectionItemActionClick} />
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
