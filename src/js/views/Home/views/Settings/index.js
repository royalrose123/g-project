import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { Formik, Form as FormikForm, Field, getIn } from 'formik'
import { BigNumber } from 'bignumber.js'
import { map, concat, compact, findKey } from 'lodash'
import CARD_TYPE from '../../../../constants/CardType'

// Components
import Modal from '../../../../components/Modal'
import Button from '../../../../components/Button'
import Form from '../../components/Form'
import Keyboard, { keys } from '../../components/Keyboard'

// Modules
import { operations as seatedOperations, selectors as seatedSelectors } from '../../../../lib/redux/modules/seated'
import { operations as standingOperations, selectors as standingSelectors } from '../../../../lib/redux/modules/standing'
import { operations as tableOperations, selectors as tableSelectors } from '../../../../lib/redux/modules/table'

// Lib MISC
import SettingsApi from '../../../../lib/api/Setting'
import GameApi from '../../../../lib/api/Game'
import useFetcher from '../../../../lib/effects/useFetcher'
import { setSessionStorageItem, removeSessionStorageItem, clearSessionStorageItem } from '../../../../lib/helpers/sessionStorage'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const TABS = {
  SYSTEM_SETTINGS: 'system-settings',
  AUTOMATIC_SETTINGS: 'automatic-settings',
  DEFAULT_RECORD: 'default-record',
}

export const propTypes = {
  tableNumber: PropTypes.string,
  clockState: PropTypes.string,
  changeTableNumber: PropTypes.func,
  changeClockState: PropTypes.func,
  changeAutoSettings: PropTypes.func,
  changeDefaultRecord: PropTypes.func,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  removeAllFromSeated: PropTypes.func,
  removeAllFromStanding: PropTypes.func,
}

export const checkClockState = (memberClock, anonymousClock) => {
  switch (true) {
    case memberClock === false && anonymousClock === false:
      return 'manualClock'
    case memberClock === false && anonymousClock === true:
      return 'autoAnonymous'
    case memberClock === true && anonymousClock === false:
      return 'autoMember'
    case memberClock === true && anonymousClock === true:
      return 'autoClock'
  }
}

const setTableListActiveStatus = (setTableList, tableList, selectedTableName, tableNumber) => {
  setTableList(
    tableList.map(tableItem => {
      if (tableItem.tableName === 'Please select table') {
        return tableItem
      } else if (tableItem.tableName === selectedTableName) {
        return { ...tableItem, disabled: true }
      } else if (tableItem.tableName === tableNumber) {
        return { ...tableItem, disabled: false }
      } else {
        return tableItem
      }
    })
  )
  if (selectedTableName !== 'Please select table') SettingsApi.activeTable({ selectedTableName })
  SettingsApi.deactiveTable({ tableNumber })
}

const confirmModalText = {
  manualClock: {
    title: 'Manually Clock-In/Out Member and Anonymous',
    description: `Once your press "CONFIRM", the system will clear the "TABLE" and manually clock-in/out member and anonymous`,
  },
  autoAnonymous: {
    title: 'Automatic Clock-In/Out Anonymous',
    description: `Once your press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out anonymous`,
  },
  autoMember: {
    title: 'Automatic Clock-In/Out Member',
    description: `Once your press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out member`,
  },
  autoClock: {
    title: 'Automatic Clock-In/Out Member and Anonymous',
    description: `Once your press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out member and anonymous`,
  },
}

function Settings (props) {
  const {
    tableNumber,
    changeClockState,
    changeTableNumber,
    changeAutoSettings,
    changeDefaultRecord,
    seatedList,
    standingList,
    removeAllFromSeated,
    removeAllFromStanding,
  } = props

  const { isLoaded, response: detail } = useFetcher(null, SettingsApi.fetchSettingDetail, { tableNumber })
  const { response: tableListTemp } = useFetcher(null, SettingsApi.getTableList, {})
  // const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playType' && key !== 'overallWinner')
  const [currentTab, setCurrentTab] = useState(TABS.SYSTEM_SETTINGS)
  const [lastFocusField, setLastFocusField] = useState('actualWin')
  const [memberAutomatic, setMemberAutomatic] = useState(false)
  const [anonymousAutomatic, setAnonymousAutomatic] = useState(false)
  const [previousClockState, setPreviousClockState] = useState('')
  const [tableList, setTableList] = useState([])
  const [confirmModalTextPack, setConfirmModalTextPack] = useState({})
  const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)
  const openConfirmModal = () => setIsConfirmModalOpened(true)
  const closeConfirmModal = () => setIsConfirmModalOpened(false)
  const saveConfirmModal = async formikValues => {
    setPreviousClockState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))

    changeClockState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))
    changeAutoSettings(formikValues.autoSettings)
    changeDefaultRecord(formikValues.defaultRecord)

    setSessionStorageItem('clockState', checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))
    setSessionStorageItem('autoSettings', formikValues.autoSettings)
    setSessionStorageItem('defaultRecord', formikValues.defaultRecord)

    await SettingsApi.postSettingDetail({
      systemSettings: formikValues.systemSettings,
      autoSettings: formikValues.autoSettings,
      defaultRecord: formikValues.defaultRecord,
    })

    await clearTable()
    await closeConfirmModal()
  }

  const clearTable = async () => {
    const seatedMemberData = map(seatedList, item => {
      let newItem

      if (typeof item === 'object') {
        newItem = {
          cid: item.id,
          level: findKey(CARD_TYPE, cardType => cardType === item.cardType),
          type: item.type,
        }
      }

      return newItem
    })

    const standingMemberData = map(standingList, item => {
      let newItem

      if (typeof item === 'object') {
        newItem = {
          cid: item.id,
          level: findKey(CARD_TYPE, cardType => cardType === item.cardType),
          type: item.type,
        }
      }

      return newItem
    })
    const memberIdList = compact(concat(seatedMemberData, standingMemberData))

    await removeAllFromSeated()
    await removeAllFromStanding()
    await GameApi.clockOutAll({ memberIdList, tableNumber })
    removeSessionStorageItem('seatedList')
    removeSessionStorageItem('standingList')
  }

  const getValidationSchema = () => {
    return Yup.object().shape({
      systemSettings: Yup.object().shape({}),
      autoSettings: Yup.object().shape({
        autoClockInMemberSec: Yup.string()
          .test('must be above 0', 'Duration must be above 0', value => Number(value) > 0)
          .required('Duration must be entered'),
        autoClockOutMemberSec: Yup.string()
          .test('must be above 0', 'Duration must be above 0', value => Number(value) > 0)
          .required('Duration must be entered'),
        autoClockInAnonymousSec: Yup.string()
          .test('must be above 0', 'Duration must be above 0', value => Number(value) > 0)
          .required('Duration must be entered'),
        autoClockOutAnonymousSec: Yup.string()
          .test('must be above 0', 'Duration must be above 0', value => Number(value) > 0)
          .required('Duration must be entered'),
      }),
      defaultRecord: Yup.object().shape({
        memberPropPlay: Yup.string().test(
          'more-than-api',
          'Amounnt cannot be larger than proportion of games',
          value => Number(value) <= detail.defaultRecord.memberPropPlayMother
        ),
        anonymousPropPlay: Yup.string().test(
          'more-than-api',
          'Amounnt cannot be larger than proportion of games',
          value => Number(value) <= detail.defaultRecord.anonymousPropPlayMother
        ),
      }),
    })
  }

  const onOptionChange = async event => {
    const selectedTableName = event.target.value

    setTableListActiveStatus(setTableList, tableList, selectedTableName, tableNumber)
    changeTableNumber(selectedTableName)
    clearSessionStorageItem()
    setSessionStorageItem('tableNumber', selectedTableName)
  }

  useEffect(() => {
    if (tableList.length > 0) {
      setTableList(tableList)
    } else if (tableListTemp) {
      setTableList(
        tableListTemp.tableList.sort(function (a, b) {
          return a.tableName > b.tableName ? 1 : -1
        })
      )
    }

    if (detail) {
      setPreviousClockState(checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
    }
  }, [detail, tableList, changeTableNumber, changeClockState, tableListTemp])

  useEffect(() => {
    if (isLoaded) {
      setSessionStorageItem('clockState', checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
      setSessionStorageItem('autoSettings', detail.autoSettings)
      setSessionStorageItem('defaultRecord', detail.defaultRecord)

      changeTableNumber(detail.systemSettings.tbName)
      changeClockState(checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
      changeAutoSettings(detail.autoSettings)
      changeDefaultRecord(detail.defaultRecord)
    }
  }, [detail, isLoaded, changeTableNumber, changeClockState, changeAutoSettings, changeDefaultRecord])

  return isLoaded ? (
    <div className={cx('home-settings')}>
      <div className={cx('home-settings__tabs')}>
        <div className={cx('home-settings__tabs-list')}>
          <button
            className={cx('home-settings__tabs-item')}
            type='button'
            data-for={TABS.SYSTEM_SETTINGS}
            data-is-active={currentTab === TABS.SYSTEM_SETTINGS}
            onClick={onTabItemClick}
          >
            SYSTEM SETTINGS
          </button>
          <button
            className={cx('home-settings__tabs-item')}
            type='button'
            data-for={TABS.AUTOMATIC_SETTINGS}
            data-is-active={currentTab === TABS.AUTOMATIC_SETTINGS}
            onClick={onTabItemClick}
          >
            AUTOMATIC SETTINGS
          </button>
          <button
            className={cx('home-settings__tabs-item')}
            type='button'
            data-for={TABS.DEFAULT_RECORD}
            data-is-active={currentTab === TABS.DEFAULT_RECORD}
            onClick={onTabItemClick}
          >
            DEFAULT RECORD
          </button>
        </div>

        <div className={cx('home-settings__tabs-panel-list')}>
          <Formik
            initialValues={detail}
            isInitialValid
            enableReinitialize
            validationSchema={getValidationSchema}
            onSubmit={values => {
              const currentMemberClock = values.autoSettings.autoClockMember
              const currentAnonymousClock = values.autoSettings.autoClockAnonymous

              if (previousClockState === checkClockState(currentMemberClock, currentAnonymousClock)) {
                setSessionStorageItem('clockState', checkClockState(currentMemberClock, currentAnonymousClock))
                setSessionStorageItem('autoSettings', values.autoSettings)
                setSessionStorageItem('defaultRecord', values.defaultRecord)

                SettingsApi.postSettingDetail({
                  systemSettings: values.systemSettings,
                  autoSettings: values.autoSettings,
                  defaultRecord: values.defaultRecord,
                })

                setPreviousClockState(checkClockState(currentMemberClock, currentAnonymousClock))
                changeClockState(checkClockState(currentMemberClock, currentAnonymousClock))
                changeAutoSettings(values.autoSettings)
                changeDefaultRecord(values.defaultRecord)
              } else {
                setConfirmModalTextPack(confirmModalText[checkClockState(currentMemberClock, currentAnonymousClock)])
                openConfirmModal()
              }
            }}
          >
            {({ validateForm, submitForm, initialValues, values, setFieldValue }) => {
              return (
                <FormikForm>
                  <Modal
                    className={cx('home-settings-confirm-modal')}
                    isClosable={false}
                    shouldCloseOnOverlayClick={false}
                    isOpened={isConfirmModalOpened}
                  >
                    <Modal.Header>
                      <div className={cx('home-settings-confirm-modal__header')}>{confirmModalTextPack.title}</div>
                    </Modal.Header>
                    <Modal.Body>
                      <div className={cx('home-settings-confirm-modal__body')}>{confirmModalTextPack.description}</div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type='button'
                        className={cx('home-settings-confirm-modal__action')}
                        isFilled={false}
                        size={'md'}
                        onClick={closeConfirmModal}
                      >
                        CANCEL
                      </Button>
                      <Button
                        type='button'
                        className={cx('home-settings-confirm-modal__action')}
                        size={'md'}
                        onClick={() => saveConfirmModal(values)}
                      >
                        CONFIRM
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Keyboard
                    onPress={key => {
                      if (key === keys.ENTER) return
                      //   const nextFieldIndex = inputableKeys.indexOf(lastFocusField) + 1
                      //   let nextIndex = nextFieldIndex > inputableKeys.length - 1 ? 0 : nextFieldIndex
                      //   const nextField = inputableKeys[nextIndex]
                      //   nextIndex = nextIndex + (detail.level !== CARD_TYPE.VIP && nextField === 'propPlay' ? 1 : 0)

                      //   setLastFocusField(inputableKeys[nextIndex])
                      //   return
                      // }

                      const oldValue = getIn(values, lastFocusField)
                      let newValue = ''

                      if (key === keys.DEL) {
                        newValue = oldValue.slice(0, -1)
                      } else {
                        newValue = `${oldValue}${key}`
                      }

                      setFieldValue(lastFocusField, newValue)
                    }}
                  />

                  <div
                    id={TABS.SYSTEM_SETTINGS}
                    data-is-active={currentTab === TABS.SYSTEM_SETTINGS}
                    className={cx('home-settings__tabs-panel-item')}
                  >
                    <Form.Group width={'50%'}>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Table Number</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Select onChange={onOptionChange} value={tableNumber}>
                            {tableList.map((tableItem, index) => (
                              <option value={tableItem.tableName} key={index} disabled={tableItem.disabled}>
                                {tableItem.tableName}
                                {tableItem.tableName === 'Please select table' ? '' : !tableItem.disabled ? '' : '  (Active)'}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Current Log-in Dealer</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.systemSettings.dealerName}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Current Supervisor</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.systemSettings.supervisorName}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Number of Players at Table</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.systemSettings.numOfPlayer}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>IP of Camera 1</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.systemSettings.cip1}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>IP of Camera 2</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.systemSettings.cip2}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Match % to member database</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='matchPercentage'
                            render={({ field }) => (
                              <Form.Select>
                                <option value='90'>{`${90}%`}</option>
                              </Form.Select>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group width={'50%'}>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Clock-In/Out Member into Dynamiq</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='systemSettings.clockInOutMemDynamiq'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                  }}
                                  checked={values.systemSettings.clockInOutMemDynamiq}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Logging for Clock-In/Out Member</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='systemSettings.logMemClock'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                    // setMemberLogging(event.target.checked)
                                  }}
                                  checked={values.systemSettings.logMemClock}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Clock-In/Out Anonymous into Dynamiq</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='systemSettings.clockInOutAnonymousDynamiq'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                  }}
                                  checked={values.systemSettings.clockInOutAnonymousDynamiq}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Logging for Clock-In/Out Anonymous</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='systemSettings.logAnonymousClock'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                  }}
                                  checked={values.systemSettings.logAnonymousClock}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>
                  </div>

                  <div
                    id={TABS.AUTOMATIC_SETTINGS}
                    data-is-active={currentTab === TABS.AUTOMATIC_SETTINGS}
                    className={cx('home-settings__tabs-panel-item')}
                  >
                    <Form.Group width={'50%'}>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Automatic Clock-In/Out Member</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockMember'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                    setMemberAutomatic(event.target.checked)
                                  }}
                                  checked={memberAutomatic || values.autoSettings.autoClockMember}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Time Duration to trigger a Member Clock-In (Sec)</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockInMemberSec'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.autoSettings.autoClockMember}
                                {...field}
                              />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Time Duration to trigger a Member Clock-Out (Sec)</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockOutMemberSec'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.autoSettings.autoClockMember}
                                {...field}
                              />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group width={'50%'}>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Automatic Clock-In/Out Anonymous</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockAnonymous'
                            render={({ field }) => (
                              <Form.Checkbox.Group name={field.name}>
                                <Form.Checkbox
                                  onChange={event => {
                                    setFieldValue(field.name, event.target.checked)
                                    setAnonymousAutomatic(event.target.checked)
                                  }}
                                  checked={anonymousAutomatic || values.autoSettings.autoClockAnonymous}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>

                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Time Duration to trigger an Anonymous Clock-In (Sec)</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockInAnonymousSec'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.autoSettings.autoClockAnonymous}
                                {...field}
                              />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>

                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Time Duration to trigger an Anonymous Clock-Out (Sec)</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='autoSettings.autoClockOutAnonymousSec'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.autoSettings.autoClockAnonymous}
                                {...field}
                              />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>
                  </div>

                  <div id={TABS.DEFAULT_RECORD} data-is-active={currentTab === TABS.DEFAULT_RECORD} className={cx('home-settings__tabs-panel-item')}>
                    <Form.Group width={'40%'}>
                      <Form.GroupName>MEMBER</Form.GroupName>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Play Type</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberPlayType'
                            render={({ field }) => (
                              <Form.Select
                                value={values.defaultRecord.memberPlayType}
                                onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                              </Form.Select>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row align='top'>
                        <Form.Column size='md'>
                          <Form.Label>Prop Play</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberPropPlay'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                data-is-short
                                {...field}
                              />
                            )}
                          />
                          <Form.InputText>{`/ ${values.defaultRecord.memberPropPlayMother}`}</Form.InputText>
                          <Form.Label data-text-align='right'>
                            {values.defaultRecord.memberPropPlay.length > 0 &&
                              Math.floor(
                                new BigNumber(values.defaultRecord.memberPropPlay)
                                  .dividedBy(values.defaultRecord.memberPropPlayMother)
                                  .multipliedBy(100)
                              )}
                            %
                          </Form.Label>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Average Bet</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberAverageBet'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Who Win</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberWhoWin'
                            render={({ field }) => (
                              <Form.Radio.Group name={field.name}>
                                <Form.Radio
                                  value='player'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.defaultRecord.memberWhoWin === 'player'}
                                  readOnly
                                >
                                  Player
                                </Form.Radio>
                                <Form.Radio
                                  value='dealer'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.defaultRecord.memberWhoWin === 'dealer'}
                                  readOnly
                                >
                                  Dealer
                                </Form.Radio>
                              </Form.Radio.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Actual Win</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberActualWin'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Drop</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberDrop'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Overage</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.memberOverage'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group width={'40%'}>
                      <Form.GroupName>ANOMYMOUS</Form.GroupName>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Play Type</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousPlayType'
                            render={({ field }) => (
                              <Form.Select
                                value={values.defaultRecord.anonymousPlayType}
                                onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                              </Form.Select>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row align='top'>
                        <Form.Column size='md'>
                          <Form.Label>Prop Play</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousPropPlay'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                data-is-short
                                {...field}
                              />
                            )}
                          />
                          <Form.InputText>{`/ ${values.defaultRecord.anonymousPropPlayMother}`}</Form.InputText>
                          <Form.Label data-text-align='right'>
                            {values.defaultRecord.anonymousPropPlay.length > 0 &&
                              Math.floor(
                                new BigNumber(values.defaultRecord.anonymousPropPlay)
                                  .dividedBy(values.defaultRecord.anonymousPropPlayMother)
                                  .multipliedBy(100)
                              )}
                            %
                          </Form.Label>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Average Bet</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousAverageBet'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Who Win</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousWhoWin'
                            render={({ field }) => (
                              <Form.Radio.Group name={field.name}>
                                <Form.Radio
                                  value='player'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.defaultRecord.anonymousWhoWin === 'player'}
                                  readOnly
                                >
                                  Player
                                </Form.Radio>
                                <Form.Radio
                                  value='dealer'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.defaultRecord.anonymousWhoWin === 'dealer'}
                                  readOnly
                                >
                                  Dealer
                                </Form.Radio>
                              </Form.Radio.Group>
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Actual Win</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousActualWin'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Drop</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousDrop'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='md'>
                          <Form.Label>Overage</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='defaultRecord.anonymousOverage'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>
                  </div>
                  <div className={cx('home-settings__footer')}>
                    <Button type='submit' disabled={tableNumber === 'Please select table'}>
                      Save
                    </Button>
                  </div>
                </FormikForm>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  ) : null
}

Settings.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    seatedList: seatedSelectors.getSeatedList(state, props),
    standingList: standingSelectors.getStandingList(state, props),
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockState: tableSelectors.getClockState(state, props),
  }
}

const mapDispatchToProps = {
  changeTableNumber: tableOperations.changeTableNumber,
  changeClockState: tableOperations.changeClockState,
  changeAutoSettings: tableOperations.changeAutoSettings,
  changeDefaultRecord: tableOperations.changeDefaultRecord,
  removeAllFromSeated: seatedOperations.removeAllFromSeated,
  removeAllFromStanding: standingOperations.removeAllFromStanding,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
