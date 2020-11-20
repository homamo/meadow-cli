import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import API, { handleApiError } from '../../../lib/api';
import EditRedFoxView from './View';
import RedFoxNotFound from '../RedFoxNotFound';

import Loading from '../../common/Loading';

function EditRedFoxContainer({ id }) {
  const redFoxId = id;
  // Data state to store the users data. Its initial value is an empty array
  const [data, setData] = useState([]);
  const [displayError, setDisplayError] = React.useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    await API.get(`red-foxes/${redFoxId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        handleApiError({ error, setDisplayError });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!redFoxId) {
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redFoxId]);

  if (isLoading) return <Loading />;
  return data && data._id ? (
    <EditRedFoxView data={data} refetchData={fetchData} />
  ) : (
    <RedFoxNotFound id={redFoxId} displayError={displayError} />
  );
}

EditRedFoxContainer.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditRedFoxContainer;
