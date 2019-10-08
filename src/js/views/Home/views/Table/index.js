import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import { findIndex, trim, findKey, set, isEmpty, find } from 'lodash'

// Components
import ClockInModal from './components/ClockInModal'
import Detection from './components/Detection'
import Seated from './components/Seated'
import Standing from './components/Standing'
import Modal from '../../../../components/Modal'
import Button from '../../../../components/Button'

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
import { selectors as settingSelectors } from '../../../../lib/redux/modules/setting'

// Lib MISC
import GameApi from '../../../../lib/api/Game'
import MemberApi from '../../../../lib/api/Member'
import TableApi from '../../../../lib/api/Table'
import findStaticPath from '../../../../lib/utils/find-static-path'
import getPersonByType from '../../../../lib/helpers/get-person-by-type'
import CLOCK_STATUS from '../../../../constants/ClockStatus'
import TEMP_ACCOUNT_CARD_TYPE from '../../../../constants/TempAccountCardType'
import { setLocalStorageItem, getLocalStorageItem } from '../../../../lib/helpers/localStorage'
import { seatedCoordinate, cameraProportion } from '../../../../constants/SeatedCoordinate'
import MISMATCH_FIELD from '../../../../constants/MismatchField'
import ERROR_MESSAGE from '../../../../constants/ErrorMessage'
import { parsePraListToBitValues, parsePraListToClockOutField } from '../../../../lib/utils/parse-pra-to-list'

// Style
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../constants/PersonType'
const cx = classnames.bind(styles)
const person = { width: '130px', height: '170px' }
const TOTAL_SEAT = 7

export const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  tableNumber: PropTypes.string,
  clockState: PropTypes.string,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  addSeatItem: PropTypes.func,
  removeSeatItem: PropTypes.func,
  addStandingItem: PropTypes.func,
  removeStandingItem: PropTypes.func,
  systemSettings: PropTypes.object,
  defaultRecord: PropTypes.object,
}

function Table (props) {
  const {
    match,
    history,
    tableNumber,
    clockState,
    seatedList,
    standingList,
    addSeatItem,
    removeSeatItem,
    addStandingItem,
    removeStandingItem,
    systemSettings,
    defaultRecord,
  } = props

  const clockOutDefaultValue = {
    anonymous: {
      playTypeNumber: defaultRecord.anonymousPlayType,
      propPlay: defaultRecord.anonymousPropPlay,
      averageBet: defaultRecord.anonymousAverageBet,
      actualWin: defaultRecord.anonymousActualWin,
      drop: defaultRecord.anonymousDrop,
      overage: defaultRecord.anonymousOverage,
      whoWin: defaultRecord.anonymousWhoWin,
    },
    member: {
      playTypeNumber: '', // 目前不需要用到 memeber default 的 playType
      propPlay: defaultRecord.memberPropPlay,
      averageBet: defaultRecord.memberAverageBet,
      actualWin: defaultRecord.memberActualWin,
      drop: defaultRecord.memberDrop,
      overage: defaultRecord.memberOverage,
      whoWin: defaultRecord.memberWhoWin,
    },
  }

  let clockOutPoutEnquiryValue = {}
  const clockOutFieldList = ['playTypeNumber', 'propPlay', 'averageBet', 'actualWin', 'drop', 'overage', 'whoWin']
  const clockOutValue = {
    playTypeNumber: '',
    propPlay: '',
    averageBet: '',
    actualWin: '',
    drop: '',
    overage: '',
    whoWin: '',
    praValue: 0,
  }

  const { path, params } = match
  let { memberId, type, cardType, seatNumber } = params

  const isDetailVisible = typeof memberId === 'string'
  const [isSelectedPlaceStanding, setIsSelectedPlaceStanding] = useState(null)
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null)
  const [isClockInModalOpened, setIsClockInModalOpened] = useState(false)
  const [currentDetectionItem, setCurrentDetectionItem] = useState(null)
  const [praValue, setPraValue] = useState(0)
  const [isOverride, setIsOverride] = useState(false)
  const [overrideValue, setOverrideValue] = useState({})
  const [clockErrorMessage, setClockErrorMessage] = useState('')
  const [isClockInErrorModalOpened, setIsClockInErrorModalOpened] = useState(false)
  const [isClockOutErrorModalOpened, setIsClockOutErrorModalOpened] = useState(false)
  const [isStopDetect, setIsStopDetect] = useState(false)
  const [autoClockOutErrorMessage, setAutoClockOutErrorMessage] = useState('')

  // private methods
  const initializeIsSelectedPlaceStanding = () => setIsSelectedPlaceStanding(null)
  const initializeSelectedPlaceIndex = () => setSelectedPlaceIndex(null)
  const openClockInModal = () => setIsClockInModalOpened(true)
  const closeClockInModal = () => setIsClockInModalOpened(false)
  const openClockInErrorModal = () => setIsClockInErrorModalOpened(true)
  const closeClockInErrorModal = () => setIsClockInErrorModalOpened(false)
  const initializeIsOverride = () => setIsOverride(false)
  const initializePraValue = () => setPraValue(0)
  const stopDetecting = () => setIsStopDetect(true)
  const keepDetecting = () => setIsStopDetect(false)

  const openClockOutErrorModal = () => setIsClockOutErrorModalOpened(true)
  const closeClockOutErrorModal = () => {
    const isNotClockIn = clockErrorMessage.indexOf(ERROR_MESSAGE.NOT_CLOCKED_IN) !== -1
    const isVacant = clockErrorMessage.indexOf(ERROR_MESSAGE.SEATED_IS_VACANT) !== -1

    if (isNotClockIn || isVacant) removeItemFromListByNotClockIn()

    setIsClockOutErrorModalOpened(false)
    initializePraValue()
    setIsOverride(false)
  }
  const initializeCurrentDetectionItem = () => setCurrentDetectionItem(null)

  const mapCardTypeToType = cardType => {
    if (cardType === TEMP_ACCOUNT_CARD_TYPE) {
      return 'anonymous'
    } else {
      return 'member'
    }
  }

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
      history.push(`${match.url}/${place.type}/${place.cardType}/${place.seatNumber}/${place.id}`)
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

  // 判斷座標是否在seated中
  const getSeatedCoordinate = async person => {
    const cameraId = trim(person.cameraId, tableNumber) // Ex: Table-0813-A => A
    const personXCoordinate = person.rect[0] / cameraProportion.x // 換算為 grid 的 x
    const personYCoordinate = person.rect[1] / cameraProportion.y // 換算為 grid的 y
    const personWidth = person.rect[2] / cameraProportion.x // 換算為 grid 的 width
    const personHeight = person.rect[3] / cameraProportion.y // 換算為 grid 的 height
    const personMidPoint = [personXCoordinate + personWidth / 2, personYCoordinate + personHeight / 2] // FR 座標為辨識綠框的左上角，但以中心點判斷較為精準

    const seatedIndex = await Number(
      findKey(seatedCoordinate[cameraId], seated => {
        return (
          personMidPoint[0] >= seated.topLeft[0] && // 中心點的x大於位子的左上角x座標
          personMidPoint[0] <= seated.bottomRight[0] && // 中心點的x小於位子的右下角x座標
          personMidPoint[1] >= seated.topLeft[1] && // 中心點的y大於位子的左上角y座標
          personMidPoint[1] <= seated.bottomRight[1] // 中心點的y小於位子的右下角y座標
        )
      })
    )
    const isInSeatedPlace = !isNaN(seatedIndex)
    return { isInSeatedPlace, seatedIndex }
  }

  const addSeatedItemToListByAutoClockIn = async (tempId, apiId, image, type, cardType, seatedIndex, seatNumber) => {
    // For Refresh - SeatedList local storage
    const newSeatedItem = { tempId: String(tempId), id: String(apiId), image, isAuto: true, type, cardType, seatNumber }
    const newSeatedList = seatedList.map((item, index) => (index === seatedIndex ? newSeatedItem : item))

    await setLocalStorageItem('seatedList', newSeatedList)
    await addSeatItem(newSeatedItem, seatedIndex)
  }

  const addStadingItemToListByAutoClockIn = async (tempId, apiId, image, type, cardType, standingIndex, seatNumber) => {
    // For Refresh - StandingList local storage
    const newStandingItem = { tempId: String(tempId), id: String(apiId), image, isAuto: true, type, cardType, seatNumber }
    const newStandingList = standingList.map((item, index) => (index === standingIndex ? newStandingItem : item))

    await setLocalStorageItem('standingList', newStandingList)
    await addStandingItem(newStandingItem, standingIndex)
  }

  // Automatically clock-in
  const executeAutoClockIn = async (event, detectionItem) => {
    let autoClockInPromise = new Promise(async (resolve, reject) => {
      // 從 detectionItem 的 probableList 挑出 similarity 最高者
      // 解構成 frond-end key
      const person = await getPersonByType(detectionItem.type, detectionItem)
      const newPerson = {
        ...person,
        identify: detectionItem.type === PERSON_TYPE.MEMBER ? person.id : detectionItem.type === PERSON_TYPE.ANONYMOUS && PERSON_TYPE.ANONYMOUS,
        rect: detectionItem.rect,
        cameraId: detectionItem.cameraId,
        type: detectionItem.type,
        cardType: detectionItem.probableList[0].level,
      }

      let { id, image } = await person
      const { tempId, name, memberCard, identify, type, cardType } = newPerson

      const { isInSeatedPlace, seatedIndex } = await getSeatedCoordinate(newPerson)
      const isSomeoneSeated = typeof seatedList[seatedIndex] === 'object'

      // Genting App standing 座位
      const standingIndex = await findIndex(standingList, item => item === undefined)

      // Dynamiq GTT 實際座位
      let seatNumber = (await seatedIndex) + 1
      if (!isInSeatedPlace || isSomeoneSeated) {
        seatNumber = (await standingIndex) + TOTAL_SEAT + 1
      }

      if (identify === PERSON_TYPE.ANONYMOUS) {
        // 若是 anonymous
        // 即自動建立臨時帳號
        // 並以取得的 id 放進 seat / standing list 中

        await GameApi.anonymousClockIn({ tempId, name, snapshot: image, tableNumber, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            if (isInSeatedPlace && !isSomeoneSeated) {
              await addSeatedItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, seatedIndex, seatNumber)
            } else {
              await addStadingItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, standingIndex, seatNumber)
            }
            await resolve(result)
          })
          .catch(async error => {
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }
            await reject(error.response)
          })
      } else if (identify === PERSON_TYPE.MEMBER_CARD) {
        // 若是 member card
        // 即為會員，使用荷官輸入的 member card
        // 立刻關掉 modal
        // 圖片改用資料庫中的照片
        await GameApi.memberClockInByMemberCard({ memberCard, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            if (isInSeatedPlace && !isSomeoneSeated) {
              await addSeatedItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, seatedIndex, seatNumber)
            } else {
              await addStadingItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, standingIndex, seatNumber)
            }
            await resolve(result)
          })
          .catch(async error => {
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }
            await reject(error.response)
          })
      } else {
        // 若不是 anonymous 或者 member card
        // 即為荷官辨識出該會員，使用資料庫中原有的 id card
        // 圖片改用資料庫中的照片
        await GameApi.memberClockInById({ id, tableNumber, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            if (isInSeatedPlace && !isSomeoneSeated) {
              await addSeatedItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, seatedIndex, seatNumber)
            } else {
              await addStadingItemToListByAutoClockIn(tempId, apiId, apiImage, type, cardType, standingIndex, seatNumber)
            }
            await resolve(result)
          })
          .catch(async error => {
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }
            await reject(error.response)
          })
      }
    })
    return autoClockInPromise
  }

  // ClockInModal
  const onClockInModalClose = event => closeClockInModal()
  const afterClockInModalClose = event => initializeCurrentDetectionItem()

  const addItemToListByManualClockIn = (tempId, id, image, type, cardType, seatNumber) => {
    // 根據是否站立，設定位置列表的內容
    if (isSelectedPlaceStanding) {
      // For Refresh - StandingList local storage
      const newStandingItem = { tempId: String(tempId), id: String(id), image, isAuto: false, type, cardType, seatNumber }
      const newStandingList = standingList.map((item, index) => (index === selectedPlaceIndex ? newStandingItem : item))

      setLocalStorageItem('standingList', newStandingList)
      addStandingItem(newStandingItem, selectedPlaceIndex)
    } else {
      // For Refresh - SeatedList local storage
      const newSeatedItem = { tempId: String(tempId), id: String(id), image, isAuto: false, type, cardType, seatNumber }
      const newSeatedList = seatedList.map((item, index) => (index === selectedPlaceIndex ? newSeatedItem : item))

      setLocalStorageItem('seatedList', newSeatedList)
      addSeatItem(newSeatedItem, selectedPlaceIndex)
    }

    closeClockInModal()
    initializeIsSelectedPlaceStanding()
    initializeSelectedPlaceIndex()
  }

  // Manually clock-in
  const onManuallyClockIn = async (event, person) => {
    let manualClockInPromise = new Promise(async (resolve, reject) => {
      let { id, image } = person
      const { tempId, name, memberCard, identify, type, cardType } = person

      // Dynamiq GTT 實際座位
      let seatNumber = selectedPlaceIndex + 1
      if (isSelectedPlaceStanding) {
        seatNumber += TOTAL_SEAT
      }

      if (identify === PERSON_TYPE.ANONYMOUS) {
        // 若是 anonymous
        // 即自動建立臨時帳號
        // 並以取得的 id 放進 seat / standing list 中
        await GameApi.anonymousClockIn({ tempId, name, snapshot: image, tableNumber, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            addItemToListByManualClockIn(tempId, apiId, apiImage, type, cardType, seatNumber)
            await resolve(result)
          })
          .catch(async error => {
            // 如果有 error 就跳出 popup
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }

            setClockErrorMessage(errorMessage)
            openClockInErrorModal()
            await reject(error.response)
          })
      } else if (identify === PERSON_TYPE.MEMBER_CARD) {
        // 若是 member card
        // 即為會員，使用荷官輸入的 member card
        // 立刻關掉 modal
        // 圖片改用資料庫中的照片
        await GameApi.memberClockInByMemberCard({ memberCard, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            addItemToListByManualClockIn(tempId, apiId, apiImage, type, cardType, seatNumber)
            await resolve(result)
          })
          .catch(async error => {
            // 如果有 error 就跳出 popup
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }

            setClockErrorMessage(errorMessage)
            openClockInErrorModal()
            await reject(error.response)
          })
      } else {
        // 若不是 anonymous 或者 member card
        // 即為荷官辨識出該會員，使用資料庫中原有的 id card
        // 圖片改用資料庫中的照片
        await GameApi.memberClockInById({ id, tableNumber, seatNumber, cardType })
          .then(async result => {
            const { cid: apiId, pic: apiImage } = result

            addItemToListByManualClockIn(tempId, apiId, apiImage, type, cardType, seatNumber)
            await resolve(result)
          })
          .catch(async error => {
            // 如果有 error 就跳出 popup
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            // 如果 not log-on，自動 log-on
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              errorMessage += '. Please confirm Clock-In again.'
              TableApi.logOnTable({ tableNumber })
            }

            setClockErrorMessage(errorMessage)
            openClockInErrorModal()
            await reject(error.response)
          })
      }
    })
    return manualClockInPromise
  }

  const removeItemFromListByClockOut = async seatNumber => {
    // re-render 會造成 redux 的值變回舊的，所以直接取 localStorage 值以確保是最新的值
    const localStorageStandingList = getLocalStorageItem('standingList')
    const localStorageSeatedList = getLocalStorageItem('seatedList')

    const isPlayerInStanding = findIndex(localStorageStandingList, { seatNumber: Number(seatNumber) }) !== -1
    const isPlayerInSeated = findIndex(localStorageSeatedList, { seatNumber: Number(seatNumber) }) !== -1

    const indexInStadingList = findIndex(localStorageStandingList, { seatNumber: Number(seatNumber) }) // manual clock-out 時，不能用 selectedPlaceIndex，因為 refresh 會不見
    const indexInSeatedList = findIndex(localStorageSeatedList, { seatNumber: Number(seatNumber) })

    if (isPlayerInStanding) {
      // For Refresh - StandingList local storage
      const newStandingList = await localStorageStandingList.map((item, index) => (index === indexInStadingList ? undefined : item))
      await setLocalStorageItem('standingList', newStandingList)

      await removeStandingItem(indexInStadingList)
    } else if (isPlayerInSeated) {
      // For Refresh - SeatedList local storage
      const newSeatedList = await localStorageSeatedList.map((item, index) => (index === indexInSeatedList ? undefined : item))

      await setLocalStorageItem('seatedList', newSeatedList)

      await removeSeatItem(indexInSeatedList)
    }
  }

  // Auto clock out
  const executeAutoClockOut = async player => {
    let autoClockOutPromise = new Promise(async (resolve, reject) => {
      // re-render 會造成 redux 的值變回舊的，所以直接取 localStorage 值以確保是最新的值
      const localStorageStandingList = getLocalStorageItem('standingList')
      const localStorageSeatedList = getLocalStorageItem('seatedList')

      const isPlayerInStanding = await Boolean(find(localStorageStandingList, { seatNumber: player.seatNumber }))
      const isPlayerInSeated = await Boolean(find(localStorageSeatedList, { seatNumber: player.seatNumber }))

      if (!isPlayerInStanding && !isPlayerInSeated) return false // 執行 Redux remove item 時會 re-render，所以做此判斷以避免重複 call enquiry 跟 clock-out APIs

      // auto clock-out 時，如果 praValue 不等於 0，pra 對應的 field 就填入 default 的值，否則為空字串
      if (isEmpty(clockOutPoutEnquiryValue) && !isStopDetect && (isPlayerInStanding || isPlayerInSeated)) {
        await MemberApi.fetchMemberDetailByIdWithType({
          id: player.id,
          type: player.type,
          cardType: player.cardType,
          tableNumber,
          seatNumber: player.seatNumber,
        })
          .then(result => {
            clockOutFieldList.map(item => {
              set(clockOutPoutEnquiryValue, item, result[item])
            })
            set(clockOutValue, 'whoWin', clockOutDefaultValue[mapCardTypeToType(player.cardType)]['whoWin']) // 一開始先填 whoWin default value

            if (result?.praValue) {
              parsePraListToClockOutField(result.praValue).forEach(item => {})
            }
            if (result?.praValue === 1 || result?.praValue === 0) {
              set(clockOutValue, 'playTypeNumber', result['playTypeNumber']) // clock-out value
            }
            if (mapCardTypeToType(player.cardType) === 'anonymous') {
              set(clockOutValue, 'playTypeNumber', clockOutDefaultValue['anonymous']['playTypeNumber']) // clock-out value
            }
          })
          .catch(error => {
            let errorMessage = error.response.data.data
            errorMessage = trim(errorMessage.split('msg')[1], '}:"')

            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              // 如果 not log-on，自動 log-on
              TableApi.logOnTable({ tableNumber })
            } else if (errorMessage === ERROR_MESSAGE.NOT_CLOCKED_IN) {
              removeItemFromListByClockOut(player.seatNumber)
            } else if (errorMessage === ERROR_MESSAGE.SEATED_IS_VACANT) {
              removeItemFromListByClockOut(player.seatNumber)
            } else {
              clockOutPoutEnquiryValue = {}
              stopDetecting()
              removeItemFromListByClockOut(player.seatNumber)
              setAutoClockOutErrorMessage(error.response.data.data)
            }
            reject(error.response)
          })
      }

      if (!isEmpty(clockOutPoutEnquiryValue) && !isPlayerInStanding && !isPlayerInSeated) return false

      if (!isEmpty(clockOutPoutEnquiryValue) && (isPlayerInStanding || isPlayerInSeated)) {
        // 如果 enquiry 失敗就不執行 clock-out
        await GameApi.clockOut({
          id: player.id,
          tempId: player.tempId,
          ...clockOutValue,
          tableNumber,
          type: player.type,
          cardType: player.cardType,
          seatNumber: player.seatNumber,
        })
          .then(async result => {
            resolve(result)
          })
          .catch(error => {
            if (error?.response?.data) {
              let errorMessage = error.response.data.data
              errorMessage = trim(errorMessage.split('msg')[1], '}:"')

              const praErrorValue = trim(errorMessage.split('pra')[1], '=')
              const praMessage = parsePraListToBitValues(praErrorValue).join()

              const isPraErrorValue = trim(errorMessage.split('pra')[1], '=') > 0
              const isOverrideMessage = praMessage.indexOf('Override') !== -1

              if (isPraErrorValue && !isOverrideMessage) {
                parsePraListToClockOutField(praErrorValue).forEach(item => {
                  set(clockOutValue, item, clockOutDefaultValue[mapCardTypeToType(player.cardType)][item]) // clock-out value
                })
              } else {
                stopDetecting()
                removeItemFromListByClockOut(player.seatNumber)

                if (errorMessage) {
                  if (isPraErrorValue) {
                    errorMessage = `CID:  ${player.id}, Seat No: ${player.seatNumber}, Error: ${parsePraListToBitValues(praErrorValue)}`
                    setAutoClockOutErrorMessage(errorMessage)
                  } else {
                    errorMessage = `CID:  ${player.id}, Seat No: ${player.seatNumber}, Error: ${errorMessage}`
                    setAutoClockOutErrorMessage(errorMessage)
                  }
                } else {
                  errorMessage = `CID:  ${player.id}, Seat No: ${player.seatNumber}, Error: ${error.response.data.data}`
                  setAutoClockOutErrorMessage(errorMessage)
                }
              }
            }
            reject(error.response)
          })
      }
    })
    return autoClockOutPromise
  }

  // Manually clock out
  const onClockOut = async (values, player) => {
    // 從 seatedList / standingList 拿 tempId
    const playerInSeatedList = await find(seatedList, { seatNumber: Number(seatNumber) })
    const playerInStandingList = await find(standingList, { seatNumber: Number(seatNumber) })

    await GameApi.clockOut({
      id: memberId,
      tempId: playerInSeatedList ? playerInSeatedList.tempId : playerInStandingList.tempId,
      ...values,
      tableNumber,
      type,
      cardType,
      seatNumber: playerInSeatedList ? playerInSeatedList.seatNumber : playerInStandingList.seatNumber,
    })
      .then(result => {
        removeItemFromListByClockOut(seatNumber)

        initializeIsSelectedPlaceStanding()
        initializeSelectedPlaceIndex()
        initializeIsOverride()
        initializePraValue()

        history.push(findStaticPath(path))
      })
      .catch(error => {
        // 如果有 error 就跳出 popup
        if (error?.response) {
          let errorMessage = error.response.data.data
          errorMessage = trim(errorMessage.split('msg')[1], '}:"')

          if (errorMessage) {
            // 如果 error message 是由 msg 組成，回傳 msg 後的字串
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              // 如果 not log-on，自動 log-on
              errorMessage += '. Please confirm Clock-Out again.'
              TableApi.logOnTable({ tableNumber })
            } else if (errorMessage === ERROR_MESSAGE.NOT_CLOCKED_IN) {
              errorMessage += '. The system will remove the player.'
            } else if (errorMessage === ERROR_MESSAGE.SEATED_IS_VACANT) {
              errorMessage += '. The system will remove the player.'
            }

            const praErrorValue = trim(errorMessage.split('pra')[1], '=')
            const praMessage = parsePraListToBitValues(praErrorValue).join()

            const isPraErrorValue = trim(errorMessage.split('pra')[1], '=') > 0
            const isMismatchMessage = errorMessage.indexOf('mismatch') !== -1
            const isOverrideMessage = praMessage.indexOf('Override') !== -1
            const isNotPermittedMessage = errorMessage.indexOf('not permitted') !== -1

            switch (true) {
              case isNotPermittedMessage:
                // not permitted
                setIsOverride(!isNotPermittedMessage)
                break
              case isMismatchMessage:
                // mismatch override
                const mismatchMessage = errorMessage.split(' mismatch,')[0]
                const mismatchField = MISMATCH_FIELD[mismatchMessage]

                clockOutFieldList.map(item => {
                  set(clockOutValue, item, values[item])
                })

                set(clockOutValue, mismatchField, 1)

                setOverrideValue(clockOutValue)
                setIsOverride(isMismatchMessage)
                break
              case isPraErrorValue && isOverrideMessage:
                // pra override
                clockOutFieldList.map(item => {
                  set(clockOutValue, item, values[item])
                })

                errorMessage = parsePraListToBitValues(praErrorValue).join()

                setOverrideValue(clockOutValue)
                setIsOverride(isOverrideMessage)
                setPraValue(praErrorValue)

                break
              case isPraErrorValue && !isOverrideMessage:
                // pra message
                errorMessage = parsePraListToBitValues(praErrorValue).join(', ') + ', needs to be filled.'
                break
            }
            setClockErrorMessage(errorMessage)
          } else {
            // 如果 error message 不是由 msg 組成，直接回傳整個 error message
            setClockErrorMessage(error.response.data.data)
          }

          openClockOutErrorModal()
        }
      })
  }

  const confirmOverride = async () => {
    set(overrideValue, 'praValue', praValue)
    // 從 seatedList / standingList 拿 tempId
    const playerInSeatedList = find(seatedList, { seatNumber: Number(seatNumber) })
    const playerInStandingList = find(standingList, { seatNumber: Number(seatNumber) })

    await GameApi.clockOut({
      id: memberId,
      tempId: playerInSeatedList ? playerInSeatedList.tempId : playerInStandingList.tempId,
      ...overrideValue,
      tableNumber,
      type,
      cardType,
      seatNumber: playerInSeatedList ? playerInSeatedList.seatNumber : playerInStandingList.seatNumber,
    })
      .then(result => {
        removeItemFromListByClockOut(seatNumber)

        closeClockOutErrorModal()
        initializeIsOverride()
        initializePraValue()

        initializeIsSelectedPlaceStanding()
        initializeSelectedPlaceIndex()

        history.push(findStaticPath(path))
      })
      .catch(error => {
        // 如果有 error 就跳出 popup
        if (error?.response) {
          let errorMessage = error.response.data.data
          errorMessage = trim(errorMessage.split('msg')[1], '}:"')

          if (errorMessage) {
            if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
              // 如果 not log-on，自動 log-on
              errorMessage += '. Please confirm Clock-Out again.'
              setIsOverride(false)
              TableApi.logOnTable({ tableNumber })
            } else if (errorMessage === ERROR_MESSAGE.NOT_CLOCKED_IN) {
              errorMessage += '. The system will remove the player.'
              setIsOverride(false)
            } else if (errorMessage === ERROR_MESSAGE.SEATED_IS_VACANT) {
              errorMessage += '. The system will remove the player.'
              setIsOverride(false)
            }

            // 如果 error message 是由 msg 組成，回傳 msg 後的字串
            const praErrorValue = trim(errorMessage.split('pra')[1], '=')
            const praMessage = parsePraListToBitValues(praErrorValue).join()

            const isPraErrorValue = trim(errorMessage.split('pra')[1], '=') > 0
            const isMismatchMessage = errorMessage.indexOf('mismatch') !== -1
            const isOverrideMessage = praMessage.indexOf('Override') !== -1
            const isNotPermittedMessage = errorMessage.indexOf('not permitted') !== -1

            switch (true) {
              case isNotPermittedMessage:
                // not permitted
                setIsOverride(!isNotPermittedMessage)
                break
              case isMismatchMessage:
                // mismatch
                const mismatchMessage = errorMessage.split(' mismatch,')[0]
                const mismatchField = MISMATCH_FIELD[mismatchMessage]

                set(overrideValue, mismatchField, 1)
                setIsOverride(isMismatchMessage)
                break
              case isPraErrorValue && isOverrideMessage:
                // pra override
                errorMessage = parsePraListToBitValues(praErrorValue)

                setIsOverride(isOverrideMessage)
                setPraValue(praErrorValue)
                break
              case isPraErrorValue && !isOverrideMessage:
                // pra message
                errorMessage = parsePraListToBitValues(praErrorValue).join(', ') + ', needs to be filled.'
                break
            }
            setClockErrorMessage(errorMessage)
          } else {
            // 如果 error message 不是由 msg 組成，直接回傳整個 error message
            setClockErrorMessage(error.response.data.data)
          }
        }
      })
  }

  const removeItemFromListByNotClockIn = () => {
    removeItemFromListByClockOut(seatNumber)

    initializeIsSelectedPlaceStanding()
    initializeSelectedPlaceIndex()

    history.push(findStaticPath(path))
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

  const renderErrorModal = values =>
    isStopDetect && (
      <>
        <Modal className={cx('home-detection-stop-modal')} isClosable={false} shouldCloseOnOverlayClick={false} isOpened={isStopDetect}>
          <Modal.Header>
            <div className={cx('home-detection-stop-modal__header')}>{'Auto Clock-Out Error'}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-detection-stop-modal__body')}>
              {`There has been an error during auto clock-out. Please check the error log. `}
              <p>{autoClockOutErrorMessage}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='button'
              className={cx('home-detection-stop-modal__action')}
              size={'md'}
              onClick={() => {
                keepDetecting()
              }}
              isInvisible={isOverride}
            >
              Keep Detecting
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )

  return isDetailVisible ? (
    <MemberDetail
      onClockOut={onClockOut}
      memberPropPlayMother={defaultRecord.memberPropPlayMother}
      isOverride={isOverride}
      confirmOverride={confirmOverride}
      isClockOutErrorModalOpened={isClockOutErrorModalOpened}
      closeClockOutErrorModal={closeClockOutErrorModal}
      clockErrorMessage={clockErrorMessage}
      removeItemFromList={removeItemFromListByNotClockIn}
      {...props}
    />
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
          executeAutoClockIn={executeAutoClockIn}
          executeAutoClockOut={executeAutoClockOut}
          onClockOut={onClockOut}
          isOpened={isClockInModalOpened}
          clockState={clockState}
          isStopDetect={isStopDetect}
        />
      </div>
      <ClockInModal
        detectionItem={currentDetectionItem}
        isOpened={isClockInModalOpened}
        onClose={onClockInModalClose}
        afterClose={afterClockInModalClose}
        onClockIn={onManuallyClockIn}
        isClockInErrorModalOpened={isClockInErrorModalOpened}
        closeClockInErrorModal={closeClockInErrorModal}
        clockErrorMessage={clockErrorMessage}
        matchPercent={Number(systemSettings.matchPercentage)}
      />
      {renderErrorModal()}
    </div>
  )
}

Table.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockState: tableSelectors.getClockState(state, props),
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    defaultRecord: settingSelectors.getDefaultRecord(state, props),
    systemSettings: settingSelectors.getSystemSettings(state, props),
  }
}

const mapDispatchToProps = {
  addSeatItem: seatedOperations.addItemToList,
  removeSeatItem: seatedOperations.removeItemFromList,
  addStandingItem: standingOperations.addItemToList,
  removeStandingItem: standingOperations.removeItemFromList,
  changeTableNumber: tableOperations.changeTableNumber,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
