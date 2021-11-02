import { useEffect } from 'react';

const Data = ({ setRoute }) => {
  useEffect(() => setRoute('/'), [setRoute]);

  return <h1>data</h1>;
};

export default Data;
