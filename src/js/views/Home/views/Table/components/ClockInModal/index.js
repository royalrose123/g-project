import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { BigNumber } from 'bignumber.js'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Modal from '../../../../../../components/Modal'
import Svg from '../../../../../../components/Svg'

// Lib MISC
import MemberApi from '../../../../../../lib/api/Member'
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'
import useDeepCompareEffect from '../../../../../../lib/effects/useDeepCompareEffect'

// Styles
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../constants/PersonType'
const cx = classnames.bind(styles)
const MODE = {
  CLOCK_IN: 'CLOCK_IN',
  SWIPE_MEMBER_CARD: 'SWIPE_MEMBER_CARD',
}

export const propTypes = {
  detectionItem: PropTypes.shape({
    type: PropTypes.oneOf([PERSON_TYPE.ANONYMOUS, PERSON_TYPE.MEMBER]).isRequired,
    snapshot: PropTypes.string.isRequired,
    probableList: PropTypes.arrayOf(
      PropTypes.shape({
        similarity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  afterClose: PropTypes.func.isRequired,
  onClockIn: PropTypes.func,
  isClockInErrorModalOpened: PropTypes.bool,
  closeClockInErrorModal: PropTypes.func,
  clockErrorMessage: PropTypes.string,
  matchPercent: PropTypes.number,
}

function ClockInModal (props) {
  const {
    detectionItem,
    isOpened,
    onClose,
    afterClose,
    onClockIn,
    isClockInErrorModalOpened,
    closeClockInErrorModal,
    clockErrorMessage,
    matchPercent,
  } = props

  // TODO: 暫時做成一秒後自動帶入密碼
  // === TEMP ===
  const membercardInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMemberCardDetected, setIsMemberCardDetected] = useState(false)
  const [member, setMember] = useState(null)
  // === TEMP ===

  const [mode, setMode] = useState(MODE.CLOCK_IN)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const shouldRenderContent = detectionItem !== null
  const person = shouldRenderContent ? getPersonByType(detectionItem.type, detectionItem, matchPercent) : {}
  // 打開時給預設值
  // 關掉時重設狀態
  useDeepCompareEffect(() => {
    if (shouldRenderContent) {
      setSelectedPerson({
        ...person,
        identify: detectionItem.type === PERSON_TYPE.MEMBER ? person.id : detectionItem.type === PERSON_TYPE.ANONYMOUS && PERSON_TYPE.ANONYMOUS,
        rect: detectionItem.rect,
        cameraId: detectionItem.cameraId,
        type: detectionItem.type,
        cardType: detectionItem.probableList[0].level,
      })
    } else {
      setMode(MODE.CLOCK_IN)
      setSelectedPerson(null)

      // === TEMP ===
      setIsMemberCardDetected(false)
      setMember(null)
      // === TEMP ===
    }
  }, [shouldRenderContent, detectionItem, person])

  // Clock in
  const renderClockInHeader = () => (
    <Modal.Header>
      {detectionItem.type === PERSON_TYPE.MEMBER ? 'Clock-In' : detectionItem.type === PERSON_TYPE.ANONYMOUS && 'Anonymous Clock-In'}
    </Modal.Header>
  )

  const renderClockInBody = () => {
    let content = null

    switch (true) {
      case detectionItem.type === PERSON_TYPE.MEMBER:
        content = (
          <Person
            type={detectionItem.type}
            mode='compare'
            title='id'
            person={person}
            renderFooter={() => <div className={cx('home-table-clock-in-modal__similarity')}>{person.similarity}</div>}
          />
        )
        break

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && person.isProbablyMember:
        content = (
          <div className={cx('home-table-clock-in-modal__content')}>
            <Person
              type={detectionItem.type}
              person={person}
              isSelected={selectedPerson && selectedPerson.identify === PERSON_TYPE.ANONYMOUS}
              onClick={event => setSelectedPerson({ ...person, identify: PERSON_TYPE.ANONYMOUS, type: PERSON_TYPE.ANONYMOUS })} // anonymous identify 給 anonymous
            />
            <div className={cx('home-table-clock-in-modal__probable-list-wrapper')}>
              <h4 className={cx('home-table-clock-in-modal__probable-list-title')}>Probable Matches</h4>
              <div className={cx('home-table-clock-in-modal__probable-list')}>
                {detectionItem.probableList
                  // 濾掉自己
                  .filter(probableItem => probableItem.id)
                  // 濾出相似度高於 80% 的結果
                  .filter(probableItem => new BigNumber(probableItem.similarity).isGreaterThanOrEqualTo(matchPercent)) // show 出 probableList 中 similarity 大於 matchPercent 的 item
                  .map((probableItem, index) => (
                    // Auto anonymous clock in 時需自動setSelectedPerson
                    <div key={index} className={cx('home-table-clock-in-modal__probable-item')}>
                      <Person
                        type={PERSON_TYPE.MEMBER}
                        title='id'
                        person={probableItem}
                        isSelected={selectedPerson && selectedPerson.identify === probableItem.id}
                        onClick={event => {
                          setSelectedPerson({
                            ...probableItem,
                            identify: probableItem.id, // member identify 給 id
                            type: PERSON_TYPE.MEMBER,
                            compareImage: probableItem.image,
                            cardType: probableItem.level,
                          })
                        }}
                        renderFooter={() => <div className={cx('home-table-clock-in-modal__similarity')}>{probableItem.similarity}</div>}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )
        break

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && !person.isProbablyMember:
        content = <Person type={detectionItem.type} person={person} />
        break
    }

    return <Modal.Body>{content}</Modal.Body>
  }

  const renderClockInFooter = () => (
    <Modal.Footer>
      <Button
        className={cx('home-table-clock-in-modal__action')}
        type='button'
        isFilled={false}
        disabled // 目前沒有 swipe member card 功能
        onClick={event => {
          setMode(MODE.SWIPE_MEMBER_CARD)

          // TODO: 暫時做成一秒後自動帶入密碼，兩秒後自動顯示 Loading 畫面，三秒後顯示偵測到使用者的畫面
          // === TEMP ===
          setTimeout(() => {
            membercardInputRef.current.value = '9586100080004188=21041018939996'
          }, 1000)

          setTimeout(async () => {
            const memberCard = membercardInputRef.current.value

            setIsLoading(true)

            const memberCardDetectedMember = await MemberApi.fetchMemberDetailByMemberCard({ memberCard })

            setIsLoading(false)
            setMember({ ...memberCardDetectedMember, memberCard, identify: PERSON_TYPE.MEMBER_CARD })
            setIsMemberCardDetected(true)
          }, 2000)

          // === TEMP ===
        }}
      >
        Swipe Membercard
      </Button>
      <Button className={cx('home-table-clock-in-modal__action')} type='button' onClick={event => onClockIn(event, selectedPerson)}>
        Confirm Clock-In
      </Button>
    </Modal.Footer>
  )

  // Swipe member card
  const renderSwipeMemberCardHeader = () => <Modal.Header>Swipe Membercard</Modal.Header>

  const renderSwipeMemberCardDetectedHeader = () => <Modal.Header>Member Detected</Modal.Header>

  const renderSwipeMemberCardBody = () => (
    <Modal.Body>
      <div className={cx('home-table-clock-in-modal__member-card-wrapper')}>
        <input className={cx('home-table-clock-in-modal__member-card-input')} type='password' ref={membercardInputRef} />
        <Svg
          className={cx('home-table-clock-in-modal__member-card-image')}
          data='M76.647,37.758 L95.357,56.248 L96.414,57.294 L96.414,8.274 C96.4128959,5.30387957 94.0051206,2.89655186 91.035,2.896 L8.275,2.896 C5.30448904,2.89655209 2.89655209,5.30448904 2.896,8.275 L2.896,53.793 C2.89655209,56.763511 5.30448904,59.1714479 8.275,59.172 L72.849,59.172 L64.054,50.192 C63.2994923,49.3624595 62.678726,48.4205141 62.214,47.4 C61.8942867,47.5363419 61.5274852,47.5031057 61.237486,47.311517 C60.9474868,47.1199284 60.773015,46.7955712 60.773,46.448 L60.773,45.866 C60.773,45.403 61.076,45.011 61.495,44.879 C61.16,42.301 62.018,39.759 63.822,37.758 L62.1,37.758 C61.3676704,37.758 60.774,37.1643296 60.774,36.432 C60.774,35.6996704 61.3676704,35.106 62.1,35.106 L67.728,35.106 C67.777,35.106 67.825,35.108 67.873,35.113 C69.3657221,34.6532641 70.9618805,34.6508262 72.456,35.106 L89.464,35.106 C90.1963296,35.106 90.79,35.6996704 90.79,36.432 C90.79,37.1643296 90.1963296,37.758 89.464,37.758 L76.647,37.758 Z M8.277,0 L91.035,0 C95.6029674,0.00716099981 99.3039429,3.70903097 99.31,8.277 L99.31,20.705 L112.678,34.097 C117.350224,38.7705913 119.982628,45.1035335 120,51.712 L120,120 L82.76,120 L82.76,99.606 L82.736,99.435 L82.673,99.215 L82.603,99.057 L81.257,96.904 C76.6228597,89.4976675 75.7342271,80.3454918 78.857,72.186 L80.437,68.595 L80.577,68.278 L80.994,67.328 L75.846,61.961 L7.207,61.961 C3.188,61.541 0.013,57.983 0,53.787 L0,8.275 C0.00661286321,3.70641463 3.70941254,0.00495687828 8.278,-9.20041821e-16 L8.277,0 Z M85.657,117.104 L117.104,117.104 L117.104,100.336 L85.656,100.336 L85.656,117.104 L85.657,117.104 Z M99.396,60.291 L110.114,70.967 L108.184,72.97 L107.608,72.393 L74.64,39.433 C72.2993881,37.1321543 68.5541972,37.1072935 66.1832466,39.3768636 C63.812296,41.6464338 63.6735704,45.3891371 65.87,47.828 L82.825,66.326 C83.6771962,67.2546873 83.8308563,68.627924 83.205,69.722 C78.6348813,77.7112238 78.8297069,87.5666352 83.712,95.369 L84.792,97.15 L84.974,97.45 L117.104,97.45 L117.104,51.71 C117.0887,45.8765575 114.765558,40.2862036 110.642,36.16 L100.454,26.056 L99.396,25.006 L99.396,60.291 Z M62.099,15.655 L89.463,15.655 C90.1956057,15.655 90.7895,16.2488943 90.7895,16.9815 C90.7895,17.7141057 90.1956057,18.308 89.463,18.308 L62.099,18.308 C61.3663943,18.308 60.7725,17.7141057 60.7725,16.9815 C60.7725,16.2488943 61.3663943,15.655 62.099,15.655 Z M62.099,25.38 L89.463,25.38 C90.1956057,25.38 90.7895,25.9738943 90.7895,26.7065 C90.7895,27.4391057 90.1956057,28.033 89.463,28.033 L62.099,28.033 C61.3663943,28.033 60.7725,27.4391057 60.7725,26.7065 C60.7725,25.9738943 61.3663943,25.38 62.099,25.38 Z M11.977,10.35 L49.239,10.35 C49.9438536,10.3486728 50.6203508,10.6274709 51.1196017,11.1250339 C51.6188525,11.6225968 51.8999401,12.298146 51.901,13.003 L51.901,50.135 C51.8999401,50.839854 51.6188525,51.5154032 51.1196017,52.0129661 C50.6203508,52.5105291 49.9438536,52.7893272 49.239,52.788 L11.977,52.788 C11.2721464,52.7893272 10.5956492,52.5105291 10.0963983,52.0129661 C9.59714748,51.5154032 9.31605988,50.839854 9.315,50.135 L9.315,13.003 C9.31632484,12.2983194 9.59752933,11.6230271 10.0967514,11.1256804 C10.5959736,10.6283336 11.2723194,10.3496727 11.977,10.351 L11.977,10.35 Z M11.977,13.003 L11.977,50.135 L49.239,50.135 L49.239,13.003 L11.977,13.003 Z M37.262,24.938 C37.262,28.696 34.379,31.569 30.608,31.569 C26.838,31.569 23.954,28.696 23.954,24.939 C23.954,21.181 26.837,18.308 30.608,18.308 C34.378,18.308 37.262,21.181 37.262,24.938 Z M17.3,42.62 C17.3,38.2 26.172,35.769 30.608,35.769 C35.044,35.769 43.916,38.199 43.916,42.62 L43.916,44.83 L17.3,44.83 L17.3,42.62 Z'
          size={120}
        />
        <div className={cx('home-table-clock-in-modal__member-card-hint')}>Please Swipe Membercard</div>
      </div>
    </Modal.Body>
  )

  const renderSwipeMemberCardLoadingBody = () => (
    <Modal.Body>
      <div className={cx('home-table-clock-in-modal__member-card-wrapper')}>
        <Svg
          className={cx('home-table-clock-in-modal__member-card-image')}
          data='M8,0 L112,0 C116.418278,0 120,3.581722 120,8 L120,72 C120,76.418278 116.418278,80 112,80 L8,80 C3.581722,80 5.41083001e-16,76.418278 0,72 L0,8 C-5.41083001e-16,3.581722 3.581722,0 8,0 Z M8,3 C5.23857625,3 3,5.23857625 3,8 L3,72 C3,74.7614237 5.23857625,77 8,77 L112,77 C113.326082,77 114.597852,76.4732158 115.535534,75.5355339 C116.473216,74.597852 117,73.3260824 117,72 L117,8 C117,5.23857625 114.761424,3 112,3 L8,3 Z M70.5,22 L107.5,22 C108.328427,22 109,22.6715729 109,23.5 C109,24.3284271 108.328427,25 107.5,25 L70.5,25 C69.6715729,25 69,24.3284271 69,23.5 C69,22.6715729 69.6715729,22 70.5,22 L70.5,22 Z M70.5,33 L107.5,33 C108.328427,33 109,33.6715729 109,34.5 C109,35.3284271 108.328427,36 107.5,36 L70.5,36 C69.6715729,36 69,35.3284271 69,34.5 C69,33.6715729 69.6715729,33 70.5,33 L70.5,33 Z M70.5,44 L107.5,44 C108.328427,44 109,44.6715729 109,45.5 C109,46.3284271 108.328427,47 107.5,47 L70.5,47 C69.6715729,47 69,46.3284271 69,45.5 C69,44.6715729 69.6715729,44 70.5,44 L70.5,44 Z M70.5,55 L91.5,55 C92.3284271,55 93,55.6715729 93,56.5 C93,57.3284271 92.3284271,58 91.5,58 L70.5,58 C69.6715729,58 69,57.3284271 69,56.5 C69,55.6715729 69.6715729,55 70.5,55 Z M14,16 L56,16 C57.6568542,16 59,17.3431458 59,19 L59,61 C59,62.6568542 57.6568542,64 56,64 L14,64 C12.3431458,64 11,62.6568542 11,61 L11,19 C11,17.3431458 12.3431458,16 14,16 Z M14,19 L14,61 L56,61 L56,19 L14,19 Z M42.5,32.5 C42.5,36.75 39.25,40 35,40 C30.75,40 27.5,36.75 27.5,32.5 C27.5,28.25 30.75,25 35,25 C39.25,25 42.5,28.25 42.5,32.5 Z M20,52.5 C20,47.5 30,44.75 35,44.75 C40,44.75 50,47.5 50,52.5 L50,55 L20,55 L20,52.5 Z'
          size={120}
        />
        <div className={cx('home-table-clock-in-modal__member-card-hint')}>Looking Up Member</div>
      </div>
    </Modal.Body>
  )

  const renderSwipeMemberCardDetectedBody = () => {
    return (
      <Modal.Body>
        <div className={cx('home-table-clock-in-modal__member-card-wrapper')}>
          <Person type={PERSON_TYPE.MEMBER} person={member} />
        </div>
      </Modal.Body>
    )
  }

  const renderSwipeMemberCardDetectedFooter = () => (
    <Modal.Footer>
      <Button type='button' onClick={event => onClockIn(event, member)}>
        OK
      </Button>
    </Modal.Footer>
  )

  return (
    <Modal
      className={cx('home-table-clock-in-modal')}
      isOpened={isOpened}
      isBackale={mode === MODE.SWIPE_MEMBER_CARD && !isMemberCardDetected}
      isClosable={!isMemberCardDetected}
      isLoading={isLoading}
      shouldCloseOnOverlayClick={!isMemberCardDetected}
      shouldShowOverlayOnLoading={false}
      onClose={onClose}
      onBack={event => setMode(MODE.CLOCK_IN)}
      afterClose={afterClose}
    >
      <Modal
        className={cx('home-member-detail-error-modal')}
        isClosable={false}
        shouldCloseOnOverlayClick={false}
        isOpened={isClockInErrorModalOpened}
      >
        <Modal.Header>
          <div className={cx('home-member-detail-error-modal__header')}>{'Clock-In Error'}</div>
        </Modal.Header>
        <Modal.Body>
          <div className={cx('home-member-detail-error-modal__body')}>{clockErrorMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' className={cx('home-member-detail-error-modal__action')} size={'md'} onClick={closeClockInErrorModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {(() => {
        if (!shouldRenderContent) return null

        let header = null

        switch (true) {
          case mode === MODE.CLOCK_IN:
            header = renderClockInHeader()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && !isMemberCardDetected:
            header = renderSwipeMemberCardHeader()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && isMemberCardDetected:
            header = renderSwipeMemberCardDetectedHeader()
            break
        }

        return header
      })()}
      {(() => {
        if (!shouldRenderContent) return null

        let body = null

        switch (true) {
          case mode === MODE.CLOCK_IN:
            body = renderClockInBody()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && isLoading && !isMemberCardDetected:
            body = renderSwipeMemberCardLoadingBody()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && !isLoading && !isMemberCardDetected:
            body = renderSwipeMemberCardBody()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && !isLoading && isMemberCardDetected:
            body = renderSwipeMemberCardDetectedBody()
            break
        }

        return body
      })()}
      {(() => {
        if (!shouldRenderContent) return null

        let footer = null

        switch (true) {
          case mode === MODE.CLOCK_IN:
            footer = renderClockInFooter()
            break

          case mode === MODE.SWIPE_MEMBER_CARD && !isLoading && isMemberCardDetected:
            footer = renderSwipeMemberCardDetectedFooter()
            break
        }

        return footer
      })()}
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
