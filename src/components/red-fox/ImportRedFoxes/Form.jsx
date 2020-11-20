import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { checkFileIsCsv } from '@homamo/meadow-utils';

import API, { handleApiError } from '../../../lib/api';

import Error from '../../common/ErrorMessage';
import Button, { ButtonGroup } from '../../common/Button';
import FileInput from '../../common/FileInput';

const ImportRedFoxesForm = ({ successAction, cancelAction }) => {
  const [displayError, setDisplayError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInput = React.useRef(null);

  const uploadFile = async (event) => {
    event.preventDefault();
    const data = new FormData();

    if (fileInput && fileInput.current) {
      const { files } = fileInput.current;
      const file = files && files[0];

      setIsLoading(true);

      if (!file) {
        setIsLoading(false);
        return setDisplayError({
          message: 'You need to select a CSV file to upload',
        });
      }

      const fileIsCsv = checkFileIsCsv(file);

      if (!fileIsCsv) {
        setIsLoading(false);
        return setDisplayError({
          message: 'Invalid file type - CSV required',
        });
      }

      if (fileIsCsv) {
        data.append('file', file);

        await API.post('red-foxes/import', data, {
          timeout: 1000 * 60 * 60 * 1, // 1 hour
        })
          .then((res) => {
            successAction(res.data);
            toast.success('Red Foxes imported');
          })
          .catch((error) => {
            handleApiError({ error, setDisplayError });
          })
          .finally(() => setIsLoading(false));
      }
    }

    return true;
  };

  return (
    <>
      <Error error={displayError} />
      <form
        onSubmit={(event) => uploadFile(event)}
        encType="multipart/form-data"
        disabled={isLoading}
      >
        <FileInput name="csvFile" label="Choose a csv" ref={fileInput} />
        <ButtonGroup>
          <Button
            type="submit"
            mode="primary"
            label="Upload a file"
            isLoading={isLoading}
            loadingLabel="Uploading"
          />
          <Button label="Cancel" onClick={() => cancelAction()} />
        </ButtonGroup>
      </form>
    </>
  );
};

ImportRedFoxesForm.defaultProps = {
  successAction: undefined,
  cancelAction: undefined,
};

ImportRedFoxesForm.propTypes = {
  successAction: PropTypes.func,
  cancelAction: PropTypes.func,
};

export default ImportRedFoxesForm;
