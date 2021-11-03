import { useEffect } from 'react';

const AssignParent = ({ setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/assignparent'), []);

  return <h1>assign parent</h1>;
};

export default AssignParent;
