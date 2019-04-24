import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Person from '../Person'
import Button from '../../../../../../components/Button'
import Modal from '../../../../../../components/Modal'

// Lib MISC
import getPersonByType from '../../../../../../lib/helpers/get-person-by-type'
import useDeepCompareEffect from '../../../../../../lib/effects/useDeepCompareEffect'

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

  const [selectedPerson, setSelectedPerson] = useState(null)

  const shouldRenderContent = detectionItem !== null
  const person = shouldRenderContent ? getPersonByType(detectionItem.type, detectionItem) : {}

  useDeepCompareEffect(() => {
    if (shouldRenderContent) {
      setSelectedPerson({
        ...person,
        identify: detectionItem.type === PERSON_TYPE.MEMBER ? person.id : detectionItem.type === PERSON_TYPE.ANONYMOUS && PERSON_TYPE.ANONYMOUS,
      })
    } else {
      setSelectedPerson(null)
    }
  }, [shouldRenderContent, detectionItem, person])

  const renderHeader = () =>
    detectionItem.type === PERSON_TYPE.MEMBER ? 'Clock-In' : detectionItem.type === PERSON_TYPE.ANONYMOUS && 'Anonymous Clock-In'

  const renderBody = () => {
    switch (true) {
      case detectionItem.type === PERSON_TYPE.MEMBER:
        return (
          <Person
            type={detectionItem.type}
            mode='compare'
            title='id'
            person={person}
            renderFooter={() => <div className={cx('home-table-clock-in-modal__similarity')}>{Math.floor(person.similarity)}</div>}
          />
        )

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && person.isProbablyMember:
        return (
          <div className={cx('home-table-clock-in-modal__content')}>
            <Person
              type={detectionItem.type}
              person={person}
              isSelected={selectedPerson && selectedPerson.identify === PERSON_TYPE.ANONYMOUS}
              onClick={event => setSelectedPerson({ ...person, identify: PERSON_TYPE.ANONYMOUS })}
            />
            <div className={cx('home-table-clock-in-modal__probable-list-wrapper')}>
              <h4 className={cx('home-table-clock-in-modal__probable-list-title')}>Probale Matches</h4>
              <div className={cx('home-table-clock-in-modal__probable-list')}>
                {detectionItem.probableList.map((probableItem, index) => (
                  <div key={index} className={cx('home-table-clock-in-modal__probable-item')}>
                    <Person
                      type={PERSON_TYPE.MEMBER}
                      title='id'
                      person={probableItem}
                      isSelected={selectedPerson && selectedPerson.identify === probableItem.id}
                      onClick={event => setSelectedPerson({ ...probableItem, identify: probableItem.id })}
                      renderFooter={() => <div className={cx('home-table-clock-in-modal__similarity')}>{Math.floor(probableItem.similarity)}</div>}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && !person.isProbablyMember:
        return <Person type={detectionItem.type} person={person} />
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
        <Button className={cx('home-table-clock-in-modal__action')} type='button' onClick={event => onClockIn(event, selectedPerson)}>
          Confirm Clock-In
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
