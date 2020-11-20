import React from 'react';

export default (initialValue) => {
  const [redFoxes, setRedFoxes] = React.useState(initialValue);

  return {
    redFoxes,
    setRedFoxes,

    addRedFox: (newRedFox) => {
      setRedFoxes([...redFoxes, newRedFox]);
    },

    deleteRedFox: (redFoxId) => {
      setRedFoxes((prevRedFoxes) =>
        prevRedFoxes.filter((redFox) => redFox._id !== redFoxId),
      );
    },
  };
};
