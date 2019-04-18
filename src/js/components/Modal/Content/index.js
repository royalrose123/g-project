import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

// Components
import Icon from '../Icon'

// Styles
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)
const crossData =
  'M7,5.29567293 L11.9283124,0.339956555 C12.3889978,-0.100493808 13.1148962,-0.09128858 13.5643892,0.360703897 C14.0138823,0.812696374 14.0230366,1.54263108 13.5850218,2.00587818 L8.65670946,6.96159456 L13.6268378,11.9593594 C13.9403805,12.2530369 14.0695209,12.6953815 13.9636037,13.1128839 C13.8576865,13.5303863 13.5336019,13.8564689 13.118472,13.963226 C12.703342,14.0699832 12.2633659,13.9403906 11.971124,13.6252811 L7,8.62751618 L2.02887602,13.6252811 C1.73663412,13.9403906 1.296658,14.0699832 0.881528049,13.963226 C0.466398098,13.8564689 0.142313517,13.5303863 0.0363963036,13.1128839 C-0.0695209097,12.6953815 0.059619462,12.2530369 0.373162179,11.9593594 L5.34329054,6.96259571 L0.414978163,2.00687934 C-0.0381629167,1.54605707 -0.0361951449,0.803770218 0.419382719,0.345383796 C0.874960583,-0.113002625 1.61314144,-0.115427291 2.07168762,0.339956555 L7,5.29567293 Z'

export const propTypes = {
  shouldShowCloseButton: PropTypes.bool.isRequired,
  shouldShowLoadingOverlay: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

function Content (props) {
  const { shouldShowCloseButton, shouldShowLoadingOverlay, onClose, className, children, ...restProps } = props

  return (
    <div className={cx(className, 'modal-content')} {...restProps}>
      {shouldShowCloseButton && (
        <button className={cx('modal-content__close-button')} onClick={onClose}>
          <Icon data={crossData} size={14} />
        </button>
      )}
      {shouldShowLoadingOverlay && <div className={cx['modal-content__loading-overlay']} />}
      {children}
    </div>
  )
}

Content.propTypes = propTypes

export default Content
