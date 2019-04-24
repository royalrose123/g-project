import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Modal from '../../../../../../components/Modal'

// Lib MISC
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'

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
  afterClose: PropTypes.func.isRequired,
  onClockIn: PropTypes.func,
}

function ClockInModal (props) {
  const { detectionItem, isOpened, onClose, afterClose, onClockIn } = props

  const shouldRenderContent = detectionItem !== null
  const person = shouldRenderContent ? getPersonByType(detectionItem.type, detectionItem) : null

  const renderHeader = () =>
    detectionItem.type === PERSON_TYPE.MEMBER ? 'Clock-In' : detectionItem.type === PERSON_TYPE.ANONYMOUS && 'Anonymous Clock-In'

  const renderBody = () => {
    const { type, probableList } = detectionItem

    switch (true) {
      case type === PERSON_TYPE.MEMBER:
        return <Person type={type} mode='compare' title='id' person={person} renderFooter={() => <span>{person.similarity}</span>} />

      case type === PERSON_TYPE.ANONYMOUS && person.isProbablyMember:
        return (
          <div>
            <div>
              <Person type={type} person={person} />
            </div>
            <div>
              <h4>Probale Matches</h4>
              {probableList.map((probableItem, index) => (
                <Person key={index} type={PERSON_TYPE.MEMBER} title='id' person={probableItem} />
              ))}
            </div>
          </div>
        )

      case type === PERSON_TYPE.ANONYMOUS && !person.isProbablyMember:
        return <Person type={type} person={person} />
    }
  }

  return (
    <Modal className={cx('home-table-clock-in-modal')} isOpened={isOpened} onClose={onClose} afterClose={afterClose}>
      <Modal.Header>{shouldRenderContent && renderHeader()}</Modal.Header>
      <Modal.Body>{shouldRenderContent && renderBody()}</Modal.Body>
      <Modal.Footer>
        <Button className={cx('home-table-clock-in-modal__action')} type='button' isFilled={false}>
          Swipe Membercard
        </Button>
        <Button className={cx('home-table-clock-in-modal__action')} type='button' onClick={event => onClockIn(event, person)}>
          Confirm Clock-In
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
