import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import ExportRedFoxesForm from './Form';

const ExportRedFoxesModal = ({ buttonLabel }) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <Button
        size="s"
        label={buttonLabel || 'Export Red Foxes'}
        onClick={() => setModalIsOpen(true)}
      />
      <Modal
        heading="Export Red Foxes"
        isOpen={modalIsOpen}
        closeAction={() => setModalIsOpen(false)}
        contentLabel="Export Red Foxes"
      >
        <p>Export all Red Fox data as a CSV</p>
        <ExportRedFoxesForm
          successAction={() => setModalIsOpen(false)}
          cancelAction={() => setModalIsOpen(false)}
        />
      </Modal>
    </>
  );
};

ExportRedFoxesModal.defaultProps = {
  buttonLabel: undefined,
};

ExportRedFoxesModal.propTypes = {
  buttonLabel: PropTypes.string,
};

export default ExportRedFoxesModal;
