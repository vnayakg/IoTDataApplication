import { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';

import DataPoint from '../services/dataPoints';

import LoginAdminCheck from './LoginAdminCheck';
import DataTable from './DataTable';

const Data = ({ user, setRoute }) => {
  const [currData, setCurrData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setRoute('/');

    const getData = async () => {
      try {
        const res = await DataPoint.getDataPoints();
        setCurrData(res.data.data);
        setShowLoading(false);
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
          showLoading ? (
            <CircularProgress />
          ) : (
            <Typography component="h1" variant="h5">
              No data available for you
            </Typography>
          )
        ) : (
          <DataTable currData={currData} user={user} />
        ))}
    </>
  );
};

export default Data;
