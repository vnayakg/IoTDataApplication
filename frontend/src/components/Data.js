import { useEffect, useState } from 'react';
import {CircularProgress} from '@mui/material'

import DataPoint from '../services/dataPoints';

import LoginAdminCheck from './LoginAdminCheck';
import DataTable from './DataTable';


const Data = ({ user, setRoute }) => {
  const [currData, setCurrData] = useState([]);

  useEffect(() => {
    setRoute('/');

    const getData = async () => {
      try {
        const res = await DataPoint.getDataPoints();
        setCurrData(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    getData();
  }, []);

  return (
    <>
      <LoginAdminCheck user={user} />
      {user &&
        (currData.length === 0 ? (
          <CircularProgress />
        ) : (
          <DataTable currData={currData} user={user} />
        ))}
    </>
  );
};

export default Data;
