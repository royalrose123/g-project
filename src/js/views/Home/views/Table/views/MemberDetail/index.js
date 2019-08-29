import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { format, formatDistanceStrict } from 'date-fns'
import { BigNumber } from 'bignumber.js'
import { Formik, Form as FormikForm, Field } from 'formik'

// Components
import Person from '../../components/Person'
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
import useFetcher from '../../../../../../lib/effects/useFetcher'
import findStaticPath from '../../../../../../lib/utils/find-static-path'

// Styles
import styles from './style.module.scss'

// Variables / Functions
import CARD_TYPE from '../../../../../../constants/CardType'
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
  // seatedList: PropTypes.array,
  // standingList: PropTypes.array,
  isSelectedPlaceStanding: PropTypes.bool,
  selectedPlaceIndex: PropTypes.number,
}

function MemberDetail (props) {
  const { history, match, onClockOut, isSelectedPlaceStanding, selectedPlaceIndex } = props
  const { path, params } = match
  const { memberId: id } = params
  // const isStanding = useRef('')
  // const selectedIndex = useRef('')

  console.log('memberDetail')
  console.log('isSelectedPlaceStanding', isSelectedPlaceStanding)
  console.log('selectedPlaceIndex', selectedPlaceIndex)

  const initialValues = {
    playType: '0',
    propPlay: '',
    averageBet: '',
    overallWinner: 'player',
    actualWin: '',
    drop: '',
    overage: '',
    tableName: '',
  }

  const inputableKeys = Object.keys(initialValues).filter(key => key !== 'playType' && key !== 'overallWinner')

  const [currentTab, setCurrentTab] = useState(TABS.BETTING_RECORD)
  const [lastFocusField, setLastFocusField] = useState('actualWin')

  const { isLoaded, response: detail } = useFetcher(null, MemberApi.fetchMemberDetailById, { id })

  // const [isStanding, setIsStanding] = useState()
  // const [selectedIndex, setSelectedIndex] = useState()
  // const isStanding = useRef('')
  // const selectedIndex = useRef('')

  // setIsStanding(isSelectedPlaceStanding)
  // setSelectedIndex(selectedPlaceIndex)

  // useEffect(() => {
  //   if (isSelectedPlaceStanding !== undefined && selectedPlaceIndex !== undefined) {
  //     isStanding.current = isSelectedPlaceStanding
  //     selectedIndex.current = selectedPlaceIndex
  //     console.log(' isStanding.current ', isStanding.current)
  //     console.log('seatedList', seatedList)
  //     console.log('standingList', standingList)
  //   }
  // }, [isSelectedPlaceStanding, seatedList, selectedPlaceIndex, standingList])

  // if (isStanding.current !== undefined && selectedIndex.current !== undefined) {
  //   const memberImg = standingList[selectedIndex.current].image
  //   console.log('standing memberImg', memberImg)
  //   detail.image = memberImg
  // } else {
  //   const memberImg = seatedList[selectedIndex.current].image
  //   console.log('seated memberImg', memberImg)
  //   detail.image = memberImg
  // }

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)

  return isLoaded ? (
    <Formik initialValues={initialValues} isInitialValid onSubmit={onClockOut}>
      {({ values, setFieldValue }) => {
        return (
          <FormikForm>
            <Layout className={cx('home-table-member-detail')}>
              <Keyboard
                onPress={key => {
                  if (key === keys.ENTER) {
                    const nextFieldIndex = inputableKeys.indexOf(lastFocusField) + 1
                    let nextIndex = nextFieldIndex > inputableKeys.length - 1 ? 0 : nextFieldIndex
                    const nextField = inputableKeys[nextIndex]
                    nextIndex = nextIndex + (detail.level !== CARD_TYPE.VIP && nextField === 'propPlay' ? 1 : 0)

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

              <Layout.Header>
                <div className={cx('home-table-member-detail__title-wrapper')}>
                  <Icon
                    className={cx('home-table-member-detail__icon')}
                    name='cross'
                    mode='01'
                    onClick={event => history.push(findStaticPath(path))}
                  />
                  <h1 className={cx('home-table-member-detail__title')}>Clock-out / Details</h1>
                </div>
                <Button type='submit' disabled={detail.level === CARD_TYPE.VIP ? !(values.actualWin && values.propPlay) : !values.actualWin}>
                  Clock-Out
                </Button>
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
                              name='playType'
                              render={({ field }) => (
                                <Form.Select {...field}>
                                  <option value='0'>CASH</option>
                                  <option value='5'>TMAB</option>
                                  <option value='6'>ABT</option>
                                </Form.Select>
                              )}
                            />
                          </Form.Column>
                        </Form.Row>

                        <Form.Row>
                          <Form.Column size='sm'>
                            <Form.Label>{detail.level === CARD_TYPE.VIP && '* '}Prop Play</Form.Label>
                          </Form.Column>
                          <Form.Column size='md'>
                            <Form.Row style={{ margin: 0 }}>
                              <Field
                                name='propPlay'
                                render={({ field }) => (
                                  <Form.Input
                                    isFocused={lastFocusField === field.name}
                                    onFocus={event => setLastFocusField(field.name)}
                                    disabled={detail.level !== CARD_TYPE.VIP}
                                    {...field}
                                  />
                                )}
                              />
                              <div className={cx('home-table-member-detail__all-games')}>/ {detail.playTimes}</div>
                            </Form.Row>
                            <div className={cx('home-table-member-detail__percentage')}>
                              {values.propPlay.length > 0 && Math.floor(new BigNumber(values.propPlay).dividedBy(detail.playTimes).multipliedBy(100))}
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
                                <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
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
                            <Form.Label>* Actual Win</Form.Label>
                          </Form.Column>
                          <Form.Column size='md'>
                            <Field
                              name='actualWin'
                              render={({ field }) => (
                                <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
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
                                <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
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
                                <Form.Input isFocused={lastFocusField === field.name} onFocus={event => setLastFocusField(field.name)} {...field} />
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
  ) : null
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
