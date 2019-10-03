import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { Formik, Form as FormikForm, Field, getIn } from 'formik'
import { BigNumber } from 'bignumber.js'
import { map, concat, compact, isEqual, trim } from 'lodash'

// Components
import Modal from '../../../../components/Modal'
import Button from '../../../../components/Button'
import Form from '../../components/Form'
import Keyboard, { keys } from '../../components/Keyboard'

// Modules
import { operations as seatedOperations, selectors as seatedSelectors } from '../../../../lib/redux/modules/seated'
import { operations as standingOperations, selectors as standingSelectors } from '../../../../lib/redux/modules/standing'
import { operations as tableOperations, selectors as tableSelectors } from '../../../../lib/redux/modules/table'
import { operations as settingOperations } from '../../../../lib/redux/modules/setting'

// Lib MISC
import SettingsApi from '../../../../lib/api/Setting'
import TableApi from '../../../../lib/api/Table'
import GameApi from '../../../../lib/api/Game'
import useFetcher from '../../../../lib/effects/useFetcher'
import { setLocalStorageItem, removeLocalStorageItem, clearLocalStorageItem } from '../../../../lib/helpers/localStorage'
import ERROR_MESSAGE from '../../../../constants/ErrorMessage'

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
  changeTableNumber: PropTypes.func,
  changeClockState: PropTypes.func,
  changeSettingData: PropTypes.func,
  seatedList: PropTypes.array,
  standingList: PropTypes.array,
  removeAllFromSeated: PropTypes.func,
  removeAllFromStanding: PropTypes.func,
  removeAllClockOutPlayer: PropTypes.func,
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

const settingsModalText = {
  hasManualClockOutPlayer: {
    state: 'hasManualClockOutPlayer',
    title: 'Please manually clock-out first',
    description: `Please manually clock-out all manually clocked-in players`,
  },
  hasAutoClockOutPlayer: {
    state: 'hasAutoClockOutPlayer',
    title: 'The system will clear the "Table"',
    description: `Changing table will clock-out all players`,
  },
  manualClock: {
    title: 'Manually Clock-In/Out Member and Anonymous',
    description: `Once you press "CONFIRM", the system will clear the "TABLE" and manually clock-in/out member and anonymous`,
  },
  autoAnonymous: {
    title: 'Automatic Clock-In/Out Anonymous',
    description: `Once you press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out anonymous`,
  },
  autoMember: {
    title: 'Automatic Clock-In/Out Member',
    description: `Once you press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out member`,
  },
  autoClock: {
    title: 'Automatic Clock-In/Out Member and Anonymous',
    description: `Once you press "CONFIRM", the system will clear the "TABLE" and automatic clock-in/out member and anonymous`,
  },
  clearTable: {
    title: 'Clear the "TABLE"',
    description: `Once you press "CONFIRM", the system will clear the "TABLE" to implement the new chosen condition`,
  },
}

function Settings (props) {
  const {
    tableNumber,
    changeClockState,
    changeTableNumber,
    changeSettingData,
    seatedList,
    standingList,
    removeAllFromSeated,
    removeAllFromStanding,
    removeAllClockOutPlayer,
  } = props

  const { isLoaded, response: detail } = useFetcher(null, SettingsApi.fetchSettingDetail, { tableNumber })
  const { response: tableListTemp } = useFetcher(null, SettingsApi.getTableList, {})
  // const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playTypeNumber' && key !== 'overallWinner')
  const [currentTab, setCurrentTab] = useState(TABS.SYSTEM_SETTINGS)
  const [lastFocusField, setLastFocusField] = useState('actualWin')
  const [memberAutomatic, setMemberAutomatic] = useState(false)
  const [anonymousAutomatic, setAnonymousAutomatic] = useState(false)
  const [previousClockState, setPreviousClockState] = useState('')
  const [previousDynamiqLogStatus, setPreviousDynamiqLogStatus] = useState({})
  const [tableList, setTableList] = useState([])
  const [changeTableName, setChangeTableName] = useState('')

  const [isChangeClockStateModalOpened, setIsChangeClockStateModalOpened] = useState(false)
  const [settingModalTextPack, setSettingModalTextPack] = useState({})
  const [isSettingModalOpened, setIsSettingModalOpened] = useState(false)

  const [isClockOutAllModalOpened, setClockOutAllModalOpened] = useState(false)
  const [isCheckTableModalOpened, setIsCheckTableModalOpened] = useState(false)
  const [clockOutError, setClockOutError] = useState('')

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)
  const openConfirmModal = () => setIsChangeClockStateModalOpened(true)
  const closeConfirmModal = () => setIsChangeClockStateModalOpened(false)
  const openSettingModal = () => setIsSettingModalOpened(true)
  const closeSettingModal = () => setIsSettingModalOpened(false)
  const openClockOutAllModal = () => setClockOutAllModalOpened(true)
  const closeClockOutAllModal = () => setClockOutAllModalOpened(false)
  const openCheckTableModal = () => setIsCheckTableModalOpened(true)

  const closeCheckTableModal = async () => {
    const result = await SettingsApi.getTableList({})

    await setTableList(
      result.tableList.sort(function (a, b) {
        return a.tableName > b.tableName ? 1 : -1
      })
    )
    setIsCheckTableModalOpened(false)
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
      setPreviousDynamiqLogStatus({
        clockInOutMemDynamiq: detail.systemSettings.clockInOutMemDynamiq,
        clockInOutAnonymousDynamiq: detail.systemSettings.clockInOutAnonymousDynamiq,
        logMemClock: detail.systemSettings.logMemClock,
        logAnonymousClock: detail.systemSettings.logAnonymousClock,
      })
    }
  }, [detail, tableList, changeTableNumber, changeClockState, tableListTemp])

  useEffect(() => {
    if (isLoaded) {
      changeClockState(checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
      changeSettingData(detail.systemSettings, detail.autoSettings, detail.defaultRecord)
      changeTableNumber(detail.systemSettings.tbName)

      // For Refresh - set settingData to localStorage
      const newSettingData = {
        systemSettings: detail.systemSettings,
        autoSettings: detail.autoSettings,
        defaultRecord: detail.defaultRecord,
      }
      setLocalStorageItem('settingData', newSettingData)
      setLocalStorageItem('clockState', checkClockState(detail.autoSettings.autoClockMember, detail.autoSettings.autoClockAnonymous))
    }
  }, [detail, isLoaded, changeTableNumber, changeClockState, changeSettingData])

  const setFormikValueByConfirmModal = formikValues => {
    setPreviousClockState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))

    setPreviousDynamiqLogStatus({
      clockInOutMemDynamiq: formikValues.systemSettings.clockInOutMemDynamiq,
      clockInOutAnonymousDynamiq: formikValues.systemSettings.clockInOutAnonymousDynamiq,
      logMemClock: formikValues.systemSettings.logMemClock,
      logAnonymousClock: formikValues.systemSettings.logAnonymousClock,
    })

    // For Refresh - set settingData to localStorage
    const newSettingData = {
      systemSettings: formikValues.systemSettings,
      autoSettings: formikValues.autoSettings,
      defaultRecord: formikValues.defaultRecord,
    }
    setLocalStorageItem('settingData', newSettingData)
    setLocalStorageItem('clockState', checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))

    changeClockState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))
    changeSettingData(formikValues.systemSettings, formikValues.autoSettings, formikValues.defaultRecord)

    SettingsApi.postSettingDetail({
      systemSettings: formikValues.systemSettings,
      autoSettings: formikValues.autoSettings,
      defaultRecord: formikValues.defaultRecord,
    })
  }

  const saveByConfirmModal = async formikValues => {
    await clearTableBySave(formikValues)
    closeConfirmModal()
  }

  const setTableListActiveStatus = async (setTableList, tableList, selectedTableName, tableNumber) => {
    const result = await SettingsApi.getTableList({})

    const newTableList = result.tableList.sort(function (a, b) {
      return a.tableName > b.tableName ? 1 : -1
    })

    setTableList(
      newTableList.map(tableItem => {
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
    SettingsApi.activeTable({ tableNumber: selectedTableName })
    SettingsApi.deactiveTable({ tableNumber })
    TableApi.logOffTable({ tableNumber })
  }

  const getPlayerList = () => {
    const seatedMemberData = map(seatedList, item => {
      let newItem

      if (typeof item === 'object') {
        newItem = {
          cid: item.id,
          level: item.cardType,
          type: item.type,
          seatNo: item.seatNumber,
        }
      }

      return newItem
    })

    const standingMemberData = map(standingList, item => {
      let newItem

      if (typeof item === 'object') {
        newItem = {
          cid: item.id,
          level: item.cardType,
          type: item.type,
          seatNo: item.seatNumber,
        }
      }

      return newItem
    })

    const memberIdList = compact(concat(seatedMemberData, standingMemberData))
    return { memberIdList }
  }

  // batch clock-out by change clock state and clock-in / out to Dynamiq
  const clearTableBySave = async formikValues => {
    const { memberIdList } = getPlayerList()

    await GameApi.clockOutAll({ memberIdList, tableNumber })
      .then(async result => {
        await setFormikValueByConfirmModal(formikValues)

        await removeLocalStorageItem('seatedList')
        await removeAllFromSeated()
        await removeLocalStorageItem('standingList')
        await removeAllFromStanding()
        await removeAllClockOutPlayer()
      })
      .catch(error => {
        let errorMessage = error.response.data.data
        errorMessage = trim(errorMessage.split('msg')[1], '}:"')

        if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
          errorMessage += '. Please click "CONFIRM" again.'
          TableApi.logOnTable({ tableNumber })
          setClockOutError(errorMessage)
        } else {
          setClockOutError(errorMessage)
        }

        openClockOutAllModal()
      })
  }

  const checkPlayerInList = async () => {
    //  seatedList / standingList 有人的話，判斷是被 auto 或 manual clock-in
    let isSomeOneManualClockedIn = false
    let isSomeOneAutoClockedIn = false

    await seatedList.forEach(item => {
      if (item) {
        if (item?.isAuto) {
          isSomeOneAutoClockedIn = true
        } else {
          isSomeOneManualClockedIn = true
        }
      }
    })

    await standingList.forEach(item => {
      if (item) {
        if (item?.isAuto) {
          isSomeOneAutoClockedIn = true
        } else {
          isSomeOneManualClockedIn = true
        }
      }
    })
    return {
      isSomeOneManualClockedIn,
      isSomeOneAutoClockedIn,
    }
  }

  const onOptionChange = async event => {
    const selectedTableName = event.target.value
    setChangeTableName(event.target.value)

    SettingsApi.checkTableStatus({ tableNumber: selectedTableName })
      .then(async result => {
        const { isSomeOneManualClockedIn, isSomeOneAutoClockedIn } = await checkPlayerInList()

        if (isSomeOneManualClockedIn) {
          setSettingModalTextPack(settingsModalText['hasManualClockOutPlayer'])
          openSettingModal()
        } else if (isSomeOneAutoClockedIn) {
          setSettingModalTextPack(settingsModalText['hasAutoClockOutPlayer'])
          openSettingModal()
        } else {
          await setTableListActiveStatus(setTableList, tableList, selectedTableName, tableNumber)
          await clearLocalStorageItem()
          setLocalStorageItem('tableNumber', selectedTableName)
          changeTableNumber(selectedTableName)
        }
      })
      .catch(() => {
        openCheckTableModal()
      })
  }

  // batch clock-out by change table
  const clearTableByChangeTable = async () => {
    const { memberIdList } = getPlayerList()

    await GameApi.clockOutAll({ memberIdList, tableNumber })
      .then(async result => {
        setTableListActiveStatus(setTableList, tableList, changeTableName, tableNumber)
        clearLocalStorageItem()
        setLocalStorageItem('tableNumber', changeTableName)

        changeTableNumber(changeTableName)
        removeAllFromSeated()
        removeAllFromStanding()
        removeAllClockOutPlayer()

        closeSettingModal()
      })
      .catch(error => {
        let errorMessage = error.response.data.data
        errorMessage = trim(errorMessage.split('msg')[1], '}:"')

        // 如果 not log-on，自動 log-on
        if (errorMessage === ERROR_MESSAGE.NOT_LOGGED_ON) {
          errorMessage += '. Please click "CONFIRM" again.'
          TableApi.logOnTable({ tableNumber })
        }

        setClockOutError(errorMessage)
        openClockOutAllModal()
      })
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

  const renderModal = values =>
    (isSettingModalOpened || isChangeClockStateModalOpened || isClockOutAllModalOpened || isCheckTableModalOpened) && (
      <>
        {/* change clock state and clock-in / out to Dynamiq / Log popup */}
        <Modal
          className={cx('home-settings-confirm-modal')}
          isClosable={false}
          shouldCloseOnOverlayClick={false}
          isOpened={isChangeClockStateModalOpened}
        >
          <Modal.Header>
            <div className={cx('home-settings-confirm-modal__header')}>{settingModalTextPack.title}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-settings-confirm-modal__body')}>{settingModalTextPack.description}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='button'
              className={cx('home-settings-confirm-modal-modal__action')}
              isInvisible={settingModalTextPack.state !== 'hasManualClockOutPlayer'}
              size={'md'}
              onClick={closeConfirmModal}
            >
              OK
            </Button>
            <Button
              type='button'
              className={cx('home-settings-confirm-modal__action')}
              isFilled={false}
              isInvisible={settingModalTextPack.state === 'hasManualClockOutPlayer'}
              size={'md'}
              onClick={closeConfirmModal}
            >
              CANCEL
            </Button>
            <Button
              type='button'
              className={cx('home-settings-confirm-modal__action')}
              isInvisible={settingModalTextPack.state === 'hasManualClockOutPlayer'}
              size={'md'}
              onClick={() => saveByConfirmModal(values)}
            >
              CONFIRM
            </Button>
          </Modal.Footer>
        </Modal>
        {/* change table popup */}
        <Modal
          className={cx('home-settings-change-table-modal')}
          isClosable={false}
          shouldCloseOnOverlayClick={false}
          isOpened={isSettingModalOpened}
        >
          <Modal.Header>
            <div className={cx('home-settings-change-table-modal__header')}>{settingModalTextPack.title}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-settings-change-table-modal__body')}>{settingModalTextPack.description}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='button'
              className={cx('home-settings-change-table-modal__action')}
              isInvisible={settingModalTextPack.state === 'hasAutoClockOutPlayer'}
              size={'md'}
              onClick={closeSettingModal}
            >
              OK
            </Button>
            <Button
              type='button'
              className={cx('home-settings-change-table-modal__action')}
              isFilled={false}
              isInvisible={settingModalTextPack.state === 'hasManualClockOutPlayer'}
              size={'md'}
              onClick={closeSettingModal}
            >
              CANCEL
            </Button>
            <Button
              type='button'
              className={cx('home-settings-change-table-modal__action')}
              isInvisible={settingModalTextPack.state === 'hasManualClockOutPlayer'}
              size={'md'}
              onClick={() => clearTableByChangeTable()}
            >
              CONFIRM
            </Button>
          </Modal.Footer>
        </Modal>
        {/* error popup */}
        <Modal
          className={cx('home-settings-change-table-modal')}
          isClosable={false}
          shouldCloseOnOverlayClick={false}
          isOpened={isClockOutAllModalOpened}
        >
          <Modal.Header>
            <div className={cx('home-settings-change-table-modal__header')}>{`Clock-Out Error`}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-settings-change-table-modal__body')}>{`${clockOutError}`}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='button' className={cx('home-settings-change-table-modal__action')} size={'md'} onClick={closeClockOutAllModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
        {/* change table if table already in use */}
        <Modal
          className={cx('home-settings-change-table-modal')}
          isClosable={false}
          shouldCloseOnOverlayClick={false}
          isOpened={isCheckTableModalOpened}
        >
          <Modal.Header>
            <div className={cx('home-settings-change-table-modal__header')}>{`Change Table Error`}</div>
          </Modal.Header>
          <Modal.Body>
            <div className={cx('home-settings-change-table-modal__body')}>{`Table already in use. Please select another table.`}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='button' className={cx('home-settings-change-table-modal__action')} size={'md'} onClick={closeCheckTableModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )

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
            onSubmit={async values => {
              const currentMemberClock = values.autoSettings.autoClockMember
              const currentAnonymousClock = values.autoSettings.autoClockAnonymous

              const currentDynamiqLogStatus = {
                clockInOutMemDynamiq: values.systemSettings.clockInOutMemDynamiq,
                clockInOutAnonymousDynamiq: values.systemSettings.clockInOutAnonymousDynamiq,
                logMemClock: values.systemSettings.logMemClock,
                logAnonymousClock: values.systemSettings.logAnonymousClock,
              }

              if (!isEqual(currentDynamiqLogStatus, previousDynamiqLogStatus)) {
                // 如果 member/anonymous  clock-in/out into Dynamiq 或 Log 設定有更改
                const { isSomeOneManualClockedIn, isSomeOneAutoClockedIn } = await checkPlayerInList()

                if (isSomeOneManualClockedIn) {
                  setSettingModalTextPack(settingsModalText['hasManualClockOutPlayer'])
                  openConfirmModal()
                } else if (isSomeOneAutoClockedIn) {
                  setSettingModalTextPack(settingsModalText['clearTable'])
                  openConfirmModal()
                } else {
                  setFormikValueByConfirmModal(values)
                }
              } else if (previousClockState !== checkClockState(currentMemberClock, currentAnonymousClock)) {
                // 如果 clock status 有更改
                const { isSomeOneManualClockedIn, isSomeOneAutoClockedIn } = await checkPlayerInList()

                if (isSomeOneManualClockedIn) {
                  setSettingModalTextPack(settingsModalText['hasManualClockOutPlayer'])
                  openConfirmModal()
                } else if (isSomeOneAutoClockedIn) {
                  await setSettingModalTextPack(settingsModalText[checkClockState(currentMemberClock, currentAnonymousClock)])
                  openConfirmModal()
                } else {
                  setFormikValueByConfirmModal(values)
                }
              } else {
                changeSettingData(values.systemSettings, values.autoSettings, values.defaultRecord)

                // For Refresh - set settingData to localStorage
                const newSettingData = {
                  systemSettings: values.systemSettings,
                  autoSettings: values.autoSettings,
                  defaultRecord: values.defaultRecord,
                }
                setLocalStorageItem('settingData', newSettingData)
                setLocalStorageItem('clockState', checkClockState(currentMemberClock, currentAnonymousClock))

                SettingsApi.postSettingDetail({
                  systemSettings: values.systemSettings,
                  autoSettings: values.autoSettings,
                  defaultRecord: values.defaultRecord,
                })
              }
            }}
          >
            {({ validateForm, submitForm, initialValues, values, setFieldValue }) => {
              return (
                <FormikForm>
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
                  {renderModal(values)}
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
                            name='systemSettings.matchPercentage'
                            render={({ field }) => (
                              <Form.Select
                                value={values.systemSettings.matchPercentage}
                                onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value='90'>90%</option>
                                <option value='80'>80%</option>
                                <option value='70'>70%</option>
                                <option value='0'>0%</option>
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
                                  disabled
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
                              <Form.Input // 目前只用 anonymous playTypeNumber
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled
                                {...field}
                              />
                            )}
                          />
                          {/* <Field
                            name='defaultRecord.memberPlayType'
                            render={({ field }) => (
                              <Form.Select
                                value={values.defaultRecord.memberPlayType}
                                onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value='0'>0</option>
                                <option value='99'>99</option>
                              </Form.Select>
                            )}
                          /> */}
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
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                          {/* <Field
                            name='defaultRecord.anonymousPlayType'
                            render={({ field }) => (
                              <Form.Select
                                value={values.defaultRecord.anonymousPlayType}
                                onChange={e => setFieldValue(field.name, e.target.options[e.target.selectedIndex].value)}
                              >
                                <option value='0'>0</option>
                                <option value='99'>99</option>
                              </Form.Select>
                            )}
                          /> */}
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
  }
}

const mapDispatchToProps = {
  changeTableNumber: tableOperations.changeTableNumber,
  changeClockState: tableOperations.changeClockState,
  removeAllClockOutPlayer: tableOperations.removeAllClockOutPlayer,
  removeAllFromSeated: seatedOperations.removeAllFromSeated,
  removeAllFromStanding: standingOperations.removeAllFromStanding,
  changeSettingData: settingOperations.changeSettingData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
