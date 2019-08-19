import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { isEmpty } from 'lodash'
import { Formik, Form as FormikForm, Field, getIn } from 'formik'
import { BigNumber } from 'bignumber.js'

// Components
import Button from '../../../../components/Button'
import Form from '../../components/Form'
import Keyboard, { keys } from '../../components/Keyboard'
// import Switch from '../../../../components/Switch'

// Views
import Popup from './views/Popup'

// Modules
import { operations as tableOperations, selectors as tableSelectors } from '../../../../lib/redux/modules/table'

// Lib MISC
import SettingsApi from '../../../../lib/api/Setting'
import useFetcher from '../../../../lib/effects/useFetcher'

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
}

export const checkClockState = (memberClock, anonymousClock) => {
  if (memberClock === false && anonymousClock === false) {
    return 'manualClock'
  } else if (memberClock === false && anonymousClock === true) {
    return 'autoAnonymous'
  } else if (memberClock === true && anonymousClock === false) {
    return 'autoMember'
  } else if (memberClock === true && anonymousClock === true) {
    return 'autoClock'
  }
}

function Settings (props) {
  const { tableNumber, clockState, changeTableNumber, changeClockState } = props
  const { isLoaded, response: detail } = useFetcher(null, SettingsApi.fetchSettingDetail, { tableNumber })
  const { response: tableListTemp } = useFetcher(null, SettingsApi.getTableList, {})
  // const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playType' && key !== 'overallWinner')
  const [currentTab, setCurrentTab] = useState(TABS.SYSTEM_SETTINGS)
  const [lastFocusField, setLastFocusField] = useState('actualWin')
  const [memberAutomatic, setMemberAutomatic] = useState(false)
  const [anonymousAutomatic, setAnonymousAutomatic] = useState(false)
  const [previousClockState, setPreviousClockState] = useState()
  const [tableList, setTableList] = useState([])
  const [popupContent, setPopupContent] = useState()
  const [popupDisplay, setPopupDisplay] = useState('flex')
  const localStorageTableNumber = localStorage.getItem('tableNumber')

  // const { isLoaded, response: detail } = useFetcher(null, MemberApi.fetchMemberDetailById, { id })

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)
  const onCancelSave = () => {
    setPopupDisplay('none')
  }

  const onConfirmSave = () => {
    setPopupDisplay('none')
  }

  const setClockPreviousState = clockState => {
    setPreviousClockState(clockState)
  }

  const API_NUMBER = 25

  const getValidationSchema = () => {
    return Yup.object().shape({
      systemSettings: Yup.object().shape({}),
      autoSettings: Yup.object().shape({
        autoClockInMemberSec: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        autoClockOutMemberSec: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        autoClockInAnonymousSec: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        autoClockOutAnonymousSec: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
      }),
      defaultRecord: Yup.object().shape({
        memberPropPlay: Yup.string().test('more-than-api', 'Amounnt cannot be larger than proportion of games', value => Number(value) < API_NUMBER),
        anonymousPropPlay: Yup.string().test(
          'more-than-api',
          'Amounnt cannot be larger than proportion of games',
          value => Number(value) < API_NUMBER
        ),
      }),
    })
  }

  const validateFormData = (validateForm, submitForm) => {
    validateForm().then(errors => {
      console.log('errors :', errors)
      if (isEmpty(errors)) {
        submitForm()
      }
    })
  }

  const onOptionChange = async event => {
    const selectedTableName = event.target.value
    setTableList(
      tableList.map(tableItem => {
        if (tableItem.tableName === 'Please select') {
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
    if (selectedTableName !== 'Please select') SettingsApi.activeTable({ selectedTableName })
    console.log('localStorageTableNumber', localStorageTableNumber)
    SettingsApi.deactiveTable({ tableNumber })
    console.log('selectedTableName', selectedTableName)
    localStorage.setItem('tableNumber', selectedTableName)
    changeTableNumber(selectedTableName)
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
      if (!clockState) changeClockState(checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
    }
  }, [changeClockState, clockState, detail, tableList, tableListTemp])

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
                alert('It is same.')
                SettingsApi.postSettingDetail({
                  systemSettings: values.systemSettings,
                  autoSettings: values.autoSettings,
                  defaultRecord: values.defaultRecord,
                })
                setPreviousClockState(checkClockState(currentMemberClock, currentAnonymousClock))
                changeClockState(checkClockState(currentMemberClock, currentAnonymousClock))
              } else {
                switch (checkClockState(currentMemberClock, currentAnonymousClock)) {
                  case 'manualClock':
                    setPopupContent('Manually Clock-In/Out Member and Anonymous')
                    break
                  case 'autoAnonymous':
                    setPopupContent('Automatic Clock-In/Out Anonymous')
                    break
                  case 'autoMember':
                    setPopupContent('Automatic Clock-In/Out Member')
                    break
                  case 'autoClock':
                    setPopupContent('Automatic Clock-In/Out Member and Anonymous')
                    break
                }
                setPopupDisplay('flex')
              }
            }}
          >
            {({ validateForm, submitForm, initialValues, values, setFieldValue }) => {
              return (
                <FormikForm>
                  <Popup
                    popupContent={popupContent}
                    display={popupDisplay}
                    onCancel={onCancelSave}
                    onConfirm={onConfirmSave}
                    formikValues={values}
                    setClockPreviousState={setClockPreviousState}
                  />
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
                                {tableItem.tableName === 'Please select' ? '' : !tableItem.disabled ? '' : '  (Active)'}
                              </option>
                            ))}
                          </Form.Select>
                          {/* <Form.Display>{initialValues.tableNumber}</Form.Display> */}
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
                                <option value='90'>{`${values.systemSettings.matchPercentage}%`}</option>
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
                                    // setAnonymousIntoDynamiq(event.target.checked)
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
                                    // setAnonymousLogging(event.target.checked)
                                  }}
                                  checked={values.systemSettings.logAnonymousClock}
                                  readOnly
                                >
                                  Active
                                </Form.Checkbox>
                              </Form.Checkbox.Group>
                            )}
                          />
                          {/* <Field
                            name='systemSettings.logAnonymousClock'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  setAnonymousLogging(isChecked)
                                }}
                                isChecked={anonymousLogging || values.systemSettings.logAnonymousClock}
                              />
                            )}
                          /> */}
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
                          {/* <Field
                            name='autoSettings.autoClockAnonymous'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  anonymousAutomatic &&
                                    setFieldValue('autoSettings.autoClockInAnonymousSec', values.autoSettings.autoClockInAnonymousSec)
                                  anonymousAutomatic &&
                                    setFieldValue('autoSettings.autoClockOutAnonymousSec', values.autoSettings.autoClockOutAnonymousSec)
                                  setAnonymousAutomatic(isChecked)
                                }}
                                isChecked={anonymousAutomatic || values.autoSettings.autoClockAnonymous}
                              />
                            )}
                          /> */}
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
                    <Form.Group width={'50%'}>
                      <Form.GroupName>MEMBER</Form.GroupName>
                      <Form.Row>
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                          <Form.InputText>{`/ ${API_NUMBER}`}</Form.InputText>
                          <Form.Label data-text-align='right'>
                            {values.defaultRecord.memberPropPlay.length > 0 &&
                              Math.floor(new BigNumber(values.defaultRecord.memberPropPlay).dividedBy(API_NUMBER).multipliedBy(100))}
                            %
                          </Form.Label>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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

                    <Form.Group width={'50%'}>
                      <Form.GroupName>ANOMYMOUS</Form.GroupName>
                      <Form.Row>
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                          <Form.InputText>{`/ ${API_NUMBER}`}</Form.InputText>
                          <Form.Label data-text-align='right'>
                            {values.defaultRecord.memberPropPlay.length > 0 &&
                              Math.floor(new BigNumber(values.defaultRecord.memberPropPlay).dividedBy(API_NUMBER).multipliedBy(100))}
                            %
                          </Form.Label>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                        <Form.Column size='lg'>
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
                    <Button type='button' disabled={tableNumber === 'Please select'} onClick={() => validateFormData(validateForm, submitForm)}>
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
  console.warn('map state', state)
  console.warn('map props', props)
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
    clockState: tableSelectors.getClockState(state, props),
  }
}

const mapDispatchToProps = {
  changeTableNumber: tableOperations.changeTableNumber,
  changeClockState: tableOperations.changeClockState,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
