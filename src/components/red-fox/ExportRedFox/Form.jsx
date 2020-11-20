import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { saveFile } from '@homamo/meadow-utils';

import API, { handleApiError } from '../../../lib/api';

import Error from '../../common/ErrorMessage';
import Button, { ButtonGroup } from '../../common/Button';
import Form from '../../common/Form';
import SelectInput from '../../common/SelectInput';

const validationSchema = Yup.object().shape({
  // status: Yup.string().required('You need to select a status'),
});

const ExportRedFoxesForm = ({ successAction, cancelAction }) => {
  const [displayError, setDisplayError] = React.useState();

  return (
    <>
      <Error error={displayError} />
      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          const params = { status: values.status };
          await API.get('red-foxes/export', {
            responseType: 'blob',
            params,
            headers: {
              Accept: 'text/csv',
            },
          })
            .then((res) => {
              saveFile({ headers: res.headers, file: res.data });
              toast.success('Red Fox data exported');
              successAction();
            })
            .catch((error) => {
              handleApiError({ error, setDisplayError });
            })
            .finally(() => setSubmitting(false));
        }}
        initialValues={{
          status: undefined,
        }}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
                <Field
                  label="Status"
                  id="status"
                  name="status"
                  component={SelectInput}
                  options={[
                    {
                      value: 'DRAFT',
                      label: 'Draft',
                    },
                    {
                      value: 'PUBLISHED',
                      label: 'Published',
                    },
                  ]}
                  placeholder="Select a status"
                />
                <ButtonGroup>
                  <Button
                    label="Export Data"
                    type="submit"
                    mode="primary"
                    loadingLabel="Exporting"
                    isLoading={isSubmitting}
                  />
                  <Button label="Cancel" onClick={() => cancelAction()} />
                </ButtonGroup>
              </fieldset>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

ExportRedFoxesForm.defaultProps = {
  successAction: undefined,
  cancelAction: undefined,
};

ExportRedFoxesForm.propTypes = {
  successAction: PropTypes.func,
  cancelAction: PropTypes.func,
};

export default ExportRedFoxesForm;
