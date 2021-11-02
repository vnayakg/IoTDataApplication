import { useEffect } from 'react';

const AssignParent = ({ setRoute }) => {
  useEffect(() => setRoute('/assignparent'), [setRoute]);

  return <h1>assign parent</h1>;
};

export default AssignParent;
