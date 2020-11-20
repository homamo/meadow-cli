import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@homamo/meadow-utils';

import Definition, { DefinitionList } from '../../common/Definition';
import Error from '../../common/ErrorMessage';
import Button, { ButtonGroup } from '../../common/Button';
import RedFoxStatusBadge from '../RedFoxStatusBadge';
import DownloadRedFoxPdf from '../DownloadRedFoxPdf';

const RedFoxView = ({ data, setDisplayError, displayError }) => {
  const termWidth = '120px';

  const owner =
    (data.owner &&
      data.owner.profile &&
      `${data.owner.profile.firstName} ${data.owner.profile.lastName}`) ||
    (data.owner && data.owner.email);

  return (
    <div>
      <Link to="/red-foxes">View all Red Foxes</Link>
      <h1>{data.title}</h1>
      <Error error={displayError} />
      <DefinitionList termWidth={termWidth}>
        <Definition term="ID" definition={data._id} />
        <Definition term="Status">
          <RedFoxStatusBadge redFox={data} />
        </Definition>

        <Definition term="Owner" definition={owner || 'User deleted'} />
        <Definition term="Owner email">
          <a href={`mailto:${data.owner && data.owner.email}`}>
            {data.owner && data.owner.email}
          </a>
        </Definition>
        <Definition
          term="Created"
          definition={formatDateTime(data.createdAt)}
        />
      </DefinitionList>

      {data.image && <img src={data.image} alt={data.title} />}

      <ButtonGroup>
        <Button label="Edit" linkTo={`/red-fox/${data._id}/edit`} />
        <DownloadRedFoxPdf
          redFoxId={data._id}
          setDisplayError={setDisplayError}
        />
      </ButtonGroup>
    </div>
  );
};

RedFoxView.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
    image: PropTypes.string,
    owner: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
      email: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }).isRequired,
  displayError: PropTypes.shape({
    message: PropTypes.string,
  }),
  setDisplayError: PropTypes.func,
};

RedFoxView.defaultProps = {
  displayError: undefined,
  setDisplayError: undefined,
};

export default RedFoxView;
