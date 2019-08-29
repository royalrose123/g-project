import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import { findIndex, trim, findKey } from 'lodash'

// Components
import ClockInModal from './components/ClockInModal'
import Detection from './components/Detection'
import Seated from './components/Seated'
import Standing from './components/Standing'

// Views
import MemberDetail from './views/MemberDetail'

// Modules
import { operations as tableOperations, selectors as tableSelectors } from '../../../../lib/redux/modules/table'
import { operations as seatedOperations, selectors as seatedSelectors, constants as SEATED_CONSTANTS } from '../../../../lib/redux/modules/seated'
import {
  operations as standingOperations,
  selectors as standingSelectors,
  constants as STANDING_CONSTANTS,
} from '../../../../lib/redux/modules/standing'

// Lib MISC
import GameApi from '../../../../lib/api/Game'
import findStaticPath from '../../../../lib/utils/find-static-path'
import getPersonByType from '../../../../lib/helpers/get-person-by-type'
import CLOCK_STATUS from '../../../../constants/ClockStatus'
import SEATED_COORDINATE from '../../../../constants/SeatedCoordinate'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../constants/PersonType'
const cx = classnames.bind(styles)
const person = { width: '130px', height: '170px' }

export const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  tableNumber: PropTypes.string,
  clockState: PropTypes.string,
  addSeatItem: PropTypes.func,
  removeSeatItem: PropTypes.func,
  initStandingList: PropTypes.func,
  addStandingItem: PropTypes.func,
  removeStandingItem: PropTypes.func,
  clockOutPlayer: PropTypes.array,
  removeClockOutPlayer: PropTypes.func,
}

function Table (props) {
  const {
    match,
    history,
    seatedList,
    standingList,
    addSeatItem,
    removeSeatItem,
    addStandingItem,
    removeStandingItem,
    tableNumber,
    clockState,
    clockOutPlayer,
    removeClockOutPlayer,
  } = props

  const { path, params } = match
  let { memberId, type } = params

  const isDetailVisible = typeof memberId === 'string'
  const [isSelectedPlaceStanding, setIsSelectedPlaceStanding] = useState(null)
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
  const [isClockInModalOpened, setIsClockInModalOpened] = useState(false)
  const [currentDetectionItem, setCurrentDetectionItem] = useState(null)
  const [isAutoClocking, setIsAutoClocking] = useState(false)
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
  })

  // Seat, Standing
  const onPlaceClick = (event, { index, place, isStanding }) => {
    setIsSelectedPlaceStanding(isStanding)
    setSelectedPlaceIndex(index)
    // 如果位置已經有人，打開 detail
    if (typeof place === 'object') {
      history.push(`${match.url}/${place.type}/${place.id}`)
      return
    }

    // 如果位置還沒有人，設定選取座位索引
    if (isSelectedPlaceStanding === isStanding && selectedPlaceIndex === index) {
      initializeIsSelectedPlaceStanding()
      initializeSelectedPlaceIndex()
    }
  }

  // Detection
  const onDetectionItemActionClick = (event, detectionItem, isAuto = false) => {
    openClockInModal()

    setIsAutoClocking(isAuto)
    setCurrentDetectionItem(detectionItem)
  }

  // 判斷座標是否在seated中
  const getSeatedCoordinate = async person => {
    const cameraId = trim(person.cameraId, tableNumber) // Ex: Table-0813-A => A
    const personXCoordinate = person.rect[0]
    const personYCoordinate = person.rect[1]
    const personWidth = person.rect[2]
    const personHeight = person.rect[3]
    const personMidPoint = [personXCoordinate + personWidth / 2, personYCoordinate + personHeight / 2]

    const seatedIndex = await Number(
      findKey(SEATED_COORDINATE[cameraId], seated => {
        return (
          personMidPoint[0] >= seated.leftTop[0] && // 中心點的x大於位子的左上角x座標
          personMidPoint[0] <= seated.rightBottom[0] && // 中心點的x小於位子的右下角x座標
          personMidPoint[1] >= seated.leftTop[1] && // 中心點的y大於位子的左上角y座標
          personMidPoint[1] <= seated.rightBottom[1] // 中心點的y小於位子的右下角y座標
        )
      })
    )

    const isInSeatedPlace = !isNaN(seatedIndex)
    return { isInSeatedPlace, seatedIndex }
  }

  // auto clock in
  const executeAutoClockIn = async (event, detectionItem) => {
    const person = getPersonByType(detectionItem.type, detectionItem)
    const newPerson = {
      ...person,
      identify: detectionItem.type === PERSON_TYPE.MEMBER ? person.id : detectionItem.type === PERSON_TYPE.ANONYMOUS && PERSON_TYPE.ANONYMOUS,
      rect: detectionItem.rect,
      cameraId: detectionItem.cameraId,
      type: detectionItem.type,
      cardType: detectionItem.probableList[0].level,
    }

    let { id, image } = newPerson
    const { tempId, name, compareImage, memberCard, identify, type, cardType } = newPerson
    const isClockInSeated = Boolean(seatedList.find(seatedItem => seatedItem && seatedItem.tempId === person.tempId))
    const isClockInStanding = Boolean(standingList.find(seatedItem => seatedItem && seatedItem.tempId === person.tempId))

    if (isClockInSeated || isClockInStanding) return

    const { isInSeatedPlace, seatedIndex } = await getSeatedCoordinate(newPerson)
    const isSomeoneOnSeated = seatedList[seatedIndex] !== undefined

    if (identify === PERSON_TYPE.ANONYMOUS) {
      // 若是 anonymous
      // 即自動建立臨時帳號
      // 並以取得的 id 放進 seat / standing list 中
      const apiId = await GameApi.anonymousClockIn({ tempId, name, snapshot: image, tableNumber })
      if (isInSeatedPlace && !isSomeoneOnSeated) {
        await addSeatItem({ tempId: String(tempId), id: String(apiId), image, isAuto: true, type, cardType }, seatedIndex)
      } else {
        const standingIndex = findIndex(standingList, item => item === undefined)

        await addStandingItem({ tempId: String(tempId), id: String(apiId), image, isAuto: true, type, cardType }, standingIndex)
      }
      return apiId && true
    } else if (identify === PERSON_TYPE.MEMBER_CARD) {
      // 若是 member card
      // 即為會員，使用荷官輸入的 member card
      // 立刻關掉 modal
      // 圖片改用資料庫中的照片
      await GameApi.memberClockInByMemberCard({ memberCard })
    } else {
      // 若不是 anonymous 或者 member card
      // 即為荷官辨識出該會員，使用資料庫中原有的 id card
      // 圖片改用資料庫中的照片
      const apiId = await GameApi.memberClockInById({ id, tableNumber })
      image = compareImage

      if (isInSeatedPlace && !isSomeoneOnSeated) {
        await addSeatItem({ tempId: String(tempId), id: String(id), image, isAuto: true, type, cardType }, seatedIndex)
      } else {
        const standingIndex = findIndex(standingList, item => item === undefined)

        await addStandingItem({ tempId: String(tempId), id: String(id), image, isAuto: true, type, cardType }, standingIndex)
      }

      return new Promise((resolve, reject) => {
        // 傳入 resolve 與 reject，表示資料成功與失敗
        if (apiId && true) {
          setTimeout(function () {
            // 3 秒時間後，透過 resolve 來表示完成
            resolve(apiId && true)
          }, 200)
        } else {
          // 回傳失敗
        }
      })
    }
  }

  // ClockInModal
  const onClockInModalClose = event => closeClockInModal()
  const afterClockInModalClose = event => initializeCurrentDetectionItem()

  const onClockIn = async (event, person, isAutoClocking) => {
    if (!person) return closeClockInModal()

    let { id, image } = person
    const { tempId, name, compareImage, memberCard, identify, type, cardType } = person

    const isClockInSeated = await Boolean(seatedList.find(seatedItem => seatedItem && seatedItem.tempId === person.tempId))
    const isClockInStanding = await Boolean(standingList.find(seatedItem => seatedItem && seatedItem.tempId === person.tempId))

    if (isClockInSeated || isClockInStanding) return
    if (identify === PERSON_TYPE.ANONYMOUS) {
      // 若是 anonymous
      // 即自動建立臨時帳號
      // 並以取得的 id 放進 seat / standing list 中
      id = await GameApi.anonymousClockIn({ tempId, name, snapshot: image, tableNumber })
    } else if (identify === PERSON_TYPE.MEMBER_CARD) {
      // 若是 member card
      // 即為會員，使用荷官輸入的 member card
      // 立刻關掉 modal
      // 圖片改用資料庫中的照片
      await GameApi.memberClockInByMemberCard({ memberCard })
    } else {
      // 若不是 anonymous 或者 member card
      // 即為荷官辨識出該會員，使用資料庫中原有的 id card
      // 圖片改用資料庫中的照片
      await GameApi.memberClockInById({ id, tableNumber })
      image = compareImage
    }
    closeClockInModal()

    // 根據是否站立，設定位置列表的內容
    if (isAutoClocking) {
      const { isSeated, seatedIndex } = await getSeatedCoordinate(person)
      if (isSeated) {
        await addSeatItem({ tempId: String(tempId), id: String(id), image, isAuto: isAutoClocking, type, cardType }, seatedIndex)
      } else {
        const standingIndex = findIndex(standingList, item => item === undefined)

        await addStandingItem({ tempId: String(tempId), id: String(id), image, isAuto: isAutoClocking, type, cardType }, standingIndex)
      }

      await initializeCurrentDetectionItem()
    } else if (isSelectedPlaceStanding) {
      addStandingItem({ tempId: String(tempId), id: String(id), image, isAuto: isAutoClocking, type, cardType }, selectedPlaceIndex)
    } else {
      addSeatItem({ id: String(id), image, isAuto: isAutoClocking, type, cardType }, selectedPlaceIndex)
    }

    await closeClockInModal()
    await initializeIsSelectedPlaceStanding()
    await initializeSelectedPlaceIndex()
  }

  // MemberDetail
  const onClockOut = async (values, player, isAutoClocking = false) => {
    let isPlayerInClockOutPlayer = await Boolean(findIndex(clockOutPlayer, player) !== -1)

    if (isAutoClocking && isPlayerInClockOutPlayer) {
      await GameApi.clockOut({ id: player.memberId, ...values, tableNumber, type: player.type })
      await removeClockOutPlayer(player)

      const isSeated = player.seatedIndex !== -1
      const isStanding = player.standingIndex !== -1

      if (isSeated) removeSeatItem(player.seatedIndex)
      if (isStanding) removeStandingItem(player.standingIndex)
    } else {
      await GameApi.clockOut({ id: memberId, ...values, tableNumber, type })

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
  }

  const renderAutomaticNotice = clockState => {
    switch (clockState) {
      case CLOCK_STATUS.MANUALLY_CLOCK || CLOCK_STATUS.AUTO_CLOCK:
        return null
      case CLOCK_STATUS.AUTO_ANONYMOUS_CLOCK:
        return <div className={cx('home-table__seating-plan__notice')}>Automatic Clock-In/Out: Anonymous</div>
      case CLOCK_STATUS.AUTO_MEMBER_CLOCK:
        return <div className={cx('home-table__seating-plan__notice')}>Automatic Clock-In/Out: Member</div>
    }
  }
  return isDetailVisible ? (
    <MemberDetail onClockOut={onClockOut} isSelectedPlaceStanding={isSelectedPlaceStanding} selectedPlaceIndex={selectedPlaceIndex} {...props} />
  ) : (
    <div className={cx('home-table')}>
      <div className={cx('home-table__seating-plan')}>
        {renderAutomaticNotice(clockState)}
        <div className={cx('home-table__seated-wrapper')}>
          <Seated
            seatedList={seatedList}
            selectedIndex={isSelectedPlaceStanding ? null : selectedPlaceIndex}
            onPlaceSelect={onPlaceClick}
            tableNumber={tableNumber}
          />
          <h2 className={cx('home-table__seated-title')}>Seated</h2>
        </div>
        <div className={cx('home-table__standing-wrapper')}>
          <Standing standingList={standingList} selectedIndex={isSelectedPlaceStanding ? selectedPlaceIndex : null} onPlaceSelect={onPlaceClick} />
          <h2 className={cx('home-table__standing-title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>
        <Detection
          isPlaceSelected={selectedPlaceIndex !== null}
          onItemActionClick={onDetectionItemActionClick}
          autoClockIn={executeAutoClockIn}
          onClockOut={onClockOut}
          isOpened={isClockInModalOpened}
          clockState={clockState}
        />
      </div>
      <ClockInModal
        detectionItem={currentDetectionItem}
        isOpened={isClockInModalOpened}
        onClose={onClockInModalClose}
        afterClose={afterClockInModalClose}
        onClockIn={onClockIn}
        isAutoClocking={isAutoClocking}
      />
    </div>
  )
}

Table.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockState: tableSelectors.getClockState(state, props),
    clockOutPlayer: tableSelectors.getClockOutPlayer(state, props),
  }
}

const mapDispatchToProps = {
  addSeatItem: seatedOperations.addItemToList,
  removeSeatItem: seatedOperations.removeItemFromList,
  initStandingList: standingOperations.initStandingList,
  addStandingItem: standingOperations.addItemToList,
  removeStandingItem: standingOperations.removeItemFromList,
  changeTableNumber: tableOperations.changeTableNumber,
  removeClockOutPlayer: tableOperations.removeClockOutPlayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
