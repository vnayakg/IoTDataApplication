import { useEffect } from 'react';

const AssignDevice = ({ setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/assigndevice'), []);

  return <h1>assign devices</h1>;
};

export default AssignDevice;
