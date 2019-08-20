import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { get } from 'lodash'

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

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  tableNumber: PropTypes.string,
  clockState: PropTypes.string,
  // isOpened: PropTypes.bool,
  isPlaceSelected: PropTypes.bool,
  onItemActionClick: PropTypes.func,
  // autoMemberTriggerTime: PropTypes.array,
  // autoAnonymousTriggerTime: PropTypes.array,
}

function Detection (props) {
  const {
    seatedList,
    standingList,
    tableNumber,
    isPlaceSelected,
    onItemActionClick,
    clockState,
    // autoMemberTriggerTime,
    // autoAnonymousTriggerTime,
  } = props
  console.warn('detection')
  const [detectionList, setDetectionList] = useState([])
  console.log('detectionList 000000000', detectionList)
  const [detectionItemLogInTimer, setDetectionItemLogInTimer] = useState({}) //
  // const [currentDetectionListTempId, setCurrentDetectionListTempId] = useState([]) //
  // const [previousDetectionListTempId, setPreviousDetectionListTempId] = useState([])
  // const [currentDetectionListTempIdArray, setCurrentDetectionListTempIdArray] = useState([])
  // const [previousDetectionListTempIdArray, setPreviousDetectionListTempIdArray] = useState([])
  // const [leaveDetectionList, setLeaveDetectionList] = useState([]) //
  const previousDetectionList = usePrevious(detectionList)
  // const previousDetectionItemLogInTimer = usePrevious(detectionItemLogInTimer)
  console.log('previousDetectionList', previousDetectionList)
  // console.log('previousDetectionItemLogInTimer', previousDetectionItemLogInTimer)
  console.warn('detectionList', detectionList)
  // if(detectionList.length > 0)
  // console.log('detectionListTempId', currentDetectionListTempId)
  // console.log('previousDetectionListTempId', previousDetectionListTempId)
  // if (previousDetectionList && previousDetectionList.length > 0) {
  //   const currentDetectionListTempIdArray = detectionList.map(item => {
  //     return item.probableList[0].tempId
  //   })
  //   const previousDetectionListTempIdArray = previousDetectionList.map(item => {
  //     return item.probableList[0].tempId
  //   })

  //   const leaveDetectionList = difference(previousDetectionListTempIdArray, currentDetectionListTempIdArray)
  //   const newDetectionItemLogInTimer = omit(detectionItemLogInTimer, leaveDetectionList)
  //   setDetectionItemLogInTimer(newDetectionItemLogInTimer)
  // }

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

  // useEffect(() => {
  //   if (detectionList) {
  //     setCurrentDetectionListTempId(detectionList.map(item => item.probableList[0].tempId))
  //     setPreviousDetectionListTempId(previousDetectionList.map(item => item.probableList[0].tempId))
  //   }
  // }, [detectionList, previousDetectionList])

  // useEffect(() => {
  //   if (previousDetectionList && previousDetectionList.length > 0) {
  //     const newCurrentDetectionListTempIdArray = detectionList.map(item => {
  //       return item.probableList[0].tempId
  //     })
  //     const newPreviousDetectionListTempIdArray = previousDetectionList.map(item => {
  //       return item.probableList[0].tempId
  //     })

  //     setCurrentDetectionListTempIdArray(newCurrentDetectionListTempIdArray)
  //     setPreviousDetectionListTempIdArray(newPreviousDetectionListTempIdArray)
  //   }
  // }, [currentDetectionListTempIdArray, detectionList, previousDetectionList, previousDetectionListTempIdArray])

  // useEffect(() => {
  //   if (previousDetectionListTempIdArray.length > 0) {
  //     const newLeaveDetectionList = difference(previousDetectionListTempIdArray, currentDetectionListTempIdArray)
  //     setLeaveDetectionList(newLeaveDetectionList)
  //   }
  // }, [currentDetectionListTempIdArray, previousDetectionListTempIdArray])

  // useEffect(() => {
  //   if (leaveDetectionList.length > 0) {
  //     const newDetectionItemLogInTimer = JSON.stringify(detectionItemLogInTimer)
  //     console.warn('omitttttttttt')
  //     console.log('omit detectionItemLogInTimer 22222222', newDetectionItemLogInTimer)
  //     setDetectionItemLogInTimer(newDetectionItemLogInTimer, leaveDetectionList)
  //   }
  // }, [leaveDetectionList, detectionItemLogInTimer])

  useEffect(() => {
    setDetectionItemLogInTimer(detectionItemLogInTimer)
  }, [detectionItemLogInTimer])

  console.log('detectionItemLogInTimer 000000000', detectionItemLogInTimer)
  const itemWidth = Number(document.documentElement.style.getPropertyValue('--person-width').replace(/\D/gi, ''))
  const itemSpacing = 20
  const itemBorder = 30
  const slideWidth = `${itemWidth + itemSpacing * 2}px`
  const slideSpacing = -itemSpacing
  console.warn('detectionList', detectionList)

  return (
    <div className={cx('home-table-detection')}>
      {detectionList.length > 0 && (
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
            if (seatedList.find(seatedItem => seatedItem && seatedItem.id === person.id)) {
              return null
            } else if (standingList.find(seatedItem => seatedItem && seatedItem.id === person.id)) {
              return null
            } else if (clockState !== 'manualClock') {
              console.log('detectionItemLogInTimer 99999999999', detectionItemLogInTimer)
              const detectionItemTempId = get(detectionItem, 'probableList[0].tempId')
              // const hasAccount = typeof detectionItemLogInTimer[detectionItemTempId] === 'undefined'
              // console.warn('detectionItemTempId hasAccounttttttt', detectionItemTempId, hasAccount)
              // if (hasAccount) {
              // setDetectionItemLogInTimer({ ...detectionItemLogInTimer, detectionItemTempId: new Date().getTime() })
              // detectionItemLogInTimer[detectionItemTempId] = new Date().getTime()
              // } else {
              // const detectionItemExistingTime = new Date().getTime() - detectionItemLogInTimer[detectionItemTempId]
              // console.log(detectionItemTempId + 'detectionItem existing time', detectionItemExistingTime)

              switch (clockState) {
                case 'autoAnonymous':
                  if (detectionItem.type === 'anonymous') {
                    console.log('autoAnonymous detectionItemLogInTimer', detectionItemLogInTimer)
                    onItemActionClick(event, detectionItem, detectionItemTempId, true)
                  }
                  break
                case 'autoMember':
                  if (detectionItem.type === 'member') {
                    // console.log('autoMember detectionItemLogInTimer', detectionItemLogInTimer)
                    onItemActionClick(event, detectionItem, detectionItemTempId, true)
                  }
                  break
                case 'autoClock':
                  // if (detectionItemExistingTime > 8000) {
                  // console.log('autoClock detectionItemLogInTimer', detectionItemLogInTimer)
                  // onItemActionClick(event, detectionItem, detectionItemTempId, true)
                  // }
                  break
              }
              // }
            }

            return (
              <div
                key={index}
                style={{ padding: `${itemBorder}px ${itemSpacing}px`, outline: 0 }}
                onClick={isPlaceSelected ? event => onItemActionClick(event, detectionItem) : null}
              >
                <Person
                  title='level'
                  type={detectionItem.type}
                  person={person}
                  renderFooter={() => (
                    <Button isBlock disabled={!isPlaceSelected} onClick={event => onItemActionClick(event, detectionItem)}>
                      Clock-In
                    </Button>
                  )}
                />
              </div>
            )
            //
          })}
        </Carousel>
      )}
    </div>
  )
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
