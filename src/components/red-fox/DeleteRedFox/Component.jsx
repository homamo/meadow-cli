import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import API, { handleApiError } from '../../../lib/api';
import Button from '../../common/Button';

const DeleteRedFoxComponent = ({ id, onRedFoxDeleted, setDisplayError }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      label="Delete"
      size="s"
      mode="danger"
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await API.post(`red-foxes/delete/${id}`)
          .then(() => {
            if (onRedFoxDeleted) onRedFoxDeleted(id);
            toast.success('Red Fox deleted');
          })
          .catch((error) => {
            handleApiError({ error, setDisplayError });
            toast.error('Delete Red Fox failed');
          })
          .finally(() => setIsLoading(false));
      }}
    />
  );
};

DeleteRedFoxComponent.propTypes = {
  id: PropTypes.string.isRequired,
  onRedFoxDeleted: PropTypes.func,
  setDisplayError: PropTypes.func,
};

DeleteRedFoxComponent.defaultProps = {
  onRedFoxDeleted: undefined,
  setDisplayError: undefined,
};

export default DeleteRedFoxComponent;
