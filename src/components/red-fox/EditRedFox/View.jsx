import React from 'react';
import PropTypes from 'prop-types';
import EditRedFoxForm from './Form';

const EditRedFoxView = ({ data }) => {
  return (
    <div>
      <h1>Edit Red Fox: {data._id}</h1>
      <EditRedFoxForm id={data._id} initialData={data} />
    </div>
  );
};

EditRedFoxView.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
};

export default EditRedFoxView;
