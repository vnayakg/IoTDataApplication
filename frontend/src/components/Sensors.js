import { useEffect } from 'react';

const Sensors = ({ setRoute }) => {
  useEffect(() => setRoute('/sensors'), [setRoute]);

  return <h1>sensors</h1>;
};

export default Sensors;
