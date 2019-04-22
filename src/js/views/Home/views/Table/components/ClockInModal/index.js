import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Button from '../../../../../../components/Button'
import Modal from '../../../../../../components/Modal'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  person: PropTypes.object,
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

function ClockInModal (props) {
  const { person, isOpened, onClose } = props

  console.log('person :', person)

  return (
    <Modal className={cx('home-table-clock-in-modal')} isOpened={isOpened} onClose={onClose}>
      <Modal.Header>header</Modal.Header>
      <Modal.Body>body</Modal.Body>
      <Modal.Footer>
        <Button className={cx('home-table-clock-in-modal__action')} type='button' isFilled={false}>
          Swipe Membercard
        </Button>
        <Button className={cx('home-table-clock-in-modal__action')} type='button'>
          Confirm Clock-In
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
