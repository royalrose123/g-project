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
const MODE = {
  CLOCK_IN: 'CLOCK_IN',
  SWIPE_MEMBER_CARD: 'SWIPE_MEMBER_CARD',
}

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

  const [mode, setMode] = useState(MODE.CLOCK_IN)
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
      setMode(MODE.CLOCK_IN)
      setSelectedPerson(null)
    }
  }, [shouldRenderContent, detectionItem, person])

  // Clock in
  const renderClockInHeader = () => (
    <Modal.Header>
      {detectionItem.type === PERSON_TYPE.MEMBER ? 'Clock-In' : detectionItem.type === PERSON_TYPE.ANONYMOUS && 'Anonymous Clock-In'}
    </Modal.Header>
  )

  const renderClockInBody = () => {
    let content = null

    switch (true) {
      case detectionItem.type === PERSON_TYPE.MEMBER:
        content = (
          <Person
            type={detectionItem.type}
            mode='compare'
            title='id'
            person={person}
            renderFooter={() => <div className={cx('home-table-clock-in-modal__similarity')}>{Math.floor(person.similarity)}</div>}
          />
        )
        break

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && person.isProbablyMember:
        content = (
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
        break

      case detectionItem.type === PERSON_TYPE.ANONYMOUS && !person.isProbablyMember:
        content = <Person type={detectionItem.type} person={person} />
        break
    }

    return <Modal.Body>{content}</Modal.Body>
  }

  const renderClockInFooter = () => (
    <Modal.Footer>
      <Button className={cx('home-table-clock-in-modal__action')} type='button' isFilled={false} onClick={event => setMode(MODE.SWIPE_MEMBER_CARD)}>
        Swipe Membercard
      </Button>
      <Button className={cx('home-table-clock-in-modal__action')} type='button' onClick={event => onClockIn(event, selectedPerson)}>
        Confirm Clock-In
      </Button>
    </Modal.Footer>
  )

  // Swipe member card
  const renderSwipeMemberCardHeader = () => <Modal.Header>Swipe Membercard</Modal.Header>

  const renderSwipeMemberCardBody = () => {
    return <div>swipe member card</div>
  }

  return (
    <Modal
      className={cx('home-table-clock-in-modal')}
      isOpened={isOpened}
      isBackale={mode === MODE.SWIPE_MEMBER_CARD}
      onClose={onClose}
      onBack={event => setMode(MODE.CLOCK_IN)}
      afterClose={afterClose}
    >
      {shouldRenderContent && (mode === MODE.CLOCK_IN ? renderClockInHeader() : mode === MODE.SWIPE_MEMBER_CARD && renderSwipeMemberCardHeader())}
      {shouldRenderContent && (mode === MODE.CLOCK_IN ? renderClockInBody() : mode === MODE.SWIPE_MEMBER_CARD && renderSwipeMemberCardBody())}
      {shouldRenderContent && (mode === MODE.CLOCK_IN && renderClockInFooter())}
    </Modal>
  )
}

ClockInModal.propTypes = propTypes

export default ClockInModal
