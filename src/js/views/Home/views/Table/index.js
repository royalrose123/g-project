import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'

// Components
import ClockInModal from './components/ClockInModal'
import Detection from './components/Detection'
import Seated from './components/Seated'
import Standing from './components/Standing'

// Views
import MemberDetail from './views/MemberDetail'

// Modules
import { operations as seatedOperations, selectors as seatedSelectors, constants as SEATED_CONSTANTS } from '../../../../lib/redux/modules/seated'
import {
  operations as standingOperations,
  selectors as standingSelectors,
  constants as STANDING_CONSTANTS,
} from '../../../../lib/redux/modules/standing'

// Lib MISC
import GameApi from '../../../../lib/api/Game'
import findStaticPath from '../../../../lib/utils/find-static-path'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../constants/PersonType'
const cx = classnames.bind(styles)
const person = { width: '280px', height: '360px' }

export const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  addSeatItem: PropTypes.func,
  removeSeatItem: PropTypes.func,
  addStandingItem: PropTypes.func,
  removeStandingItem: PropTypes.func,
}

function Table (props) {
  const { match, history, seatedList, standingList, addSeatItem, removeSeatItem, addStandingItem, removeStandingItem } = props
  const { path, params } = match
  const { memberId } = params

  const isDetailVisible = typeof memberId === 'string'

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
    document.documentElement.style.setProperty('--seated-seat-size', SEATED_CONSTANTS.SIZE)

    document.documentElement.style.setProperty('--standing-row', STANDING_CONSTANTS.ROW)
    document.documentElement.style.setProperty('--standing-column', STANDING_CONSTANTS.COLUMN)
    document.documentElement.style.setProperty('--standing-place-size', STANDING_CONSTANTS.PLACE_SIZE)
    document.documentElement.style.setProperty('--standing-place-margin', STANDING_CONSTANTS.PLACE_MARGIN)

    document.documentElement.style.setProperty('--person-width', person.width)
    document.documentElement.style.setProperty('--person-height', person.height)
  }, [])

  // Seat, Standing
  const onPlaceClick = (event, { index, place, isStanding }) => {
    setIsSelectedPlaceStanding(isStanding)
    setSelectedPlaceIndex(index)

    // 如果位置已經有人，打開 detail
    if (typeof place === 'object') {
      history.push(`${match.url}/${place.id}`)
      return
    }

    // 如果位置還沒有人，設定選取座位索引
    if (isSelectedPlaceStanding === isStanding && selectedPlaceIndex === index) {
      initializeIsSelectedPlaceStanding()
      initializeSelectedPlaceIndex()
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
    let { id } = person
    const { tempId, name, memberCard, image, identify } = person

    if (identify === PERSON_TYPE.ANONYMOUS) {
      // 若是 anonymous
      // 即自動建立臨時帳號
      // 並以取得的 id 放進 seat / standing list 中
      id = await GameApi.anonymousClockIn({ tempId, name, snapshot: image })
    } else if (identify === PERSON_TYPE.MEMBER_CARD) {
      // 若是 member card
      // 即為會員，使用荷官輸入的 member card
      // 立刻關掉 modal
      closeClockInModal()
      await GameApi.memberClockInByMemberCard({ memberCard })
    } else {
      // 若不是 anonymous 或者 member card
      // 即為荷官辨識出該會員，使用資料庫中原有的 id card
      await GameApi.memberClockInById({ id })
    }

    // 根據是否站立，設定位置列表的內容
    if (isSelectedPlaceStanding) {
      addStandingItem({ id: String(id), image }, selectedPlaceIndex)
    } else {
      addSeatItem({ id: String(id), image }, selectedPlaceIndex)
    }

    closeClockInModal()
    initializeIsSelectedPlaceStanding()
    initializeSelectedPlaceIndex()
  }

  // MemberDetail
  const onClockOut = async (values, actions) => {
    await GameApi.clockOut({ id: memberId, ...values })

    // 根據是否站立，設定位置列表的內容
    if (isSelectedPlaceStanding) {
      removeStandingItem(selectedPlaceIndex)
    } else {
      removeSeatItem(selectedPlaceIndex)
    }

    initializeIsSelectedPlaceStanding()
    initializeSelectedPlaceIndex()

    await history.push(findStaticPath(path))
  }

  return isDetailVisible ? (
    <MemberDetail onClockOut={onClockOut} {...props} />
  ) : (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated seatedList={seatedList} selectedIndex={isSelectedPlaceStanding ? null : selectedPlaceIndex} onPlaceSelect={onPlaceClick} />
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

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
  }
}

const mapDispatchToProps = {
  addSeatItem: seatedOperations.addItemToList,
  removeSeatItem: seatedOperations.removeItemFromList,
  addStandingItem: standingOperations.addItemToList,
  removeStandingItem: standingOperations.removeItemFromList,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
