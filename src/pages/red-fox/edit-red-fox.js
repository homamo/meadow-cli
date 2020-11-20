import React from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout';
import EditRedFox from '../../components/red-fox/EditRedFox';

const EditRedFoxView = () => {
  const { id } = useParams();
  return (
    <Layout title="Edit Red Fox">
      <EditRedFox id={id} />
    </Layout>
  );
};

export default EditRedFoxView;
