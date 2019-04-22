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
  'M12,9.07829645 L20.4485356,0.582782666 C21.238282,-0.1722751 22.4826792,-0.156494709 23.2532386,0.618349538 C24.0237982,1.39319378 24.0394913,2.64451042 23.2886088,3.43864831 L14.8400734,11.9341621 L23.3602934,20.501759 C23.8977952,21.0052061 24.1191787,21.7635112 23.9376064,22.4792296 C23.756034,23.194948 23.2004604,23.7539467 22.4888092,23.9369589 C21.7771577,24.1199712 21.022913,23.8978125 20.5219269,23.3576248 L12,14.7900277 L3.47807318,23.3576248 C2.97708706,23.8978125 2.22284229,24.1199712 1.51119094,23.9369589 C0.799539597,23.7539467 0.243966029,23.194948 0.0623936634,22.4792296 C-0.119178702,21.7635112 0.102204792,21.0052061 0.639706593,20.501759 L9.15992664,11.9358784 L0.711391137,3.44036458 C-0.0654221429,2.65038355 -0.0620488199,1.3778918 0.718941804,0.592086508 C1.49993243,-0.193718786 2.76538533,-0.197875356 3.55146449,0.582782666 L12,9.07829645 Z'

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
          <Icon data={crossData} size={24} />
        </button>
      )}
      {shouldShowLoadingOverlay && <div className={cx['modal-content__loading-overlay']} />}
      {children}
    </div>
  )
}

Content.propTypes = propTypes

export default Content
