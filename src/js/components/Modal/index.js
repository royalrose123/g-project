import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Transition, config } from 'react-spring/renderprops'
import classnames from 'classnames/bind'

// Componennts
import Overlay from '../Overlay'
import Body from './Body'
import Content from './Content'
import Footer from './Footer'
import Header from './Header'

// Style
import styles from './style.module.scss'

// Variables / Functions
const cx = classnames.bind(styles)

export const propTypes = {
  isOpened: PropTypes.bool.isRequired,
  isClosable: PropTypes.bool.isRequired,
  isBackale: PropTypes.bool,
  isLoading: PropTypes.bool,
  shouldShowOverlayOnLoading: PropTypes.bool,
  shouldCloseOnOverlayClick: PropTypes.bool,
  beforeOpen: PropTypes.func,
  afterClose: PropTypes.func,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  appendTarget: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.instanceOf(Element)]).isRequired,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
}

export const defaultProps = {
  isOpened: false,
  isClosable: true,
  isBackale: false,
  isLoading: false,
  shouldShowOverlayOnLoading: true,
  shouldCloseOnOverlayClick: true,
  onClose: () => null,
  onBack: () => null,
  appendTarget: document.body,
}

function Modal (props) {
  const {
    isOpened,
    isClosable,
    isBackale,
    isLoading,
    shouldShowOverlayOnLoading,
    shouldCloseOnOverlayClick,
    beforeOpen,
    afterClose,
    onClose,
    onBack,
    appendTarget,
    className,
    ...restProps
  } = props

  return (
    <Transition
      onStart={beforeOpen}
      onRest={(item, state) => !item && state === 'update' && typeof afterClose === 'function' && afterClose()}
      items={isOpened}
      from={{ opacity: 0, scale: 'scale(0.5)' }}
      enter={{ opacity: 1, scale: 'scale(1)' }}
      leave={{ opacity: 0, scale: 'scale(0.5)' }}
      config={config.stiff}
    >
      {isOpened =>
        isOpened &&
        (({ opacity, scale }) =>
          ReactDOM.createPortal(
            <div className={cx('modal')} style={{ opacity }}>
              <Content
                className={cx(className)}
                style={{ transform: scale }}
                shouldShowCloseButton={!isLoading && isClosable}
                shouldShowBackButton={!isLoading && isBackale}
                shouldShowLoadingIcon={isLoading}
                shouldShowLoadingOverlay={shouldShowOverlayOnLoading && isLoading}
                onClose={onClose}
                onBack={onBack}
                {...restProps}
              />
              <Overlay isShowed={isOpened} shouldCreatePortal={false} onClick={!isLoading && shouldCloseOnOverlayClick ? onClose : null} />
            </div>,
            appendTarget
          ))
      }
    </Transition>
  )
}

Modal.propTypes = propTypes
Modal.defaultProps = defaultProps

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

export default Modal
