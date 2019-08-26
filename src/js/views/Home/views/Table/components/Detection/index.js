import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { get, find, findIndex } from 'lodash'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'

// Modules
import { operations as tableOperations, selectors as tableSelectors } from '../../../../../../lib/redux/modules/table'

// Lib MISC
import DeviceApi from '../../../../../../lib/api/Device'
import { selectors as seatedSelectors } from '../../../../../../lib/redux/modules/seated'
import { selectors as standingSelectors } from '../../../../../../lib/redux/modules/standing'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'
import personSVG from '../../../../../../../assets/images/icons/person.svg'

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
  onClockOut: PropTypes.func,
  autoSettings: PropTypes.object,
  defaultRecord: PropTypes.object,
  clockOutPlayer: PropTypes.array,
  addClockOutPlayer: PropTypes.func,
}

function Detection (props) {
  const {
    seatedList,
    standingList,
    tableNumber,
    isPlaceSelected,
    onItemActionClick,
    clockState,
    onClockOut,
    autoSettings,
    defaultRecord,
    clockOutPlayer,
    addClockOutPlayer,
  } = props

  const [detectionData, setDetectionData] = useState({})
  const clockInPlayer = useRef({})

  const clockOutDefaultValue = {
    anonymous: {
      playType: defaultRecord.anonymousPlayType,
      propPlay: defaultRecord.anonymousPropPlay === 0 ? '' : defaultRecord.anonymousPropPlay,
      averageBet: defaultRecord.anonymousAverageBet,
      actualWin: defaultRecord.anonymousActualWin,
      drop: defaultRecord.anonymousDrop,
      overage: defaultRecord.anonymousOverage,
      overallWinner: defaultRecord.anonymousWhoWin,
    },
    member: {
      playType: defaultRecord.memberPlayType,
      propPlay: defaultRecord.memberPropPlay === 0 ? '' : defaultRecord.memberPropPlay,
      averageBet: defaultRecord.memberAverageBet,
      actualWin: defaultRecord.memberActualWin,
      drop: defaultRecord.memberDrop,
      overage: defaultRecord.memberOverage,
      overallWinner: defaultRecord.memberWhoWin,
    },
  }

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

  // 如果detectionData.leave的item有clock in就放進clockOutPlayer
  useEffect(() => {
    if (
      typeof detectionData !== 'undefined' &&
      typeof detectionData.leave !== 'undefined' &&
      detectionData.leave.length > 0 &&
      clockState !== 'manualClock'
    ) {
      detectionData.leave.forEach(player => {
        const isLeavePlayerInSeatedList = Boolean(find(standingList, { tempId: player.tempId }))
        const isLeavePlayerInStandingList = Boolean(find(seatedList, { tempId: player.tempId }))

        if (isLeavePlayerInSeatedList || isLeavePlayerInStandingList) {
          const leavePlayerInSeatedList = find(seatedList, { tempId: player.tempId })
          const leavePlayerSeatedIndex = findIndex(seatedList, leavePlayerInSeatedList)

          const leavePlayerInStandingList = find(standingList, { tempId: player.tempId })
          const leavePlayerStandingIndex = findIndex(standingList, leavePlayerInStandingList)

          const memberId = leavePlayerInStandingList.id || leavePlayerInSeatedList.id

          const leavePlayer = { ...player, memberId: memberId, seatedIndex: leavePlayerSeatedIndex, standingIndex: leavePlayerStandingIndex }

          addClockOutPlayer(leavePlayer)
        }
      })
    }
  }, [addClockOutPlayer, clockState, detectionData, seatedList, standingList])

  // 如果clockOutPlayer的item超過clock-out triggrt time就clock-out
  if (clockOutPlayer.length > 0) {
    clockOutPlayer.forEach(player => {
      const playerLeaveTime = new Date(player.detectTime).getTime() // 後端傳date，前端轉毫秒
      const alreadyLeaveTime = (new Date().getTime() - playerLeaveTime) / 1000
      // console.warn('alreadyLeaveTime', alreadyLeaveTime)

      switch (player.type) {
        case 'anonymous':
          if (alreadyLeaveTime >= autoSettings.autoClockOutAnonymousSec) {
            delete clockInPlayer.current[player.tempId]
            onClockOut(clockOutDefaultValue[player.type], player, true)
          }
          break
        case 'member':
          if (alreadyLeaveTime >= autoSettings.autoClockOutMemberSec) {
            delete clockInPlayer.current[player.tempId]
            onClockOut(clockOutDefaultValue[player.type], player, true)
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
    const isAutoClockIn = clockState !== 'manualClock'
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

  const executeAutoClockInByClockState = (detectionItem, detectionItemExistingTime, detectionItemTempId) => {
    switch (clockState) {
      case 'autoAnonymous':
        if (detectionItem.type === 'anonymous' && detectionItemExistingTime >= autoSettings.autoClockInAnonymousSec) {
          clockInPlayer.current[detectionItemTempId] = true
          onItemActionClick(event, detectionItem, true)
        }
        break
      case 'autoMember':
        if (detectionItem.type === 'member' && detectionItemExistingTime >= autoSettings.autoClockInMemberSec) {
          clockInPlayer.current[detectionItemTempId] = true
          onItemActionClick(event, detectionItem, true)
        }
        break
      case 'autoClock':
        if (detectionItem.type === 'anonymous' && detectionItemExistingTime >= autoSettings.autoClockInAnonymousSec) {
          clockInPlayer.current[detectionItemTempId] = true
          onItemActionClick(event, detectionItem, true)
        }
        if (detectionItem.type === 'member' && detectionItemExistingTime >= autoSettings.autoClockInMemberSec) {
          clockInPlayer.current[detectionItemTempId] = true
          onItemActionClick(event, detectionItem, true)
        }
        break
    }
  }

  const renderAutomaticInfo = () =>
    typeof detectionData['detectionList'] !== 'undefined' &&
    detectionData.detectionList.length >= 0 && (
      <>
        {detectionData.detectionList.map(detectionItem => {
          const { detectionItemTempId, detectionItemExistingTime, isAlreadyClockIn } = setDetectionItemExstingTime(detectionItem)
          if (!isAlreadyClockIn) executeAutoClockInByClockState(detectionItem, detectionItemExistingTime, detectionItemTempId)
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
                if (clockState === 'autoMember' && detectionItem.type === 'member') return null
                if (clockState === 'autoAnonymous' && detectionItem.type === 'anonymous') return null
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

  return <>{clockState === 'autoClock' ? renderAutomaticInfo() : renderDetectionCarousel()}</>
}

Detection.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    tableNumber: tableSelectors.getTableNumber(state, props),
    autoSettings: tableSelectors.getAutoSettings(state, props),
    defaultRecord: tableSelectors.getDefaultRecord(state, props),
    clockOutPlayer: tableSelectors.getClockOutPlayer(state, props),
  }
}

const mapDispatchToProps = {
  addClockOutPlayer: tableOperations.addClockOutPlayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detection)
