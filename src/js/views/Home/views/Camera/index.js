import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import { Formik, Field, Form as FormikForm } from 'formik'
import { trim } from 'lodash'

// Components
import Button from '../../../../components/Button'
import Form from '../../components/Form'
import Keyboard, { keys } from '../../components/Keyboard'

// Modules
import { selectors as tableSelectors } from '../../../../lib/redux/modules/table'

// Lib MISC
import DeviceApi from '../../../../lib/api/Device'
import CoordinateApi from '../../../../lib/api/Coordinate'
import useFetcher from '../../../../lib/effects/useFetcher'
import Player from '../../../../lib/utils/player/player'
import TOTAL_SEAT from '../../../../constants/TotalSeat'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const TABS = {
  LIVE_VIEW: 'live-view',
  SET_CAMERA_1: 'cameraA',
  SET_CAMERA_2: 'cameraB',
}

export const propTypes = {
  tableNumber: PropTypes.string,
}

export function Camera (props) {
  const { tableNumber } = props

  const { isLoaded, response: cameraList } = useFetcher(null, DeviceApi.fetchCameraList, { tableNumber })
  const { isLoaded: coordinateIsLoaded, response: coordinateDetail } = useFetcher(null, CoordinateApi.getCoordinate, { tableNumber })

  const [currentTab, setCurrentTab] = useState(TABS.LIVE_VIEW)
  const [playerCameraList, setPlayerCameraList] = useState([])
  const [selectSeatCoordinate, setSelectSeatCoordinate] = useState({ x: '__', y: '__' })
  const [camera1, setCamera1] = useState({})
  const [camera2, setCamera2] = useState({})
  const [lastFocusField, setLastFocusField] = useState('actualWin')

  const initializeSelectSeatCoordinate = () => setSelectSeatCoordinate({ x: '__', y: '__' })

  const seatCoordinateList = new Array(TOTAL_SEAT).fill() // new 一個座位總數的座位

  const onTabItemClick = event => {
    // 切換 tab 時關掉之前的 connect
    initializeSelectSeatCoordinate()
    switch (currentTab) {
      case TABS.LIVE_VIEW:
        playerCameraList.forEach(player => {
          player.close()
        })

        break
      case TABS.SET_CAMERA_1:
        playerCameraList.close()

        break
      case TABS.SET_CAMERA_2:
        playerCameraList.close()
        break
    }

    setCurrentTab(event.currentTarget.dataset.for)
  }

  const getValidationSchema = () => {
    return Yup.object().shape({
      cameraA: Yup.object().shape({
        seat0: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat1: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat2: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat3: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat4: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat5: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat6: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
      }),
      cameraB: Yup.object().shape({
        seat0: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat1: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat2: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat3: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat4: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat5: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
        seat6: Yup.object().shape({
          topLeft: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
          bottomRight: Yup.object().shape({
            x: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
            y: Yup.number().test('must be above 0', 'Coordinate must be positive', value => Number(value) >= 0),
          }),
        }),
      }),
    })
  }

  useEffect(() => {
    if (isLoaded) {
      setCamera1(cameraList[0])
      setCamera2(cameraList[1])
    }
  }, [cameraList, isLoaded])

  // live view
  useEffect(() => {
    if (!isLoaded) return

    if (currentTab === TABS.LIVE_VIEW) {
      const options = cameraList.map(({ id, websocketUrl, rtspUrl }, index) => ({
        video: document.getElementById(`video${id}`),
        canvas: document.getElementById(`canvas${id}`),
        rtspUrl,
        wsUrl: websocketUrl,
        user: 'admin',
        pwd: 'youwillsee!',
      }))

      const players = options.map(option => new Player(option))

      players.forEach(player => {
        player.on('error', () => console.warn('連接失敗'))

        player.on('noStream', () => {
          console.log('noStream')
          player.close()
          player = null
          player = new Player(options)
          player.init()
          player.connect()
        })

        player.on('canplay', () => console.warn('canplay'))

        player.init()
        player.connect()
      })
      setPlayerCameraList(players)

      return () => {
        // 卸載 component 時，需關閉 webscoket 連線
        players.forEach(player => {
          player.close()
        })
      }
    }
  }, [cameraList, currentTab, isLoaded])

  // set camera1
  useEffect(() => {
    if (!isLoaded || !coordinateIsLoaded) return
    if (currentTab === TABS.SET_CAMERA_1) {
      const option1 = {
        video: document.getElementById(`video__setting__${camera1.id}`),
        canvas: document.getElementById(`canvas__setting__${camera1.id}`),
        rtspUrl: camera1.rtspUrl,
        wsUrl: camera1.websocketUrl,
        user: 'admin',
        pwd: 'youwillsee!',
      }

      let players = new Player(option1)

      players.on('error', () => console.warn('連接失敗'))

      players.on('noStream', () => {
        console.log('noStream')
        players.close()
        players = null
        players = new Player(option1)
        players.init()
        players.connect()
      })

      players.on('canplay', () => console.warn('canplay'))

      players.init()
      players.connect()
      setPlayerCameraList(players)

      return () => {
        // 卸載 component 時，需關閉 webscoket 連線
        players.close()
      }
    }
  }, [camera1, camera1.id, camera1.rtspUrl, camera1.websocketUrl, coordinateIsLoaded, currentTab, isLoaded])

  // set camera2
  useEffect(() => {
    if (!isLoaded || !coordinateIsLoaded) return
    if (currentTab === TABS.SET_CAMERA_2) {
      const option2 = {
        video: document.getElementById(`video__setting__${camera2.id}`),
        canvas: document.getElementById(`canvas__setting__${camera2.id}`),
        rtspUrl: camera2.rtspUrl,
        wsUrl: camera2.websocketUrl,
        user: 'admin',
        pwd: 'youwillsee!',
      }
      let players = new Player(option2)

      players.on('error', () => console.warn('連接失敗'))

      players.on('noStream', () => {
        console.log('noStream')
        players.close()
        players = null
        players = new Player(option2)
        players.init()
        players.connect()
      })

      players.on('canplay', () => console.warn('canplay'))

      players.init()
      players.connect()
      setPlayerCameraList(players)

      return () => {
        // 卸載 component 時，需關閉 webscoket 連線
        players.close()
      }
    }
  }, [camera1, camera2, camera2.id, camera2.rtspUrl, camera2.websocketUrl, coordinateIsLoaded, currentTab, isLoaded])

  const getSeatCoordinate = event => {
    // 點擊時可以取得點擊座標
    const CAMERA_DIMENSIONS = [2592, 1944] // 相機解析度
    const divWidth = trim(getComputedStyle(event.target).width, 'px') // div 的寬度
    const divHeight = trim(getComputedStyle(event.target).height, 'px') // div 的高度
    const cameraProportion = { x: CAMERA_DIMENSIONS[0] / divWidth, y: CAMERA_DIMENSIONS[1] / divHeight } // div 換算成解析度的比例

    setSelectSeatCoordinate({
      x: Math.round(event.nativeEvent.offsetX * cameraProportion.x), // 轉換成相機解析度的實際 x 座標
      y: Math.round(event.nativeEvent.offsetY * cameraProportion.y), // 轉換成相機解析度的實際 y 座標
    })
  }

  const renderCoordinateDetail = (event, values, setFieldValue, currentTab) => {
    return seatCoordinateList.map((item, index) => {
      const checkBoxFieldName = `${currentTab}.seat${index}.checked`

      return (
        <Form.Row className='home-camera-setting-row' key={index}>
          <Form.Column size='sm'>
            <Field
              name={checkBoxFieldName}
              render={({ field }) => (
                <Form.Checkbox.Group name={field.name}>
                  <Form.Checkbox
                    onChange={event => {
                      setFieldValue(checkBoxFieldName, event.target.checked)
                    }}
                    checked={values[currentTab][`seat${index}`].checked}
                    readOnly
                  >
                    <span>{`Seat0${index + 1}`}</span>
                  </Form.Checkbox>
                </Form.Checkbox.Group>
              )}
            />
          </Form.Column>
          <Form.Column size='lg'>
            <Form.Row>
              <Form.Column size='sm'>
                <Form.Label>TopLeft</Form.Label>
              </Form.Column>
              <Form.Column size='lg' className='home-camera-setting-column'>
                <Form.InputText className='home-camera-setting-input-text'>X Coordinate</Form.InputText>
                <Field
                  name={`${currentTab}.seat${index}.topLeft.x`}
                  render={({ field }) => (
                    <Form.Input
                      className='home-camera-setting-input'
                      isFocused={lastFocusField === field.name}
                      onFocus={event => setLastFocusField(field.name)}
                      disabled={!values[currentTab][`seat${index}`].checked}
                      {...field}
                    />
                  )}
                />
              </Form.Column>
              <Form.Column size='lg' className='home-camera-setting-column'>
                <Form.InputText className='home-camera-setting-input-text'>Y Coordinate</Form.InputText>
                <Field
                  name={`${currentTab}.seat${index}.topLeft.y`}
                  render={({ field }) => (
                    <Form.Input
                      className='home-camera-setting-input'
                      isFocused={lastFocusField === field.name}
                      onFocus={event => setLastFocusField(field.name)}
                      disabled={!values[currentTab][`seat${index}`].checked}
                      {...field}
                    />
                  )}
                />
              </Form.Column>
            </Form.Row>
            <Form.Row>
              <Form.Column size='sm'>
                <Form.Label>BottomRight</Form.Label>
              </Form.Column>
              <Form.Column size='lg' className='home-camera-setting-column'>
                <Form.InputText className='home-camera-setting-input-text'>X Coordinate</Form.InputText>
                <Field
                  name={`${currentTab}.seat${index}.bottomRight.x`}
                  render={({ field }) => (
                    <Form.Input
                      className='home-camera-setting-input'
                      isFocused={lastFocusField === field.name}
                      onFocus={event => setLastFocusField(field.name)}
                      disabled={!values[currentTab][`seat${index}`].checked}
                      {...field}
                    />
                  )}
                />
              </Form.Column>
              <Form.Column size='lg' className='home-camera-setting-column'>
                <Form.InputText className='home-camera-setting-input-text'>Y Coordinate</Form.InputText>
                <Field
                  name={`${currentTab}.seat${index}.bottomRight.y`}
                  render={({ field }) => (
                    <Form.Input
                      className='home-camera-setting-input'
                      isFocused={lastFocusField === field.name}
                      onFocus={event => setLastFocusField(field.name)}
                      disabled={!values[currentTab][`seat${index}`].checked}
                      {...field}
                    />
                  )}
                />
              </Form.Column>
            </Form.Row>
          </Form.Column>
        </Form.Row>
      )
    })
  }

  return (
    <div className={cx('home-camera')}>
      <div className={cx('home-camera__tabs')}>
        <div className={cx('home-camera__tabs-list')}>
          <button
            className={cx('home-camera__tabs-item')}
            type='button'
            data-for={TABS.LIVE_VIEW}
            data-is-active={currentTab === TABS.LIVE_VIEW}
            onClick={onTabItemClick}
          >
            LIVE VIEW
          </button>
          <button
            className={cx('home-camera__tabs-item')}
            type='button'
            data-for={TABS.SET_CAMERA_1}
            data-is-active={currentTab === TABS.SET_CAMERA_1}
            onClick={onTabItemClick}
          >
            SET CAMERA 1
          </button>
          <button
            className={cx('home-camera__tabs-item')}
            type='button'
            data-for={TABS.SET_CAMERA_2}
            data-is-active={currentTab === TABS.SET_CAMERA_2}
            onClick={onTabItemClick}
          >
            SET CAMERA 2
          </button>
        </div>

        {isLoaded && (
          <div className={cx('home-camera__tabs-panel-list')}>
            <Formik
              initialValues={coordinateDetail}
              isInitialValid
              enableReinitialize
              validationSchema={getValidationSchema}
              onSubmit={async values => {
                CoordinateApi.postCoordinate({
                  tableNumber,
                  cameraA: values.cameraA,
                  cameraB: values.cameraB,
                })
              }}
            >
              {({ validateForm, submitForm, initialValues, values, setFieldValue }) => {
                return (
                  <FormikForm>
                    <Keyboard
                      onPress={key => {
                        // if (key === keys.ENTER) {
                        //   const nextFieldIndex = inputableKeys.indexOf(lastFocusField) + 1
                        //   let nextIndex = nextFieldIndex > inputableKeys.length - 1 ? 0 : nextFieldIndex
                        // const nextField = inputableKeys[nextIndex]
                        // nextIndex = nextIndex + (detail.level !== CARD_TYPE.VIP && nextField === 'propPlay' ? 1 : 0)
                        //   nextIndex++

                        //   setLastFocusField(inputableKeys[nextIndex])
                        //   return
                        // }

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
                    <div id={TABS.LIVE_VIEW} data-is-active={currentTab === TABS.LIVE_VIEW} className={cx('home-camera__tabs-panel-item')}>
                      {currentTab === TABS.LIVE_VIEW &&
                        cameraList.map(({ id, websocketUrl, rtspUrl }, index) => (
                          <div key={index} className={cx('home-camera__column')}>
                            <h2 className={cx('home-camera__title')}>
                              Camera {index + 1} : {id}
                            </h2>
                            <div className={cx('home-camera__video-wrapper')}>
                              <video width='100%' height='100%' autoPlay id={`video${id}`} />
                              <canvas id={`canvas${id}`} onClick={getSeatCoordinate} />
                            </div>
                          </div>
                        ))}
                    </div>

                    <div
                      id={TABS.SET_CAMERA_1}
                      data-is-active={currentTab === TABS.SET_CAMERA_1}
                      className={cx('home-camera__tabs-panel-item')}
                      data-is-setting
                    >
                      {currentTab === TABS.SET_CAMERA_1 && (
                        <div className={cx('home-camera__column')}>
                          <h2 className={cx('home-camera__title-setting')}>For Setting Auto Clock-in/out Seat Coordinates</h2>
                          <div className={cx('home-camera__video-wrapper-setting')}>
                            <video width='100%' height='100%' autoPlay id={`video__setting__${camera1?.id}`} />
                            <canvas id={`canvas__setting__${camera1?.id}`} onClick={getSeatCoordinate} />
                          </div>
                          <Form.Group>{renderCoordinateDetail(event, values, setFieldValue, currentTab)}</Form.Group>
                        </div>
                      )}
                    </div>

                    <div
                      id={TABS.SET_CAMERA_2}
                      data-is-active={currentTab === TABS.SET_CAMERA_2}
                      className={cx('home-camera__tabs-panel-item')}
                      data-is-setting
                    >
                      {currentTab === TABS.SET_CAMERA_2 && (
                        <div className={cx('home-camera__column')}>
                          <h2 className={cx('home-camera__title-setting')}>For Setting Auto Clock-in/out Seat Coordinates</h2>
                          <div className={cx('home-camera__video-wrapper-setting')}>
                            <video width='100%' height='100%' autoPlay id={`video__setting__${camera2?.id}`} />
                            <canvas id={`canvas__setting__${camera2?.id}`} onClick={getSeatCoordinate} />
                          </div>
                          <Form.Group>{renderCoordinateDetail(event, values, setFieldValue, currentTab)}</Form.Group>
                        </div>
                      )}
                    </div>

                    {currentTab !== TABS.LIVE_VIEW && (
                      <div className={cx('home-camera__footer')}>
                        <Form.Row>
                          <Form.Column className={cx('home-camera-chosen-coordinate-column')}>
                            <Form.Label>{`Chosen Coordinate x:  ${selectSeatCoordinate.x}, y: ${selectSeatCoordinate.y}`}</Form.Label>
                          </Form.Column>
                        </Form.Row>
                        <Button type='submit' disabled={tableNumber === 'Please select table'}>
                          Save
                        </Button>
                      </div>
                    )}
                  </FormikForm>
                )
              }}
            </Formik>
          </div>
        )}
      </div>
    </div>
  )
}

Camera.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    tableNumber: tableSelectors.getTableNumber(state, props),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)
