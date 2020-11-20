import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';

import { toast } from 'react-toastify';
import API, { handleApiError } from '../../../lib/api';
import Button from '../../common/Button';

const DownloadRedFoxPdfComponent = ({
  redFoxId,
  setDisplayError,
  buttonLabel,
  buttonSize,
  buttonMode,
  disabled,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      label={buttonLabel}
      size={buttonSize}
      mode={buttonMode}
      icon="file-download"
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        API.get(`red-foxes/${redFoxId}/pdf`, { responseType: 'blob' })
          .then((response) => {
            FileSaver.saveAs(
              new Blob([response.data]),
              `red-fox-${redFoxId}.pdf`,
            );
            toast.success('Report downloading');
          })
          .catch((error) => {
            handleApiError({ error, setDisplayError });
            toast.error('Download report failed');
          })
          .finally(() => setIsLoading(false));
      }}
      disabled={disabled}
    />
  );
};

DownloadRedFoxPdfComponent.propTypes = {
  redFoxId: PropTypes.string.isRequired,
  setDisplayError: PropTypes.func,
  buttonLabel: PropTypes.string,
  buttonMode: PropTypes.string,
  buttonSize: PropTypes.string,
  disabled: PropTypes.bool,
};

DownloadRedFoxPdfComponent.defaultProps = {
  setDisplayError: undefined,
  buttonLabel: 'Download PDF',
  buttonMode: 'default',
  buttonSize: 'm',
  disabled: false,
};

export default DownloadRedFoxPdfComponent;
