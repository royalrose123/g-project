import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { format, formatDistanceStrict } from 'date-fns'
import { BigNumber } from 'bignumber.js'
import { Formik, Form as FormikForm, Field } from 'formik'
import { trim, find, set } from 'lodash'

// Components
import Person from '../../components/Person'
import Modal from '../../../../../../components/Modal'
import Keyboard, { keys } from '../../../../components/Keyboard'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'

// Modules
import { selectors as seatedSelectors } from '../../../../../../lib/redux/modules/seated'
import { selectors as standingSelectors } from '../../../../../../lib/redux/modules/standing'

// Lib MISC
import MemberApi from '../../../../../../lib/api/Member'
import TableApi from '../../../../../../lib/api/Table'
import useFetcher from '../../../../../../lib/effects/useFetcher'
import findStaticPath from '../../../../../../lib/utils/find-static-path'
import { parsePraListToClockOutField } from '../../../../../../lib/utils/parse-pra-to-list'
import ERROR_MESSAGE from '../../../../../../constants/ErrorMessage'

// Styles
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../constants/PersonType'
const cx = classnames.bind(styles)
const TABS = {
  BETTING_RECORD: 'betting-record',
  CUSTOMER_INFO: 'customer-info',
}

export const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  onClockOut: PropTypes.func,
  tableNumber: PropTypes.string,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  memberPropPlayMother: PropTypes.number,
  isOverride: PropTypes.bool,
  confirmOverride: PropTypes.func,
  isClockOutErrorModalOpened: PropTypes.bool,
  closeClockOutErrorModal: PropTypes.func,
  clockErrorMessage: PropTypes.string,
  removeItemFromList: PropTypes.func,
}

const memberDetailModalText = {
  'Not clocked in': {
    state: ERROR_MESSAGE.NOT_CLOCKED_IN,
    title: 'Member Enquiry Error',
    description: `Not clocked in. Please click "OK", and the player will be removed`,
  },
  others: {
    title: 'Member Enquiry Error',
    description: ``,
  },
}

function MemberDetail (props) {
  const {
    history,
    match,
    onClockOut,
    seatedList,
    standingList,
    memberPropPlayMother,
    tableNumber,
    isOverride,
    confirmOverride,
    isClockOutErrorModalOpened,
    closeClockOutErrorModal,
    clockErrorMessage,
    removeItemFromList,
  } = props
  const { path, params } = match
  const { memberId: id, type, cardType, seatNumber } = params

  const [currentTab, setCurrentTab] = useState(TABS.BETTING_RECORD)
  const [lastFocusField, setLastFocusField] = useState('actualWin')
  const [memberImage, setMemberImage] = useState('')
  const [isEnquiryErrorModalOpened, setIEnquiryErrorModalOpened] = useState(false)
  const [memberEnquiryErrorMessage, setMemberEnquiryErrorMessage] = useState({})

  const openEnquiryErrorModal = () => setIEnquiryErrorModalOpened(true)
  const closeEnquiryErrorModal = () => {
    setIEnquiryErrorModalOpened(false)
    history.push(findStaticPath(path))
  }

  const { isLoaded, error, response: detail } = useFetcher(null, MemberApi.fetchMemberDetailByIdWithType, {
    id,
    type,
    cardType,
    tableNumber,
    seatNumber,
  })

  const initialValues = {
    playTypeNumber: detail?.playTypeNumber,
    propPlay: '',
    averageBet: '',
    overallWinner: 'player',
    actualWin: '',
    drop: '',
    overage: '',
    tableName: '',
  }

  const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playTypeNumber' && key !== 'overallWinner')

  useEffect(() => {
    if (isLoaded) {
      // 如果 POUT enquiry 的 pra 有值 ，就先將對應的 pra field 填入值
      if (detail.praValue) {
        parsePraListToClockOutField(detail.praValue).forEach(item => {
          if (!detail[item]) detail[item] = 0
          set(initialValues, item, detail[item])
        })
      }

      const standingItemImage = find(standingList, { id: detail.id })
      const seatedItemImage = find(seatedList, { id: detail.id })

      if (standingItemImage) {
        setMemberImage(standingItemImage.image)
      } else if (seatedItemImage) {
        setMemberImage(seatedItemImage.image)
      }
    }
  }, [detail, initialValues, isLoaded, seatedList, standingList])

  if (isLoaded) detail.image = memberImage

  // 處理 POUT enquiry error
  useEffect(() => {
    if (error) {
      let errorMessage = error.response.data.data
      if (errorMessage) {
        // 如果 error message 是由 msg 組成，回傳 msg 後的字串
        errorMessage = trim(errorMessage.split('msg')[1], '}:"')

        if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
          // Not Log-On 時自動 Log-On
          TableApi.logOnTable({ tableNumber })
          window.location.reload(false)
        } else if (errorMessage === ERROR_MESSAGE.NOT_CLOCKED_IN) {
          // Not Clocked-in 時，pop-up 後從 seated / standing 移除
          setMemberEnquiryErrorMessage(memberDetailModalText[ERROR_MESSAGE.NOT_CLOCKED_IN])
          openEnquiryErrorModal()
        } else if (errorMessage) {
          // 其他 error pop-up 後從 seated / standing 移除
          set(memberDetailModalText, 'others.description', errorMessage)
          setMemberEnquiryErrorMessage(memberDetailModalText['others'])
          openEnquiryErrorModal()
        }
      } else {
        // 如果 error message 不是由 msg 組成，直接回傳整個 error message
        set(memberDetailModalText, 'others.description', errorMessage)
        setMemberEnquiryErrorMessage(memberDetailModalText['others'])
        openEnquiryErrorModal()
      }
    }
  }, [detail, error, isEnquiryErrorModalOpened, match, tableNumber])

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)

  const getValidationSchema = () => {
    return Yup.object().shape({
      propPlay: Yup.number(),
      averageBet: Yup.number(),
      actualWin: Yup.number(),
      drop: Yup.number(),
      overage: Yup.number(),
    })
  }

  const renderEnquiryErrorModal = () =>
    isEnquiryErrorModalOpened && (
      <>
        <Modal
          className={cx('home-member-detail-error-modal')}
          isClosable={false}
          shouldCloseOnOverlayClick={false}
          isOpened={isEnquiryErrorModalOpened}
        >
          <Modal.Header>
            <div className={cx('home-member-detail-error-modal__header')}>{memberEnquiryErrorMessage.title}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-member-detail-error-modal__body')}>{memberEnquiryErrorMessage.description}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='button'
              className={cx('home-member-detail-error-modal__action')}
              size={'md'}
              onClick={memberEnquiryErrorMessage.state === ERROR_MESSAGE.NOT_CLOCKED_IN ? removeItemFromList : closeEnquiryErrorModal}
              isInvisible={isOverride}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )

  return (
    <>
      {isLoaded ? (
        <Formik initialValues={initialValues} isInitialValid onSubmit={onClockOut} enableReinitialize validationSchema={getValidationSchema}>
          {({ values, setFieldValue }) => {
            return (
              <FormikForm>
                <Layout className={cx('home-table-member-detail')}>
                  <Keyboard
                    onPress={key => {
                      if (key === keys.ENTER) {
                        const nextFieldIndex = inputableKeys.indexOf(lastFocusField) + 1
                        let nextIndex = nextFieldIndex > inputableKeys.length - 1 ? 0 : nextFieldIndex
                        // const nextField = inputableKeys[nextIndex]
                        // nextIndex = nextIndex + (detail.level !== CARD_TYPE.VIP && nextField === 'propPlay' ? 1 : 0)
                        nextIndex++

                        setLastFocusField(inputableKeys[nextIndex])
                        return
                      }

                      const oldValue = values[lastFocusField]
                      let newValue = ''

                      if (key === keys.DEL) {
                        newValue = oldValue.slice(0, -1)
                      } else {
                        newValue = `${oldValue}${key}`
                      }

                      setFieldValue(lastFocusField, newValue)
                    }}
                  />
                  <Modal
                    className={cx('home-member-detail-error-modal')}
                    isClosable={false}
                    shouldCloseOnOverlayClick={false}
                    isOpened={isClockOutErrorModalOpened}
                  >
                    <Modal.Header>
                      <div className={cx('home-member-detail-error-modal__header')}>{'Clock-Out Error'}</div>
                    </Modal.Header>
                    <Modal.Body>
                      <div className={cx('home-member-detail-error-modal__body')}>{clockErrorMessage}</div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type='button'
                        className={cx('home-member-detail-error-modal__action')}
                        size={'md'}
                        onClick={closeClockOutErrorModal}
                        isInvisible={isOverride}
                      >
                        OK
                      </Button>
                      <Button
                        type='button'
                        className={cx('home-member-detail-error-modal__action')}
                        size={'md'}
                        onClick={closeClockOutErrorModal}
                        isFilled={false}
                        isInvisible={!isOverride}
                      >
                        CANCEL
                      </Button>
                      <Button
                        type='button'
                        className={cx('home-member-detail-error-modal__action')}
                        size={'md'}
                        onClick={confirmOverride}
                        isInvisible={!isOverride}
                      >
                        CONFIRM
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Layout.Header>
                    <div className={cx('home-table-member-detail__title-wrapper')}>
                      <Icon
                        className={cx('home-table-member-detail__icon')}
                        name='cross'
                        mode='01'
                        onClick={event => history.push(findStaticPath(path))}
                      />
                      <h1 className={cx('home-table-member-detail__title')} style={{ color: '#fff' }}>
                        Clock-out / Details
                      </h1>
                    </div>
                    <Button type='submit'>Clock-Out</Button>
                  </Layout.Header>

                  <Layout.Content className={cx('home-table-member-detail__content')} style={{ color: '#fff' }}>
                    <div className={cx('home-table-member-detail__avatar')}>
                      <Person type={PERSON_TYPE.MEMBER} title='id' person={detail} />
                    </div>

                    <div className={cx('home-table-member-detail__tabs')}>
                      <div className={cx('home-table-member-detail__tabs-list')}>
                        <button
                          className={cx('home-table-member-detail__tabs-item')}
                          type='button'
                          data-for={TABS.BETTING_RECORD}
                          data-is-active={currentTab === TABS.BETTING_RECORD}
                          onClick={onTabItemClick}
                        >
                          BETTING RECORD
                        </button>
                        <button
                          className={cx('home-table-member-detail__tabs-item')}
                          type='button'
                          data-for={TABS.CUSTOMER_INFO}
                          data-is-active={currentTab === TABS.CUSTOMER_INFO}
                          onClick={onTabItemClick}
                        >
                          CUSTOMER INFO
                        </button>
                      </div>

                      <div className={cx('home-table-member-detail__tabs-panel-list')}>
                        <div
                          id={TABS.BETTING_RECORD}
                          data-is-active={currentTab === TABS.BETTING_RECORD}
                          className={cx('home-table-member-detail__tabs-panel-item')}
                        >
                          <Form.Group width={300}>
                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Play Type</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='playTypeNumber'
                                  render={({ field }) => (
                                    <Form.Select onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)} {...field}>
                                      {detail.playTypeList.map((item, index) => (
                                        <option key={index} value={item.ptn}>
                                          {item.ptc}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>

                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Prop Play</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Form.Row style={{ margin: 0 }}>
                                  <Field
                                    name='propPlay'
                                    render={({ field }) => (
                                      <Form.Input
                                        name={field.name}
                                        isFocused={lastFocusField === field.name}
                                        onFocus={event => setLastFocusField(field.name)}
                                        {...field}
                                      />
                                    )}
                                  />
                                  <div className={cx('home-table-member-detail__all-games')}>/ {memberPropPlayMother}</div>
                                </Form.Row>
                                <div className={cx('home-table-member-detail__percentage')}>
                                  {values.propPlay.length > 0 &&
                                    Math.floor(new BigNumber(values.propPlay).dividedBy(memberPropPlayMother).multipliedBy(100))}
                                  %
                                </div>
                              </Form.Column>
                            </Form.Row>

                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Average Bet</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='averageBet'
                                  render={({ field }) => (
                                    <Form.Input
                                      name={field.name}
                                      isFocused={lastFocusField === field.name}
                                      onFocus={event => setLastFocusField(field.name)}
                                      {...field}
                                    />
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>

                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Overall Winner</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='overallWinner'
                                  render={({ field }) => (
                                    <Form.Radio.Group name={field.name}>
                                      <Form.Radio
                                        value='player'
                                        onClick={event => setFieldValue(field.name, event.target.value)}
                                        checked={values.overallWinner === 'player'}
                                        readOnly
                                      >
                                        Player
                                      </Form.Radio>
                                      <Form.Radio
                                        value='dealer'
                                        onClick={event => setFieldValue(field.name, event.target.value)}
                                        checked={values.overallWinner === 'dealer'}
                                        readOnly
                                      >
                                        Dealer
                                      </Form.Radio>
                                    </Form.Radio.Group>
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>
                          </Form.Group>

                          <Form.Group width={300}>
                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Actual Win</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='actualWin'
                                  render={({ field }) => (
                                    <Form.Input
                                      name={field.name}
                                      isFocused={lastFocusField === field.name}
                                      onFocus={event => setLastFocusField(field.name)}
                                      {...field}
                                    />
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>

                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Drop</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='drop'
                                  render={({ field }) => (
                                    <Form.Input
                                      name={field.name}
                                      isFocused={lastFocusField === field.name}
                                      onFocus={event => setLastFocusField(field.name)}
                                      {...field}
                                    />
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>

                            <Form.Row>
                              <Form.Column size='sm'>
                                <Form.Label>Overage</Form.Label>
                              </Form.Column>
                              <Form.Column size='md'>
                                <Field
                                  name='overage'
                                  render={({ field }) => (
                                    <Form.Input
                                      name={field.name}
                                      isFocused={lastFocusField === field.name}
                                      onFocus={event => setLastFocusField(field.name)}
                                      {...field}
                                    />
                                  )}
                                />
                              </Form.Column>
                            </Form.Row>
                          </Form.Group>
                        </div>

                        <div
                          id={TABS.CUSTOMER_INFO}
                          data-is-active={currentTab === TABS.CUSTOMER_INFO}
                          className={cx('home-table-member-detail__tabs-panel-item')}
                        >
                          <Form.Group width={300}>
                            <Form.Row>
                              <Form.Label>Customer ID</Form.Label>
                              <Form.Display>{detail.id}</Form.Display>
                            </Form.Row>

                            <Form.Row>
                              <Form.Label>Customer Name</Form.Label>
                              <Form.Display>{detail.name}</Form.Display>
                            </Form.Row>

                            <Form.Row>
                              <Form.Label>Gender</Form.Label>
                              <Form.Display>{detail.gender}</Form.Display>
                            </Form.Row>
                          </Form.Group>

                          <Form.Group width={300}>
                            <Form.Row>
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Display>{format(new Date(detail.birthday), 'yyyy/MM/dd')}</Form.Display>
                            </Form.Row>

                            <Form.Row>
                              <Form.Label>Age</Form.Label>
                              <Form.Display>
                                {formatDistanceStrict(new Date(detail.birthday), new Date(), { roundingMethod: 'floor', unit: 'year' }).replace(
                                  /\D/gi,
                                  ''
                                )}
                              </Form.Display>
                            </Form.Row>

                            <Form.Row>
                              <Form.Label>Document Number</Form.Label>
                              <Form.Display>{detail.documentNumber}</Form.Display>
                            </Form.Row>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </Layout.Content>
                </Layout>
              </FormikForm>
            )
          }}
        </Formik>
      ) : (
        renderEnquiryErrorModal()
      )}
    </>
  )
}

MemberDetail.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberDetail)
