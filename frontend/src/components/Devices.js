import { useEffect } from 'react';

const Devices = ({ setRoute }) => {
  useEffect(() => setRoute('/devices'), [setRoute]);

  return <h1>devices</h1>;
};

export default Devices;
