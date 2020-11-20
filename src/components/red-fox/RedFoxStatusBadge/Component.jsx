import React from 'react';
import PropTypes from 'prop-types';
import Badge from '../../common/Badge';

export const getRedFoxStatus = (redFox) => {
  if (redFox && redFox.status) {
    if (redFox.status === 'DRAFT') return { mode: 'waiting', status: 'Draft' };
    if (redFox.status === 'PUBLISHED')
      return { mode: 'positive', status: 'Published' };
  }

  return { mode: 'default', status: 'Not set' };
};

const RedFoxStatusBadge = ({ redFox, size }) => {
  const { mode, status } = getRedFoxStatus(redFox);
  return (
    <Badge mode={mode} size={size}>
      {status}
    </Badge>
  );
};

RedFoxStatusBadge.propTypes = {
  redFox: PropTypes.shape({
    status: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
};

RedFoxStatusBadge.defaultProps = {
  size: undefined,
};

export default RedFoxStatusBadge;
