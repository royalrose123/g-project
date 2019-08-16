import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames/bind'
import { checkClockState } from '../../../Settings/'

// Components
import Button from '../../../../../../components/Button'

// Modules
import { operations as tableOperations } from '../../../../../../lib/redux/modules/table'

// Lib MISC
import SettingsApi from '../../../../../../lib/api/Setting'
// import useFetcher from '../../../../../../lib/effects/useFetcher'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  className: PropTypes.string,
  popupContent: PropTypes.string,
  display: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  formikValues: PropTypes.object,
  setClockPreviousState: PropTypes.func,
  changeClockState: PropTypes.func,
}

// const checkClockState = (memberClock, anonymousClock) => {
//   if (memberClock === false && anonymousClock === false) {
//     return 'manualClock'
//   } else if (memberClock === false && anonymousClock === true) {
//     return 'autoAnonymous'
//   } else if (memberClock === true && anonymousClock === false) {
//     return 'autoMember'
//   } else if (memberClock === true && anonymousClock === true) {
//     return 'autoClock'
//   }
// }

function Popup (props) {
  const { popupContent, onCancel, onConfirm, setClockPreviousState, display, formikValues, changeClockState, ...restProps } = props
  useEffect(() => {})
  return popupContent ? (
    <div className={cx('home-setting-popup-layout')} display={display} {...restProps}>
      <div className={cx('home-setting-popup-dialog')}>
        <p className={cx('home-setting-popup-title')}>{popupContent}</p>
        <p className={cx('home-setting-popup-content')}>
          Once your press "CONFIRM", the system will clear the "TABLE" and {popupContent.toLowerCase()}
        </p>
        <Button type='button' onClick={() => onCancel()} isFilled={false} size={'md'}>
          CANCEL
        </Button>
        <Button
          type='button'
          onClick={() => {
            onConfirm()
            setClockPreviousState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))
            changeClockState(checkClockState(formikValues.autoSettings.autoClockMember, formikValues.autoSettings.autoClockAnonymous))
            SettingsApi.postSettingDetail({
              systemSettings: formikValues.systemSettings,
              autoSettings: formikValues.autoSettings,
              defaultRecord: formikValues.defaultRecord,
            })
          }}
          size={'md'}
        >
          CONFIRM
        </Button>
      </div>
    </div>
  ) : null
}

Popup.propTypes = propTypes

const mapStateToProps = (state, props) => {
  return {
    // clockState: tableSelectors.getClockState(state, props),
  }
}

const mapDispatchToProps = {
  changeClockState: tableOperations.changeClockState,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Popup)
