import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { difference, get } from 'lodash'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'

// Modules
import { selectors as tableSelectors } from '../../../../../../lib/redux/modules/table'

// Lib MISC
import DeviceApi from '../../../../../../lib/api/Device'
import { selectors as seatedSelectors } from '../../../../../../lib/redux/modules/seated'
import { selectors as standingSelectors } from '../../../../../../lib/redux/modules/standing'
import usePrevious from '../../../../../../lib/effects/usePrevious'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'
import automaticInfoSVG from '../../../../../../../assets/images/icons/automatic-info.svg'

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
}

function Detection (props) {
  const { seatedList, standingList, tableNumber, isPlaceSelected, onItemActionClick, clockState } = props
  const [detectionList, setDetectionList] = useState([])
  const detectionListRecordTime = useRef({})
  const previousDetectionList = usePrevious(detectionList)

  useEffect(() => {
    const timerSecond = 2
    const fetchDataObservable = timer(0, 1000 * timerSecond).pipe(flatMap(index => from(DeviceApi.fetchDetectionList({ tableNumber }))))
    const fetchDataSubscription = fetchDataObservable.subscribe(response => {
      setDetectionList(response.sort((a, b) => new BigNumber(a.rect[0]).comparedTo(b.rect[0])))
    })

    return () => {
      fetchDataSubscription.unsubscribe()
    }
  }, [tableNumber])

  // 記錄每個人員的時間及移除離開人員
  if (detectionList.length > 0 && previousDetectionList && previousDetectionList.length > 0) {
    const currentDetectionListTempId = detectionList.map(item => item.probableList[0].tempId)
    const previousDetectionListTempId = previousDetectionList.map(item => item.probableList[0].tempId)

    currentDetectionListTempId.forEach(itemTempId => {
      const hasAccount = typeof detectionListRecordTime.current[itemTempId] !== 'undefined'

      if (!hasAccount) {
        detectionListRecordTime.current[itemTempId] = new Date().getTime()
      }
    })

    const leaveDetectionList = difference(previousDetectionListTempId, currentDetectionListTempId)

    leaveDetectionList.map(tempId => {
      delete detectionListRecordTime.current[tempId]
    })
  }

  // polling
  // const detectionList = [
  //   {
  //     background: '',
  //     dateTime: '',
  //     probableList: [
  //       {
  //         id: '',
  //         image: '',
  //         name: '20190815-Table-0812-33',
  //         similarity: 100,
  //         tempId: '20190815-Table-0812-33',
  //       },
  //     ],
  //     rect: [880, 496, 288, 288],
  //     snapshot: '',
  //     type: 'anonymous',
  //   },
  //   {
  //     background: '',
  //     dateTime: '',
  //     probableList: [
  //       {
  //         id: '8000853',
  //         image: '',
  //         level: 'green',
  //         name: '84',
  //         similarity: 100,
  //         tempId: '8444444444',
  //       },
  //     ],
  //     rect: [870, 496, 288, 288],
  //     snapshot: '',
  //     type: 'member',
  //   },
  // ]

  const CLOCK_IN_TRIGGER_TIME = 8000

  const executeAutoClockInByClockState = (detectionItem, detectionItemExistingTime) => {
    switch (clockState) {
      case 'autoAnonymous':
        if (detectionItem.type === 'anonymous' && detectionItemExistingTime >= CLOCK_IN_TRIGGER_TIME) {
          // console.log('autoAnonymous detectionListRecordTime', detectionListRecordTime)
          // onItemActionClick(event, detectionItem, detectionItemTempId, true)
        }
        break
      case 'autoMember':
        if (detectionItem.type === 'member' && detectionItemExistingTime >= CLOCK_IN_TRIGGER_TIME) {
          // console.log('autoMember detectionListRecordTime', detectionListRecordTime)
          // onItemActionClick(event, detectionItem, detectionItemTempId, true)
        }
        break
      case 'autoClock':
        // if (detectionItemExistingTime > 8000) {
        // console.log('autoClock detectionListRecordTime', detectionListRecordTime)
        // onItemActionClick(event, detectionItem, detectionItemTempId, true)
        // }
        break
    }
  }

  const renderAutomaticInfo = () => (
    <div className={cx('home-table-detection-automatic')}>
      <img className={cx('home-table-detection-automatic__image')} src={automaticInfoSVG} alt='automaticInfo' />
      <p className={cx('home-table-detection-automatic__title')}>Automatic Clock-In/Out Member and Anonymous is Active</p>
      <p className={cx('home-table-detection-automatic__description')}>The system is automatically clocking-in/out member and amomymous.</p>
      <p className={cx('home-table-detection-automatic__description')}>
        If you want to manually clock-in/out players, please change it in the “SETTINGS” page.
      </p>
    </div>
  )

  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 20
  const itemBorder = 30
  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing

  const renderDetectionCarousel = () =>
    detectionList.length > 0 && (
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
          {detectionList.map((detectionItem, index) => {
            const person = getPersonByType(detectionItem.type, detectionItem)
            const detectionItemTempId = get(detectionItem, 'probableList[0].tempId')
            const detectionItemExistingTime = new Date().getTime() - detectionListRecordTime.current[detectionItemTempId]
            const isExistedSeated = seatedList.find(seatedItem => (seatedItem && seatedItem.id === person.id) || seatedItem.tempId === person.tempId)
            const isExistedStanding = standingList.find(
              seatedItem => (seatedItem && seatedItem.id === person.id) || seatedItem.tempId === person.tempId
            )

            switch (true) {
              case isExistedSeated:
                return null
              case isExistedStanding:
                return null
              case clockState !== 'manualClock':
                executeAutoClockInByClockState(detectionItem, detectionItemExistingTime)
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

  return <div>{clockState === 'autoClock' ? renderAutomaticInfo() : renderDetectionCarousel()}</div>
}

Detection.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    tableNumber: tableSelectors.getTableNumber(state, props),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detection)
