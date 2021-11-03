import { useEffect } from 'react';

const Sensors = ({ setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/sensors'), []);

  return <h1>sensors</h1>;
};

export default Sensors;
