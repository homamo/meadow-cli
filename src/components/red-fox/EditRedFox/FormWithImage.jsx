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
import ImageUpload from '../../common/ImageUpload';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('You need to enter a name'),
  status: Yup.string().required('You need to select a status'),
  image: Yup.string(),
});

const EditRedFoxForm = ({ id, initialData }) => {
  const history = useHistory();
  const [displayError, setDisplayError] = React.useState();
  const [imageUrl, setImageUrl] = React.useState(initialData.image);
  const [isUploading, setIsUploading] = React.useState(false);

  return (
    <>
      <Error error={displayError} />
      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          await API.post(`red-foxes/update/${id}`, {
            name: values.name,
            status: values.status,
            image: imageUrl,
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
              <fieldset
                disabled={isSubmitting || isUploading}
                aria-busy={isSubmitting || isUploading}
              >
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
                <ImageUpload
                  label="Image"
                  imageUrl={imageUrl}
                  onUpload={() => setIsUploading(true)}
                  onUploadSuccess={(url) => setImageUrl(url)}
                  onUploadError={(error) => setDisplayError(error)}
                  onUploadComplete={() => setIsUploading(false)}
                />
                <ButtonGroup>
                  <Button
                    label="Update Red Fox"
                    type="submit"
                    mode="primary"
                    loadingLabel="Updating Red Fox"
                    isLoading={isSubmitting || isUploading}
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
    image: PropTypes.string,
  }),
};

EditRedFoxForm.defaultProps = {
  initialData: {},
};

export default EditRedFoxForm;
