import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

import LoginAdminCheck from './LoginAdminCheck';
import { toast } from 'react-toastify';
import asyncToast from '../services/asyncToast';
import sensors from '../services/sensors';

const SensorForm = ({ user, logout }) => {
  const { sensorType: paramST } = useParams();
  const [sensorType, setSensorType] = useState(
    paramST !== 'new' ? paramST : ''
  );
  const [description, setDescription] = useState('');
  const [sensorIDsInUse, setSensorIDsInUse] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadSensor = async () => {
      try {
        const { data } = await sensors.getSensor(sensorType);
        toast.success('Sensor fetched successfully!');
        setDescription(data.description);
        setSensorIDsInUse(data.sensorIDsInUse);
      } catch (error) {
        toast.error(error.response.data);
        setNotFound(true);
        if (error.response.status === 401) logout();
      }
    };

    if (paramST !== 'new') loadSensor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (paramST === 'new') {
      const toastId = asyncToast.load('Adding sensor...');
      try {
        await sensors.addNewSensor({ sensorType, description, sensorIDsInUse });
        asyncToast.update(toastId, 'success', 'Sensor added successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    } else {
      const toastId = asyncToast.load('Updating sensor...');
      try {
        await sensors.editSensor(sensorType, { description, sensorIDsInUse });
        asyncToast.update(toastId, 'success', 'Sensor updated successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        {paramST !== 'new' ? 'Update Sensor' : 'Add New Sensor'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LoginAdminCheck user={user} type="superadmin" />
        {user && user.isSuperAdmin && (
          <form noValidate autoComplete="off">
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ marginTop: 3 }}
              fullWidth
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              id="sensorType"
              label="Sensor Type"
              variant="outlined"
              disabled={paramST !== 'new'}
              required
            />
            <TextField
              sx={{ marginTop: 3 }}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              label="Description"
              variant="outlined"
              required
            />
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ marginTop: 3 }}
              fullWidth
              value={sensorIDsInUse}
              onChange={(e) => setSensorIDsInUse(e.target.value)}
              id="sensorIDsInUse"
              label="Sensor IDs In Use"
              variant="outlined"
              required
            />

            <Button
              fullWidth
              sx={{ marginTop: 3 }}
              disabled={
                notFound ||
                sensorType === '' ||
                description === '' ||
                sensorIDsInUse === ''
              }
              variant="contained"
              onClick={handleSubmit}
            >
              {paramST !== 'new' ? 'Update Sensor' : 'Add Sensor'}
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default SensorForm;
