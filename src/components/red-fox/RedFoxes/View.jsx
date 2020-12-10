import React from 'react';
import Button, { Styles as ButtonStyles } from '../../common/Button';
import RedFoxesTable from '../RedFoxesTable';

const RedFoxesView = () => {
  return (
    <div>
      <h1>Red Foxes</h1>
      <ButtonStyles.ButtonGroup>
        <Button
          label="Create Red Fox"
          mode="primary"
          linkTo="/create-red-fox"
          size="s"
        />
      </ButtonStyles.ButtonGroup>

      <RedFoxesTable />
    </div>
  );
};

export default RedFoxesView;
