import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import DataPoint from '../services/dataPoints';
import LoginAdminCheck from './LoginAdminCheck';

const Data = ({ user, setRoute }) => {
  const [currData, setCurrData] = useState([]);
  const [message, setMessage] = useState('Loading ...');

  useEffect(() => {
    setRoute('/');

    const getData = async () => {
      try {
        const res = await DataPoint.getDataPoints();
        setCurrData(res.data);
        setMessage('You do have access to any device!');
      } catch (err) {
        console.log(err.response);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoginAdminCheck user={user} />
      {user &&
        (currData.length === 0 ? (
          <h1>{message}</h1>
        ) : (
          <DataTable currData={currData} />
        ))}
    </>
  );
};

export default Data;
