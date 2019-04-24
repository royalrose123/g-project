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
const defaultSeatList = new Array(seated.count).fill().map((empty, index) => ({ isSeated: false, content: index + 1 }))
const standing = { row: 3, column: 6, placeSize: '102px', placeMargin: '25px' }

// const detectionList = [
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'Mark Elliot Zuckerberg',
//         similarity: 90.5,
//         serialNumber: 1234567,
//         rank: 'green',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//       {
//         name: 'Mark Elliot Zuckerberg 12',
//         similarity: 88,
//         serialNumber: 1234567,
//         rank: 'green',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'aaa',
//         similarity: 72,
//         serialNumber: 7654321,
//         rank: 'green',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//       {
//         name: 'bbb',
//         similarity: 60,
//         serialNumber: 7654321,
//         rank: 'green',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'Slavcho Karbashewski',
//         similarity: 95,
//         serialNumber: 1234567,
//         rank: 'gold',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'ccc',
//         similarity: 77,
//         serialNumber: 7654321,
//         rank: 'green',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'Wan Gengxin 12',
//         similarity: 91,
//         serialNumber: 1234567,
//         rank: 'platunum',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//       {
//         name: 'Wan Gengxin',
//         similarity: 92.5,
//         serialNumber: 1234567,
//         rank: 'platunum',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
//   {
//     detectedPhoto: 'https://fakeimg.pl/280x360',
//     probable: [
//       {
//         name: 'Amelia Edwards',
//         similarity: 94,
//         serialNumber: 1234567,
//         rank: 'silver',
//         avatar: 'https://fakeimg.pl/280x360',
//       },
//     ],
//   },
// ]

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
  const [currentPerson, setCurrentPerson] = useState(null)

  // private methods
  const initializeSelectedSeatIndex = () => setSelectedSeatIndex(null)
  const openClockInModal = () => setIsClockInModalOpened(true)
  const closeClockInModal = () => setIsClockInModalOpened(false)
  const initializeCurrentPerson = () => setCurrentPerson(null)

  // 設定初始值
  useEffect(() => {
    document.documentElement.style.setProperty('--seated-seat-size', seated.seatSize)

    document.documentElement.style.setProperty('--standing-row', standing.row)
    document.documentElement.style.setProperty('--standing-column', standing.column)
    document.documentElement.style.setProperty('--standing-place-size', standing.placeSize)
    document.documentElement.style.setProperty('--standing-place-margin', standing.placeMargin)
  }, [])

  // Seat
  const onSeatSelect = (event, index, seat) => {
    const { isSeated } = seat

    // 如果座位已經有人，打開 detail
    if (isSeated) {
      setCurrentMember(seat)
      // TODO: 改成 member id
      history.push(`${match.url}/${seat.probableList[0].id}`)
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
  const isDetectionItemActionDisabled = selectedSeatIndex !== null
  const onDetectionItemActionClick = (event, person) => {
    openClockInModal()
    setCurrentPerson(person)
  }

  // ClockInModal
  const onClockInModalClose = event => {
    closeClockInModal()
    initializeCurrentPerson()
  }
  const onClockIn = event => {
    setSeatList(seatList.map((seatItem, index) => (index === selectedSeatIndex ? { ...currentPerson, isSeated: true } : seatItem)))
    closeClockInModal()
    initializeCurrentPerson()
  }

  return isDetailVisible ? (
    <MemberDetail member={currentMember} {...props} />
  ) : (
    <div className={cx('home-table')}>
      <div className={cx('home-table__row')}>
        <div className={cx('home-table__column')}>
          <Seated seatList={seatList} selectedIndex={selectedSeatIndex} onSeatSelect={onSeatSelect} />
          <h2 className={cx('home-table__title')}>Seated</h2>
        </div>
        <div className={cx('home-table__column')}>
          <Standing row={standing.row} column={standing.column} />
          <h2 className={cx('home-table__title')}>Standing</h2>
        </div>
      </div>
      <div className={cx('home-table__row')}>
        <Detection isActionDisabled={isDetectionItemActionDisabled} onActionClick={onDetectionItemActionClick} />
      </div>
      <ClockInModal person={currentPerson} isOpened={isClockInModalOpened} onClose={onClockInModalClose} onClockIn={onClockIn} />
    </div>
  )
}

Table.propTypes = propTypes

export default Table
