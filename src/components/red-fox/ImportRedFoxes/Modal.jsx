import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import ImportRedFoxesForm from './Form';

const ImportRedFoxesModal = ({ buttonLabel, successAction }) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <Button
        size="s"
        label={buttonLabel || 'Import Red Foxes'}
        onClick={() => setModalIsOpen(true)}
      />
      <Modal
        heading="Import Red Foxes"
        isOpen={modalIsOpen}
        closeAction={() => setModalIsOpen(false)}
        contentLabel="Import Red Foxes"
      >
        <p>Import Red Fox data from a CSV</p>
        <ImportRedFoxesForm
          successAction={() => {
            setModalIsOpen(false);
            if (successAction) successAction();
          }}
          cancelAction={() => setModalIsOpen(false)}
        />
      </Modal>
    </>
  );
};

ImportRedFoxesModal.defaultProps = {
  buttonLabel: undefined,
  successAction: undefined,
};

ImportRedFoxesModal.propTypes = {
  buttonLabel: PropTypes.string,
  successAction: PropTypes.func,
};

export default ImportRedFoxesModal;
