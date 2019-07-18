import React, { useState } from 'react'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { isEmpty } from 'lodash'
import { Formik, Form as FormikForm, Field, getIn } from 'formik'
import { BigNumber } from 'bignumber.js'

// Components
import Button from '../../../../components/Button'
import Form from '../../components/Form'
import Keyboard, { keys } from '../../components/Keyboard'
import Switch from '../../../../components/Switch'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const TABS = {
  SYSTEM_SETTINGS: 'system-settings',
  AUTOMATIC_SETTINGS: 'automatic-settings',
  DEFAULT_RECORD: 'default-record',
}

export const propTypes = {}

function Settings (props) {
  const initialValues = {
    tableNumber: 'Table - 0001',
    currentDealer: 'Hank',
    currentSupervisor: 'Sean',
    numberOfPlayers: 28,
    cameraIp1: '255.123.131.1',
    cameraIp2: '255.123.131.2',
    matchPercentage: 90,
    member: {
      intoDynamiq: false,
      logging: false,
      automatic: false,
      automaticClockIn: '60',
      automaticClockOut: '60',
      playType: '0',
      averageBet: '',
      overallWinner: 'player',
      actualWin: '',
      drop: '',
      overage: '',
      propPlay: '',
    },
    anonymous: {
      intoDynamiq: false,
      logging: false,
      automatic: false,
      automaticClockIn: '60',
      automaticClockOut: '60',
      playType: '0',
      averageBet: '',
      overallWinner: 'player',
      actualWin: '',
      drop: '',
      overage: '',
      propPlay: '',
    },
  }

  // const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playType' && key !== 'overallWinner')

  const [currentTab, setCurrentTab] = useState(TABS.SYSTEM_SETTINGS)
  const [lastFocusField, setLastFocusField] = useState('actualWin')
  const [memberIntoDynamiq, setMemberIntoDynamiq] = useState(false)
  const [memberLogging, setMemberLogging] = useState(false)
  const [anonymousIntoDynamiq, setAnonymousIntoDynamiq] = useState(false)
  const [anonymousLogging, setAnonymousLogging] = useState(false)
  const [memberAutomatic, setMemberAutomatic] = useState(false)
  const [anonymousAutomatic, setAnonymousAutomatic] = useState(false)

  // const { isLoaded, response: detail } = useFetcher(null, MemberApi.fetchMemberDetailById, { id })

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)

  const API_NUMBER = 25

  const getValidationSchema = () => {
    return Yup.object().shape({
      member: Yup.object().shape({
        automaticClockIn: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        automaticClockOut: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        propPlay: Yup.string().test('more-than-api', 'Amounnt cannot be larger than proportion of games', value => Number(value) < API_NUMBER),
      }),
      anonymous: Yup.object().shape({
        automaticClockIn: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        automaticClockOut: Yup.string()
          .notOneOf(['0'], 'Duration must be above 0')
          .required('Duration must be entered'),
        propPlay: Yup.string().test('more-than-api', 'Amounnt cannot be larger than proportion of games', value => Number(value) < API_NUMBER),
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

  return (
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
            initialValues={initialValues}
            isInitialValid
            enableReinitialize
            validationSchema={getValidationSchema}
            onSubmit={() => alert('SAVE!')}
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
                          <Form.Display>{initialValues.tableNumber}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Current Log-in Dealer</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.currentDealer}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Current Supervisor</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.currentSupervisor}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>Number of Players at Table</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.numberOfPlayers}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>IP of Camera 1</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.cameraIp1}</Form.Display>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column size='lg'>
                          <Form.Label>IP of Camera 2</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Form.Display>{initialValues.cameraIp2}</Form.Display>
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
                                <option value='90'>90%</option>
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
                            name='member.intoDynamiq'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  setMemberIntoDynamiq(isChecked)
                                }}
                                isChecked={memberIntoDynamiq}
                              />
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
                            name='member.logging'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  setMemberLogging(isChecked)
                                }}
                                isChecked={memberLogging}
                              />
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
                            name='anonymous.intoDynamiq'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  setAnonymousIntoDynamiq(isChecked)
                                }}
                                isChecked={anonymousIntoDynamiq}
                              />
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
                            name='anonymous.logging'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  setAnonymousLogging(isChecked)
                                }}
                                isChecked={anonymousLogging}
                              />
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
                            name='member.automatic'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  memberAutomatic && setFieldValue('member.automaticClockIn', initialValues.member.automaticClockIn)
                                  memberAutomatic && setFieldValue('member.automaticClockOut', initialValues.member.automaticClockOut)
                                  setMemberAutomatic(isChecked)
                                }}
                                isChecked={memberAutomatic}
                              />
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
                            name='member.automaticClockIn'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.member.automatic}
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
                            name='member.automaticClockOut'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.member.automatic}
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
                            name='anonymous.automatic'
                            render={({ field }) => (
                              <Switch
                                onChange={(event, isChecked) => {
                                  setFieldValue(field.name, isChecked)
                                  anonymousAutomatic && setFieldValue('anonymous.automaticClockIn', initialValues.anonymous.automaticClockIn)
                                  anonymousAutomatic && setFieldValue('anonymous.automaticClockOut', initialValues.anonymous.automaticClockOut)
                                  setAnonymousAutomatic(isChecked)
                                }}
                                isChecked={anonymousAutomatic}
                              />
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
                            name='anonymous.automaticClockIn'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.anonymous.automatic}
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
                            name='anonymous.automaticClockOut'
                            render={({ field }) => (
                              <Form.Input
                                isFocused={lastFocusField === field.name}
                                onFocus={event => setLastFocusField(field.name)}
                                disabled={!values.anonymous.automatic}
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
                          <Form.Select>
                            <option value='0'>0</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                          </Form.Select>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row align='top'>
                        <Form.Column size='lg'>
                          <Form.Label>Prop Play</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='member.propPlay'
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
                            {values.member.propPlay.length > 0 &&
                              Math.floor(new BigNumber(values.member.propPlay).dividedBy(API_NUMBER).multipliedBy(100))}
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
                            name='member.averageBet'
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
                            name='member.overallWinner'
                            render={({ field }) => (
                              <Form.Radio.Group name={field.name}>
                                <Form.Radio
                                  value='player'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.member.overallWinner === 'player'}
                                  readOnly
                                >
                                  Player
                                </Form.Radio>
                                <Form.Radio
                                  value='dealer'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.member.overallWinner === 'dealer'}
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
                            name='member.actualWin'
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
                            name='member.drop'
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
                            name='member.overage'
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
                          <Form.Select>
                            <option value='0'>0</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                          </Form.Select>
                        </Form.Column>
                      </Form.Row>
                      <Form.Row align='top'>
                        <Form.Column size='lg'>
                          <Form.Label>Prop Play</Form.Label>
                        </Form.Column>
                        <Form.Column size='md'>
                          <Field
                            name='anonymous.propPlay'
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
                            {values.anonymous.propPlay.length > 0 &&
                              Math.floor(new BigNumber(values.anonymous.propPlay).dividedBy(API_NUMBER).multipliedBy(100))}
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
                            name='anonymous.averageBet'
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
                            name='anonymous.overallWinner'
                            render={({ field }) => (
                              <Form.Radio.Group name={field.name}>
                                <Form.Radio
                                  value='player'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.anonymous.overallWinner === 'player'}
                                  readOnly
                                >
                                  Player
                                </Form.Radio>
                                <Form.Radio
                                  value='dealer'
                                  onClick={event => setFieldValue(field.name, event.target.value)}
                                  checked={values.anonymous.overallWinner === 'dealer'}
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
                            name='anonymous.actualWin'
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
                            name='anonymous.drop'
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
                            name='anonymous.overage'
                            render={({ field }) => (
                              <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
                            )}
                          />
                        </Form.Column>
                      </Form.Row>
                    </Form.Group>
                  </div>
                  <div className={cx('home-settings__footer')}>
                    <Button type='button' onClick={() => validateFormData(validateForm, submitForm)}>
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
  )
}

Settings.propTypes = propTypes

export default Settings
