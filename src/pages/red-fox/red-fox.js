import React from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../../components/layout/Layout';
import RedFox from '../../components/red-fox/RedFox';

const RedFoxView = () => {
  const { id } = useParams();

  return (
    <Layout title="Red Fox">
      <RedFox id={id} />
    </Layout>
  );
};

export default RedFoxView;
