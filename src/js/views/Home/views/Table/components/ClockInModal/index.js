import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { BigNumber } from 'bignumber.js'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Modal from '../../../../../../components/Modal'

// Styles
import styles from './style.module.scss'

// Variables / Functions
import PERSON_TYPE from '../../../../../../constants/PersonType'
const cx = classnames.bind(styles)

export const propTypes = {
  detectionItem: PropTypes.shape({
    type: PropTypes.oneOf([PERSON_TYPE.ANONYMOUS, PERSON_TYPE.MEMBER]).isRequired,
    snapshot: PropTypes.string.isRequired,
    probableList: PropTypes.arrayOf(
      PropTypes.shape({
        similarity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClockIn: PropTypes.func,
}

function ClockInModal (props) {
  const { detectionItem, isOpened, onClose, onClockIn } = props

  console.log('detectionItem :', detectionItem)
  const renderBody = () => {
    const { type, snapshot, probableList } = detectionItem

    const similarityMatchPercent = 80
    const isProbablyMember = probableList.some(probableItem => new BigNumber(probableItem.similarity).isGreaterThanOrEqualTo(similarityMatchPercent))
    let person = null
    console.log('isProbablyMember :', isProbablyMember)

    switch (type) {
      case PERSON_TYPE.MEMBER:
        person = probableList.sort((probableA, probableB) => new BigNumber(probableA.similarity).comparedTo(probableB.similarity))[0]
        return <Person type={type} person={person} />

      case PERSON_TYPE.ANONYMOUS && isProbablyMember:
        person = { image: snapshot }
        return (
          <div>
            <div>
              <Person type={type} person={person} />
            </div>
            <div>
              {probableList.map(probableItem => (
                <Person type={PERSON_TYPE.MEMBER} title='id' person={probableItem} />
              ))}
            </div>
          </div>
        )

      case PERSON_TYPE.ANONYMOUS && !isProbablyMember:
        person = { image: snapshot }
        return <Person type={type} person={person} />
    }
  }

  return (
    <Modal className={cx('home-table-clock-in-modal')} isOpened={isOpened} onClose={onClose}>
      <Modal.Header>header</Modal.Header>
      <Modal.Body>{isOpened && renderBody()}</Modal.Body>
      <Modal.Footer>
        <Button className={cx('home-table-clock-in-modal__action')} type='button' isFilled={false}>
          Swipe Membercard
        </Button>
        <Button className={cx('home-table-clock-in-modal__action')} type='button' onClick={onClockIn}>
          Confirm Clock-In
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
