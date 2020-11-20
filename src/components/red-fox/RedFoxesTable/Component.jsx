import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { formatDateTime } from '@homamo/meadow-utils';

import Button from '../../common/Button';
import Table, { TableButtonGroup } from '../../common/Table';
import DeleteRedFox from '../DeleteRedFox';
import DuplicateRedFox from '../DuplicateRedFox';
import RedFoxStatusBadge from '../RedFoxStatusBadge';

const RedFoxesTableComponent = ({
  data,
  isLoading,
  pageCount,
  fetchData,
  totalCount,
  initialSortBy,
  filterOptions,
  onRedFoxDeleted,
  isCompact,
}) => {
  const history = useHistory();

  const columns = useMemo(
    /* eslint-disable react/prop-types */
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'basic',
        id: 'name',
        sticky: 'left',
        minWidth: 180,
      },
      {
        Header: 'Owner',
        accessor: ({ owner }) => {
          if (owner && owner.profile) {
            return `${owner.profile.firstName} ${owner.profile.lastName}`;
          }
          if (owner && owner.email) {
            return owner.email;
          }
          return <em>User deleted</em>;
        },
        sortType: 'basic',
        id: 'owner.profile.firstName',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: ({ status }) => (
          <RedFoxStatusBadge redFox={{ status }} size="s" />
        ),
        sortType: 'basic',
        id: 'status',
        width: 180,
      },
      {
        Header: 'Created',
        accessor: ({ createdAt }) => formatDateTime(createdAt),
        sortType: 'datetime',
        id: 'createdAt',
      },
      {
        Header: 'Updated',
        accessor: ({ updatedAt }) => formatDateTime(updatedAt),
        sortType: 'datetime',
        id: 'updatedAt',
      },
      {
        Header: 'Actions',
        accessor: '_id',
        disableSortBy: true,
        width: 330,
        Cell: ({ cell: { value } }) => (
          <TableButtonGroup>
            <Button label="View" size="s" linkTo={`/red-fox/${value}`} />
            <Button label="Edit" size="s" linkTo={`/red-fox/${value}/edit`} />
            <DuplicateRedFox
              id={value}
              onRedFoxDuplicated={(newRedFoxId) => {
                history.push(`/red-fox/${newRedFoxId}`);
              }}
            />
            <DeleteRedFox id={value} onRedFoxDeleted={onRedFoxDeleted} />
          </TableButtonGroup>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Second array to allow memo
    /* eslint-enable react/prop-types */
  );

  return (
    <>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        isLoading={isLoading}
        pageCount={pageCount}
        totalCount={totalCount}
        blankState="No Red Foxes found"
        initialSortBy={initialSortBy}
        searchPlaceholder="Search for a Red Fox name"
        filterOptions={filterOptions}
        isCompact={isCompact}
        enableSearch
      />
    </>
  );
};

RedFoxesTableComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    }),
  ),
  onRedFoxDeleted: PropTypes.func,
  isLoading: PropTypes.bool,
  pageCount: PropTypes.number,
  totalCount: PropTypes.number,
  fetchData: PropTypes.func.isRequired,
  initialSortBy: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      desc: PropTypes.bool,
    }),
  ).isRequired,
  isCompact: PropTypes.bool,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

RedFoxesTableComponent.defaultProps = {
  data: [],
  onRedFoxDeleted: undefined,
  isLoading: false,
  pageCount: 0,
  totalCount: 0,
  isCompact: false,
  filterOptions: [],
};

export default RedFoxesTableComponent;
