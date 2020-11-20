import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import API, { handleApiError } from '../../../lib/api';
import Button from '../../common/Button';

const DuplicateRedFoxComponent = ({
  id,
  onRedFoxDuplicated,
  setDisplayError,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      label="Duplicate"
      size="s"
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await API.post(`red-foxes/duplicate/${id}`)
          .then((res) => {
            if (onRedFoxDuplicated) onRedFoxDuplicated(res.data._id);
            toast.success('Red Fox duplicated');
          })
          .catch((error) => {
            handleApiError({ error, setDisplayError });
            toast.error('Duplicate Red Fox failed');
          })
          .finally(() => setIsLoading(false));
      }}
    />
  );
};

DuplicateRedFoxComponent.propTypes = {
  id: PropTypes.string.isRequired,
  onRedFoxDuplicated: PropTypes.func,
  setDisplayError: PropTypes.func,
};

DuplicateRedFoxComponent.defaultProps = {
  onRedFoxDuplicated: undefined,
  setDisplayError: undefined,
};

export default DuplicateRedFoxComponent;
