import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Error from '../../common/ErrorMessage';

const RedFoxNotFoundComponent = ({ id, displayError }) => {
  return (
    <>
      <h1>404. Red Fox not found.</h1>
      <p>No Red Fox found with ID: {id}</p>
      <p>
        <Link to="/red-foxes">Back to all Red Foxes</Link>
      </p>
      {displayError && displayError.message && (
        <>
          <p>
            <small>
              The following information may be useful for technical support:
            </small>
          </p>
          <Error error={displayError} />
        </>
      )}
    </>
  );
};

RedFoxNotFoundComponent.propTypes = {
  id: PropTypes.string.isRequired,
  displayError: PropTypes.shape({
    message: PropTypes.string,
  }),
};

RedFoxNotFoundComponent.defaultProps = {
  displayError: {},
};

export default RedFoxNotFoundComponent;
