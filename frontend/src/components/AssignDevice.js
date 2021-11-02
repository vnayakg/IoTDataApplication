import { useEffect } from 'react';

const AssignDevice = ({ setRoute }) => {
  useEffect(() => setRoute('/assigndevice'), [setRoute]);

  return <h1>assign devices</h1>;
};

export default AssignDevice;
