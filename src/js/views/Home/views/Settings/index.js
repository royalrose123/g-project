import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
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
      <Form width={830}>
        <Form.Group>
          <Form.Row>
            <Form.Label>Table Number</Form.Label>
            <Form.Control />
          </Form.Row>

          <Form.Row>
            <Form.Label>Current Log-in Dealer</Form.Label>
            <Form.Display>Ben Ryan</Form.Display>
          </Form.Row>

          <Form.Row>
            <Form.Label>Current Supervisor</Form.Label>
            <Form.Control />
          </Form.Row>

          <Form.Row>
            <Form.Label>Number of Players at Table</Form.Label>
            <Form.Display>28</Form.Display>
          </Form.Row>

          <Form.Row>
            <Form.Label>IP of Camera 1</Form.Label>
            <Form.Display>{cameraIp1}</Form.Display>
          </Form.Row>

          <Form.Row>
            <Form.Label>IP of Camera 2</Form.Label>
            <Form.Display>{cameraIp2}</Form.Display>
          </Form.Row>

          <Form.Row>
            <Form.Label>Match % to member database</Form.Label>
            <Form.Control />
          </Form.Row>
        </Form.Group>
      </Form>
    </div>
  )
}

Settings.propTypes = propTypes

export default Settings
