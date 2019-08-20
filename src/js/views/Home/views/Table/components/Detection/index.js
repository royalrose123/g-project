import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import Carousel from 'nuka-carousel'
import { BigNumber } from 'bignumber.js'
import { from, timer } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { get, difference, omit } from 'lodash'

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
    // isOpened,
    isPlaceSelected,
    onItemActionClick,
    clockState,
    // autoMemberTriggerTime,
    // autoAnonymousTriggerTime,
  } = props
  console.warn('detection')
  const [detectionList, setDetectionList] = useState([])
  console.log('detectionList 000000000', detectionList)
  let [detectionItemLogInTimer, setDetectionItemLogInTimer] = useState({}) //
  const [currentDetectionListTempIdArray, setCurrentDetectionListTempIdArray] = useState([])
  const [previousDetectionListTempIdArray, setPreviousDetectionListTempIdArray] = useState([])
  let [leaveDetectionList, setLeaveDetectionList] = useState([]) //
  const previousDetectionList = usePrevious(detectionList)
  console.log('previousDetectionList', previousDetectionList)

  // const newCurrentDetectionListTempIdArray = detectionList.map(item => {
  //   return item.probableList[0].tempId
  // })
  // const newPreviousDetectionListTempIdArray = previousDetectionList.map(item => {
  //   return item.probableList[0].tempId
  // })

  console.log('detectionItemLogInTimer 00000000', detectionItemLogInTimer)
  console.log('currentDetectionListTempIdArray', currentDetectionListTempIdArray)
  console.log('previousDetectionListTempIdArray', previousDetectionListTempIdArray)

  // if (leaveDetectionList.length > 0) {
  //   detectionItemLogInTimer = omit(detectionItemLogInTimer, leaveDetectionList)
  //   console.warn('omitttttttttt')
  //   console.log('omit detectionItemLogInTimer 22222222', detectionItemLogInTimer)
  // }

  console.log('detectionItemLogInTimer 111111', detectionItemLogInTimer)
  console.log('leaveDetectionList', leaveDetectionList)

  // console.log('detectionItemLogInTimer init', detectionItemLogInTimer)
  // console.log('autoMemberTriggerTime', autoMemberTriggerTime)
  // console.log('autoAnonymousTriggerTime', autoAnonymousTriggerTime)
  // console.warn('isOpend', isOpened)
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
  // if (detectionList && previousDetectionList) {
  //   console.log('cooooooool')
  // currentDetectionListTempIdArray = detectionList.map(item => {
  //   return item.probableList[0].tempId
  // })

  // previousDetectionListTempIdArray = previousDetectionList.map(item => {
  //   return item.probableList[0].tempId
  // })

  // setCurrentDetectionListTempIdArray(currentDetectionListTempIdArray)
  // setPreviousDetectionListTempIdArray(previousDetectionListTempIdArray)
  // }

  // useEffect(() => {}, [])

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

  useEffect(() => {
    if (previousDetectionList && previousDetectionList.length > 0) {
      const newCurrentDetectionListTempIdArray = detectionList.map(item => {
        return item.probableList[0].tempId
      })
      const newPreviousDetectionListTempIdArray = previousDetectionList.map(item => {
        return item.probableList[0].tempId
      })

      setCurrentDetectionListTempIdArray(newCurrentDetectionListTempIdArray)
      setPreviousDetectionListTempIdArray(newPreviousDetectionListTempIdArray)
    }
  }, [currentDetectionListTempIdArray, detectionList, previousDetectionList, previousDetectionListTempIdArray])

  useEffect(() => {
    if (previousDetectionListTempIdArray.length > 0) {
      const newLeaveDetectionList = difference(previousDetectionListTempIdArray, currentDetectionListTempIdArray)
      setLeaveDetectionList(newLeaveDetectionList)
    }
  }, [currentDetectionListTempIdArray, previousDetectionListTempIdArray])

  useEffect(() => {
    if (leaveDetectionList.length > 0) {
      const newDetectionItemLogInTimer = omit(detectionItemLogInTimer, leaveDetectionList)
      console.warn('omitttttttttt')
      console.log('omit detectionItemLogInTimer 22222222', newDetectionItemLogInTimer)
      setDetectionItemLogInTimer(newDetectionItemLogInTimer)
    }
  }, [leaveDetectionList])

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
            const detectionItemTempId = get(detectionItem, 'probableList[0].tempId').toString()
            // currentDetectionListTempIdArray = detectionList.map(item => {
            //   return item.probableList[0].tempId
            // })

            // previousDetectionListTempIdArray = previousDetectionList.map(item => {
            //   return item.probableList[0].tempId
            // })

            // leaveDetectionList = difference(previousDetectionListTempIdArray, currentDetectionListTempIdArray)

            // console.log('detectionItemLogInTimer 00000000', detectionItemLogInTimer)
            // console.log('currentDetectionListTempIdArray', currentDetectionListTempIdArray)
            // console.log('previousDetectionListTempIdArray', previousDetectionListTempIdArray)
            // if (leaveDetectionList.length > 0) {
            //   detectionItemLogInTimer = omit(detectionItemLogInTimer, leaveDetectionList)
            //   console.warn('omitttttttttt')
            //   console.log('omit detectionItemLogInTimer 22222222', detectionItemLogInTimer)
            // }
            // console.warn('detectionList.length', detectionList.length)

            // console.log('detectionItemLogInTimer 111111', detectionItemLogInTimer)
            // console.log('leaveDetectionList', leaveDetectionList)

            const person = getPersonByType(detectionItem.type, detectionItem)
            if (seatedList.find(seatedItem => seatedItem && seatedItem.id === person.id)) {
              return null
            } else if (standingList.find(seatedItem => seatedItem && seatedItem.id === person.id)) {
              return null
            } else if (clockState !== 'manualClock') {
              console.log('detectionItemLogInTimer 99999999999', detectionItemLogInTimer)
              // const detectionItemTempId = get(detectionItem, 'probableList[0].tempId').toString()
              const hasAccount = typeof detectionItemLogInTimer[detectionItemTempId] === 'undefined'
              console.warn('detectionItemTempId hasAccounttttttt', detectionItemTempId, hasAccount)
              if (hasAccount) {
                detectionItemLogInTimer[detectionItemTempId] = new Date().getTime()
              } else {
                const detectionItemExistingTime = new Date().getTime() - detectionItemLogInTimer[detectionItemTempId]
                console.log(detectionItemTempId + 'detectionItem existing time', detectionItemExistingTime)
                switch (clockState) {
                  case 'autoAnonymous':
                    if (detectionItemExistingTime > 8000 && detectionItem.type === 'anonymous') {
                      console.log('autoAnonymous detectionItemLogInTimer', detectionItemLogInTimer)
                      // onItemActionClick(event, detectionItem, detectionItemTempId, true)
                    }
                    break
                  case 'autoMember':
                    if (detectionItemExistingTime > 8000 && detectionItem.type === 'member') {
                      // console.log('autoMember detectionItemLogInTimer', detectionItemLogInTimer)
                      // onItemActionClick(event, detectionItem, detectionItemTempId, true)
                    }
                    break
                  case 'autoClock':
                    if (detectionItemExistingTime > 8000) {
                      // console.log('autoClock detectionItemLogInTimer', detectionItemLogInTimer)
                      // onItemActionClick(event, detectionItem, detectionItemTempId, true)
                    }
                    break
                }
              }
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
