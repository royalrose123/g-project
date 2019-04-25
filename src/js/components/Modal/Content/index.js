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
const arrowData =
  'M0.416403785,11.161609 L12.4921136,0.355681016 C13.022082,-0.118560339 13.8548896,-0.118560339 14.3470032,0.355681016 C14.8769716,0.829922371 14.8769716,1.57515879 14.3470032,2.01552576 L4.50473186,10.8228652 L34.6750789,10.8228652 C35.3943218,10.8228652 36,11.3648553 36,12.0084686 C36,12.6520819 35.3943218,13.194072 34.6750789,13.194072 L4.50473186,13.194072 L14.3470032,22.0014114 C14.8769716,22.4756528 14.8769716,23.2208892 14.3470032,23.6612562 C14.0820189,23.8983769 13.7413249,24 13.4006309,24 C13.0599369,24 12.7192429,23.8983769 12.4542587,23.6612562 L0.378548896,12.8553282 C0.113564669,12.6182075 0,12.3472124 0,12.0084686 C0,11.6697248 0.189274448,11.3987297 0.416403785,11.161609 Z'

export const propTypes = {
  shouldShowCloseButton: PropTypes.bool.isRequired,
  shouldShowBackButton: PropTypes.bool.isRequired,
  shouldShowLoadingOverlay: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

function Content (props) {
  const { shouldShowCloseButton, shouldShowBackButton, shouldShowLoadingOverlay, onClose, onBack, className, children, ...restProps } = props

  return (
    <div className={cx(className, 'modal-content')} {...restProps}>
      {shouldShowCloseButton && !shouldShowBackButton && (
        <button className={cx('modal-content__button')} onClick={onClose}>
          <Icon data={crossData} size={24} />
        </button>
      )}
      {shouldShowBackButton && (
        <button className={cx('modal-content__button')} onClick={onBack}>
          <Icon data={arrowData} width={36} height={24} />
        </button>
      )}
      {shouldShowLoadingOverlay && <div className={cx['modal-content__loading-overlay']} />}
      {children}
    </div>
  )
}

Content.propTypes = propTypes

export default Content
