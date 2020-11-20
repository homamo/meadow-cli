import React from 'react';

import API, { handleApiError } from '../../../lib/api';
import RedFoxesTable from './Component';
import useDocListState from './state';

import Error from '../../common/ErrorMessage';

function RedFoxesTableContainer() {
  /*
   * Delete Red Fox is used to delete from the state cache
   * rather than reload data from the API
   */

  // We'll start our table without any data
  const { redFox, setRedFoxes, deleteRedFox } = useDocListState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [displayError, setDisplayError] = React.useState();

  const fetchIdRef = React.useRef(0);
  const initialSortBy = [{ id: 'createdAt', desc: false }];

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, searchTerm, sortBy, selectedFilter }) => {
      // Give this fetch an ID
      // eslint-disable-next-line no-plusplus
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        // Set the loading state
        setLoading(true);

        const params = {
          searchTerm,
          pageSize,
          pageIndex,
          status: selectedFilter,
        };

        if (sortBy && sortBy.length > 0) {
          params.sortBy = sortBy[0].id;
          params.sortByDesc = sortBy[0].desc;
        }

        const response = await API.get('red-foxes/', { params }).catch(
          (error) => {
            handleApiError({ error, setDisplayError });
          },
        );

        if (response) {
          setRedFoxes(response.data.data);
          setPageCount(Math.ceil(response.data.totalCount / pageSize));
          setTotalCount(response.data.totalCount);
        }

        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const filterOptions = [
    {
      label: 'All',
      value: undefined,
    },
    {
      label: 'Draft',
      value: 'DRAFT',
    },
    {
      label: 'Published',
      value: 'PUBLISHED',
    },
  ];

  return (
    <>
      <Error error={displayError} />
      <RedFoxesTable
        data={redFox}
        isLoading={loading}
        pageCount={pageCount}
        fetchData={fetchData}
        totalCount={totalCount}
        initialSortBy={initialSortBy}
        filterOptions={filterOptions}
        onRedFoxDeleted={(redFoxId) => deleteRedFox(redFoxId)}
      />
    </>
  );
}

export default RedFoxesTableContainer;
