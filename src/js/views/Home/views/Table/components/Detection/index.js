import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { get, find, findIndex, uniqBy } from 'lodash'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'

// Modules
import { operations as tableOperations, selectors as tableSelectors } from '../../../../../../lib/redux/modules/table'
import { selectors as settingSelectors } from '../../../../../../lib/redux/modules/setting'

// Lib MISC
import DeviceApi from '../../../../../../lib/api/Device'
import { selectors as seatedSelectors } from '../../../../../../lib/redux/modules/seated'
import { selectors as standingSelectors } from '../../../../../../lib/redux/modules/standing'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'
import personSVG from '../../../../../../../assets/images/icons/person.svg'
import CLOCK_STATUS from '../../../../../../constants/ClockStatus'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  tableNumber: PropTypes.string,
  clockState: PropTypes.string,
  isPlaceSelected: PropTypes.bool,
  onItemActionClick: PropTypes.func,
  executeAutoClockIn: PropTypes.func,
  executeAutoClockOut: PropTypes.func,
  autoSettings: PropTypes.object,
  // defaultRecord: PropTypes.object,
  clockOutPlayer: PropTypes.array,
  addClockOutPlayer: PropTypes.func,
  removeClockOutPlayer: PropTypes.func,
}

function Detection (props) {
  const {
    seatedList,
    standingList,
    tableNumber,
    clockState,
    isPlaceSelected,
    onItemActionClick,
    executeAutoClockIn,
    executeAutoClockOut,
    autoSettings,
    clockOutPlayer,
    addClockOutPlayer,
    removeClockOutPlayer,
  } = props

  const [detectionData, setDetectionData] = useState({})
  const clockInPlayer = useRef({})
  // console.log('clockInPlayer', clockInPlayer.current)
  // console.log('detectionData.leave', detectionData.leave)
  // console.log('clockOutPlayer', clockOutPlayer)

  useEffect(() => {
    const timerSecond = 2

    const fetchDataObservable = timer(0, 1000 * timerSecond).pipe(
      flatMap(() => {
        return from(DeviceApi.fetchDetectionList({ tableNumber }))
      })
    )

    const fetchDataSubscription = fetchDataObservable.subscribe(response => {
      const fetchData = {
        detectionList: response.detectionList.sort((a, b) => new BigNumber(a.rect[0]).comparedTo(b.rect[0])),
        stay: response.stay,
        leave: response.leave,
      }
      setDetectionData(fetchData)
    })
    return () => {
      fetchDataSubscription.unsubscribe()
    }
  }, [tableNumber])

  // 如果 detectionData.leave 的 item 有 clock in 就放進 clockOutPlayer
  useEffect(() => {
    if (
      typeof detectionData !== 'undefined' &&
      typeof detectionData.leave !== 'undefined' &&
      detectionData?.leave?.length > 0 &&
      clockState !== CLOCK_STATUS.MANUALLY_CLOCK
    ) {
      detectionData.leave.forEach(player => {
        const isLeavePlayerInSeated = Boolean(find(seatedList, { id: player.cid }))
        const isLeavePlayerInStanding = Boolean(find(standingList, { id: player.cid }))

        switch (true) {
          case isLeavePlayerInSeated:
            const leavePlayerInSeatedList = find(seatedList, { id: player.cid })
            const leavePlayerSeatedIndex = findIndex(seatedList, leavePlayerInSeatedList)
            const seatedLeavePlayer = {
              ...leavePlayerInSeatedList,
              seatedIndex: leavePlayerSeatedIndex,
              detectTime: player.detectTime,
            }
            setTimeout(() => addClockOutPlayer(seatedLeavePlayer), 10)
            break
          case isLeavePlayerInStanding:
            const leavePlayerInStandingList = find(standingList, { id: player.cid })
            const leavePlayerStandingIndex = findIndex(standingList, leavePlayerInStandingList)
            const standingLeavePlayer = {
              ...leavePlayerInStandingList,
              detectTime: player.detectTime,
              standingIndex: leavePlayerStandingIndex,
            }
            setTimeout(() => addClockOutPlayer(standingLeavePlayer), 10)
            break
        }
      })
    }
  }, [addClockOutPlayer, clockState, detectionData, seatedList, standingList])

  // 每次 call detection api 都要確認如果 clockOutPlayer 的 item 超過 clock-out triggrt time 就 clock-out
  if (clockOutPlayer.length > 0) {
    // 有 leave 時 detection 被 re-render 時，clockOutPlayer 就會重複
    // 暫時用 uniqBy 解，但還是會多 clock-out 一次
    uniqBy(clockOutPlayer).forEach(player => {
      const playerLeaveTime = new Date(player.detectTime).getTime() // 後端傳 date，前端轉毫秒
      const alreadyLeaveTime = (new Date().getTime() - playerLeaveTime) / 1000

      // console.warn(player.tempId + '  alreadyLeaveTime', alreadyLeaveTime)

      // 如果 clockOutPlayer 的 item 在被 clock-out 前出現在 stay，必須從 clockOutPlayer 移除
      const isBackToStay = Boolean(find(detectionData.stay, { cid: player.id }))
      if (isBackToStay) {
        setTimeout(() => removeClockOutPlayer(player), 10)
      }

      // 如果被 clock-out 就 removeClockOutPlayer 跟 delete clockInPlayer
      const isPlayerInStanding = Boolean(find(standingList, { id: player.id }))
      const isPlayerInSeated = Boolean(find(seatedList, { id: player.id }))

      if (!isPlayerInStanding && !isPlayerInSeated) {
        setTimeout(() => removeClockOutPlayer(player), 10)
        delete clockInPlayer.current[player.tempId]
      }

      switch (player.type) {
        case 'anonymous':
          if (alreadyLeaveTime >= autoSettings.autoClockOutMemberSec) {
            // 執行完 clock-ou API 得到 true
            executeAutoClockOut(player)
          }
          break
        case 'member':
          if (alreadyLeaveTime >= autoSettings.autoClockOutMemberSec) {
            // 執行完 clock-ou API 得到 true
            executeAutoClockOut(player)
          }
          break
      }
    })
  }

  const setDetectionItemExstingTime = detectionItem => {
    const person = getPersonByType(detectionItem.type, detectionItem)
    const detectionItemTempId = get(detectionItem, 'probableList[0].tempId')
    const detectionItemInStayList = find(detectionData['stay'], { tempId: detectionItemTempId })
    const detectionItemTime = new Date(detectionItemInStayList.detectTime).getTime() // 後端傳date，前端轉毫秒
    const detectionItemExistingTime = (new Date().getTime() - detectionItemTime) / 1000

    // console.log(detectionItemTempId + '   detectionItemExistingTime', detectionItemExistingTime)

    const isDetectItemInSeated = Boolean(
      seatedList.find(seatedItem => seatedItem && (seatedItem.id === person.id || seatedItem.tempId === person.tempId))
    )
    const isDetectItemInStanding = Boolean(
      standingList.find(seatedItem => seatedItem && (seatedItem.id === person.id || seatedItem.tempId === person.tempId))
    )
    const isAutoClockIn = clockState !== CLOCK_STATUS.MANUALLY_CLOCK
    const isAlreadyClockIn = typeof clockInPlayer.current[detectionItemTempId.toString()] !== 'undefined'

    return {
      person,
      detectionItemTempId,
      detectionItemExistingTime,
      isDetectItemInSeated,
      isDetectItemInStanding,
      isAutoClockIn,
      isAlreadyClockIn,
    }
  }

  const AUTO_CLOCK_IN_SECOND = {
    anonymous: autoSettings['autoClockInAnonymousSec'],
    member: autoSettings['autoClockInMemberSec'],
  }

  const autoClockInByType = (detectionItem, detectionItemExistingTime, detectionItemTempId) => {
    if (detectionItemExistingTime >= AUTO_CLOCK_IN_SECOND[detectionItem.type]) {
      executeAutoClockIn(event, detectionItem)

      const isPlayerInStanding = Boolean(find(standingList, { id: detectionItem.id }))
      const isPlayerInSeated = Boolean(find(seatedList, { id: detectionItem.id }))
      const isPlayerClockIn = isPlayerInStanding || isPlayerInSeated

      if (isPlayerClockIn) clockInPlayer.current[detectionItemTempId] = true
    }
  }

  const executeAutoClockInByClockState = async (detectionItem, detectionItemExistingTime, detectionItemTempId) => {
    switch (clockState) {
      case CLOCK_STATUS.AUTO_ANONYMOUS_CLOCK:
        if (detectionItem.type === 'anonymous') {
          await autoClockInByType(detectionItem, detectionItemExistingTime, detectionItemTempId)
        }

        break
      case CLOCK_STATUS.AUTO_MEMBER_CLOCK:
        if (detectionItem.type === 'member') {
          await autoClockInByType(detectionItem, detectionItemExistingTime, detectionItemTempId)
        }
        break
      case CLOCK_STATUS.AUTO_CLOCK:
        await autoClockInByType(detectionItem, detectionItemExistingTime, detectionItemTempId)
        break
    }
  }

  const renderAutomaticInfo = () =>
    typeof detectionData['detectionList'] !== 'undefined' &&
    detectionData.detectionList.length >= 0 && (
      <>
        {detectionData.detectionList.map(detectionItem => {
          const {
            detectionItemTempId,
            detectionItemExistingTime,
            isAlreadyClockIn,
            isDetectItemInSeated,
            isDetectItemInStanding,
          } = setDetectionItemExstingTime(detectionItem)

          if (!isAlreadyClockIn && !isDetectItemInSeated && !isDetectItemInStanding) {
            executeAutoClockInByClockState(detectionItem, detectionItemExistingTime, detectionItemTempId)
          }
        })}

        <div className={cx('home-table-detection-automatic')}>
          <div className={cx('home-table-detection-automatic__image-wrapper')}>
            <img className={cx('home-table-detection-automatic__image')} src={personSVG} alt='automaticInfo' />
            <Icon
              className={cx('home-table-detection-automatic__icon')}
              name='gear'
              mode='01'
              width={80}
              height={80}
              viewBox={`0 0 60 60`}
              preserveAspectRatio='xMinYMin slice'
            />
          </div>
          <p className={cx('home-table-detection-automatic__title')}>Automatic Clock-In/Out Member and Anonymous is Active</p>
          <p className={cx('home-table-detection-automatic__description')}>The system is automatically clocking-in/out member and amomymous.</p>
          <p className={cx('home-table-detection-automatic__description')}>
            If you want to manually clock-in/out players, please change it in the “SETTINGS” page.
          </p>
        </div>
      </>
    )

  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 20
  const itemBorder = 30
  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  const renderDetectionCarousel = () =>
    typeof detectionData['detectionList'] !== 'undefined' &&
    detectionData.detectionList.length > 0 && (
      <div className={cx('home-table-detection')}>
        <Carousel
          autoGenerateStyleTag={false}
          withoutControls
          initialSlideHeight={530}
          edgeEasing='easeBackOut'
          slidesToScroll='auto'
          slideWidth={slideWidth}
          cellSpacing={slideSpacing}
          speed={800}
        >
          {detectionData.detectionList.map((detectionItem, index) => {
            const {
              person,
              detectionItemTempId,
              detectionItemExistingTime,
              isDetectItemInSeated,
              isDetectItemInStanding,
              isAutoClockIn,
              isAlreadyClockIn,
            } = setDetectionItemExstingTime(detectionItem)

            switch (true) {
              case isDetectItemInSeated:
                return null
              case isDetectItemInStanding:
                return null
              case isAutoClockIn && !isAlreadyClockIn:
                executeAutoClockInByClockState(detectionItem, detectionItemExistingTime, detectionItemTempId)
                if (clockState === CLOCK_STATUS.AUTO_MEMBER_CLOCK && detectionItem.type === 'member') return null
                if (clockState === CLOCK_STATUS.AUTO_ANONYMOUS_CLOCK && detectionItem.type === 'anonymous') return null
                break
            }

            return (
              <div
                key={index}
                style={{ padding: `${itemBorder}px ${itemSpacing}px`, outline: 0 }}
                onClick={isPlaceSelected ? event => onItemActionClick(event, detectionItem, false) : null}
              >
                <Person
                  title='level'
                  type={detectionItem.type}
                  person={person}
                  renderFooter={() => (
                    <Button isBlock disabled={!isPlaceSelected} onClick={event => onItemActionClick(event, detectionItem, false)}>
                      Clock-In
                    </Button>
                  )}
                />
              </div>
            )
            //
          })}
        </Carousel>
      </div>
    )

  return <>{clockState === CLOCK_STATUS.AUTO_CLOCK ? renderAutomaticInfo() : renderDetectionCarousel()}</>
}

Detection.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockOutPlayer: tableSelectors.getClockOutPlayer(state, props),
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    autoSettings: settingSelectors.getAutoSettings(state, props),
    defaultRecord: settingSelectors.getDefaultRecord(state, props),
  }
}

const mapDispatchToProps = {
  addClockOutPlayer: tableOperations.addClockOutPlayer,
  removeClockOutPlayer: tableOperations.removeClockOutPlayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detection)
