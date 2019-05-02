import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../components/Button'
import Form from '../../components/Form'

// Lib MISC

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {}

function Settings (props) {
  const cameraIp1 = '255.123.131.1'
  const cameraIp2 = '255.123.131.2'

  return (
    <div className={cx('home-settings')}>
      <h2 className={cx('home-settings__title')}>Settings</h2>

      <Form>
        <Form.Group width={830}>
          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>Table Number</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>Table - 0001</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>Current Log-in Dealer</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>Dealer Name</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>Current Supervisor</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>Supervisor Name</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>Number of Players at Table</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>28</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>IP of Camera 1</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>{cameraIp1}</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>IP of Camera 2</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Display>{cameraIp2}</Form.Display>
            </Form.Column>
          </Form.Row>

          <Form.Row>
            <Form.Column size='lg'>
              <Form.Label>Match % to member database</Form.Label>
            </Form.Column>
            <Form.Column size='md'>
              <Form.Select>
                <option value='90'>90%</option>
              </Form.Select>
            </Form.Column>
          </Form.Row>
        </Form.Group>
      </Form>

      <div className={cx('home-settings__footer')}>
        <Button type='button' disabled>
          Save
        </Button>
      </div>
    </div>
  )
}

Settings.propTypes = propTypes

export default Settings
