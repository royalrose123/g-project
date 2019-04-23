import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../../../components/Button'
import Icon from '../../../../../../components/Icon'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'

// Lib MISC
import findStaticPath from '../../../../../../lib/utils/find-static-path'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const TABS = {
  BETTING_RECORD: 'betting-record',
  CUSTOMER_INFO: 'customer-info',
}

export const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  member: PropTypes.object,
}

function MemberDetail (props) {
  const { history, match, member } = props
  const { path } = match

  const [currentTab, setCurrentTab] = useState(TABS.BETTING_RECORD)

  console.log('MemberDetail member :', member)

  const onTabItemClick = event => setCurrentTab(event.currentTarget.dataset.for)

  return (
    <Layout className={cx('home-table-member-detail')}>
      <Layout.Header>
        <div className={cx('home-table-member-detail__title-wrapper')}>
          <Icon className={cx('home-table-member-detail__icon')} name='cross' mode='01' onClick={event => history.push(findStaticPath(path))} />
          <h1 className={cx('home-table-member-detail__title')}>Clock-out / Details</h1>
        </div>
        <Button type='button'>Clock-Out</Button>
      </Layout.Header>

      <Layout.Content className={cx('home-table-member-detail__content')} style={{ color: '#fff' }}>
        <div>image</div>

        <div className={cx('home-table-member-detail__tabs')}>
          <div className={cx('home-table-member-detail__tabs-list')}>
            <button
              className={cx('home-table-member-detail__tabs-item')}
              type='button'
              data-for={TABS.BETTING_RECORD}
              data-is-active={currentTab === TABS.BETTING_RECORD}
              onClick={onTabItemClick}
            >
              Betting Record
            </button>
            <button
              className={cx('home-table-member-detail__tabs-item')}
              type='button'
              data-for={TABS.CUSTOMER_INFO}
              data-is-active={currentTab === TABS.CUSTOMER_INFO}
              onClick={onTabItemClick}
            >
              Customer Info
            </button>
          </div>

          <div className={cx('home-table-member-detail__tabs-panel-list')}>
            <div
              id={TABS.BETTING_RECORD}
              data-is-active={currentTab === TABS.BETTING_RECORD}
              className={cx('home-table-member-detail__tabs-panel-item')}
            >
              <Form.Group width={640}>
                <Form.Row>
                  <Form.Label>Play Type</Form.Label>
                  <Form.Control />
                </Form.Row>

                <Form.Row>
                  <Form.Label>Prop Play</Form.Label>
                  <Form.Control />
                </Form.Row>

                <Form.Row>
                  <Form.Label>Average Bet</Form.Label>
                  <Form.Control />
                </Form.Row>

                <Form.Row>
                  <Form.Label>Who Win</Form.Label>
                  <Form.Radio.Group>
                    <Form.Radio checked>Player</Form.Radio>
                    <Form.Radio>Dealer</Form.Radio>
                  </Form.Radio.Group>
                </Form.Row>
              </Form.Group>

              <Form.Group width={640}>
                <Form.Row>
                  <Form.Label>Action Win/Loss</Form.Label>
                  <Form.Group width={300}>
                    <Form.Radio.Group>
                      <Form.Radio checked>123</Form.Radio>
                      <Form.Radio>456</Form.Radio>
                    </Form.Radio.Group>
                    <Form.Control style={{ marginTop: 30 }} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Label>Drop</Form.Label>
                  <Form.Control />
                </Form.Row>

                <Form.Row>
                  <Form.Label>Overage</Form.Label>
                  <Form.Control />
                </Form.Row>
              </Form.Group>
            </div>
            <div
              id={TABS.CUSTOMER_INFO}
              data-is-active={currentTab === TABS.CUSTOMER_INFO}
              className={cx('home-table-member-detail__tabs-panel-item')}
            >
              <Form.Group width={640}>
                <Form.Row>
                  <Form.Label>Customer ID</Form.Label>
                  <Form.Display>#1234567</Form.Display>
                </Form.Row>

                <Form.Row>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Display>Mark</Form.Display>
                </Form.Row>

                <Form.Row>
                  <Form.Label>Gender</Form.Label>
                  <Form.Display>Mail</Form.Display>
                </Form.Row>
              </Form.Group>

              <Form.Group width={640}>
                <Form.Row>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Display>1990/01/01</Form.Display>
                </Form.Row>

                <Form.Row>
                  <Form.Label>Age</Form.Label>
                  <Form.Display>30</Form.Display>
                </Form.Row>

                <Form.Row>
                  <Form.Label>Passport Number</Form.Label>
                  <Form.Display>123456789</Form.Display>
                </Form.Row>
              </Form.Group>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

MemberDetail.propTypes = propTypes

export default MemberDetail
