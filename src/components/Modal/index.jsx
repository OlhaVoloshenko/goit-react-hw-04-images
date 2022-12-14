import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalStyle, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, largeImageURL, tags }) => {
  useEffect(() => {
    const onEscKey = event => {
      if (event.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscKey);

    return () => {
      window.removeEventListener('keydown', onEscKey);
    };
  }, [onClose]);

  const handleBackdrop = event => {
    if (event.currentTarget === event.target) onClose();
  };
  return createPortal(
    <Overlay onClick={handleBackdrop}>
      <ModalStyle>
        <img src={largeImageURL} alt={tags} />;
      </ModalStyle>
    </Overlay>,
    modalRoot
  );
};

Modal.PropTypes = {
  onClose: PropTypes.func,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.array,
};
