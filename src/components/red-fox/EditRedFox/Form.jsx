import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import API, { handleApiError } from '../../../lib/api';

import Error from '../../common/ErrorMessage';
import Button, { ButtonGroup } from '../../common/Button';
import Form from '../../common/Form';
import TextInput from '../../common/TextInput';
import SelectInput from '../../common/SelectInput';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('You need to enter a name'),
  status: Yup.string().required('You need to select a status'),
});

const EditRedFoxForm = ({ id, initialData }) => {
  const history = useHistory();
  const [displayError, setDisplayError] = React.useState();

  return (
    <>
      <Error error={displayError} />
      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          await API.post(`red-foxes/update/${id}`, {
            name: values.name,
            status: values.status,
          })
            .then((res) => {
              const redFoxId = res.data._id;
              toast.success('Red Fox updated');
              history.push(`/redFox/${redFoxId}`);
            })
            .catch((error) => {
              handleApiError({ error, setDisplayError });
            })
            .finally(() => setSubmitting(false));
        }}
        initialValues={{
          name: initialData.name,
          status: initialData.status,
        }}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
                <Field
                  label="Name"
                  id="name"
                  name="name"
                  placeholder="Enter a name"
                  component={TextInput}
                  isRequired
                />
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
                    label="Update Red Fox"
                    type="submit"
                    mode="primary"
                    loadingLabel="Updating Red Fox"
                    isLoading={isSubmitting}
                  />
                  <Button
                    label="Cancel"
                    onClick={() => history.push('/red-foxes')}
                  />
                </ButtonGroup>
              </fieldset>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

EditRedFoxForm.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
  }),
};

EditRedFoxForm.defaultProps = {
  initialData: {},
};

export default EditRedFoxForm;
