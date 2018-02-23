import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';
import PropTypes from 'prop-types';
import CloseButton from './components/CloseButton';
import { SCROLL_LOCKED_CLASSNAME } from './constants';
import './styles/main.css';

export default class Modal extends React.PureComponent {
  constructor(props) {
    super(props);

    const { domElement } = props;

    if (typeof domElement === 'string') {
      this.domElement = document.querySelector(domElement);
    } else {
      this.domElement = domElement;
    }

    this.onEscapePressed = this.onEscapePressed.bind(this);

    this.state = {};
  }

  componentDidUpdate(prevProps) {
    const { isOpen, closeOnEscapePress } = this.props;
    const { prevIsOpen } = prevProps;

    if (!isOpen) this.unlockBodyScroll();
    if (closeOnEscapePress && isOpen !== prevIsOpen) {
      if (isOpen) {
        document.body.addEventListener('keydown', this.onEscapePressed);
      } else {
        document.body.removeEventListener('keydown', this.onEscapePressed);
      }
    }
  }

  onEscapePressed(event) {
    if (event.keyCode === 27) {
      this.props.onClose();
    }
  }

  unlockBodyScroll() {
    this.domElement.classList.remove(SCROLL_LOCKED_CLASSNAME);
  }

  lockBodyScroll() {
    this.domElement.classList.add(SCROLL_LOCKED_CLASSNAME);
  }

  renderModalMarkup() {
    const {
      children,
      onClose,
      closeOnOverlayClick,
      showCloseButton,
      maxWidth,
      backgroundColor,
      overlayColor,
      closeButtonColor,
    } = this.props;

    const onOverlayClick = (event) => {
      event.stopPropagation();
      if (closeOnOverlayClick) {
        onClose();
      }
    };

    const onModalClick = (event) => {
      event.stopPropagation();
    };

    return (
      <div
        onClick={onOverlayClick}
        role="presentation"
        className="modal-overlay modal-overlay--animated"
        style={{ backgroundColor: overlayColor }}
      >
        <div
          onClick={onModalClick}
          className="modal-container modal-container--animated"
          style={{ backgroundColor, maxWidth }}
          role="presentation"
        >
          {showCloseButton &&
            <CloseButton onClose={onClose} closeButtonColor={closeButtonColor} />
          }
          <div className="modal-content">
            { children }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isOpen } = this.props;

    if (!isOpen) return null;

    this.lockBodyScroll();

    if (ReactDOM.createPortal) {
      console.log('16')
      return ReactDOM.createPortal(this.renderModalMarkup(), this.domElement);
    }

    console.log('15');
    return (
      <Portal isOpened>
        { this.renderModalMarkup() }
      </Portal>
    );
  }
}

Modal.defaultProps = {
  domElement: 'body',
  isOpen: false,
  onClose: () => {},
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscapePress: true,
  maxWidth: '640px',
  backgroundColor: '#FFFFFF',
  overlayColor: 'rgba(0,0,0,0.3)',
  closeButtonColor: '#000000',
};

Modal.propTypes = {
  domElement: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscapePress: PropTypes.bool,
  maxWidth: PropTypes.string,
  backgroundColor: PropTypes.string,
  overlayColor: PropTypes.string,
  closeButtonColor: PropTypes.string,
};
