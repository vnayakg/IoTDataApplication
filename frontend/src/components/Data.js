import { useEffect } from 'react';

const Data = ({ setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/'), []);

  return <h1>data</h1>;
};

export default Data;
