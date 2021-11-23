import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from '@mui/material';

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

  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  useEffect(() => {
    const loadSensor = async () => {
      try {
        const { data } = await sensors.getSensor(sensorType);
        toast.success('Sensor fetched successfully!');
        setDescription(data.description);
        setSensorIDsInUse(data.sensorIDsInUse);
        setValue1(data.valueNames[0]);
        setValue2(data.valueNames[1] || '');
        setValue3(data.valueNames[2] || '');
        setValue4(data.valueNames[3] || '');
      } catch (error) {
        toast.error(error.response.data);
        setNotFound(true);
        if (error.response.status === 401) logout();
      }
    };

    if (paramST !== 'new') loadSensor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValues = () => {
    const values = [value1];

    if (value2 === '') return values;
    else values.push(value2);

    if (value3 === '') return values;
    else values.push(value3);

    if (value4 === '') return values;
    else values.push(value4);

    return values;
  };

  const handleSubmit = async () => {
    if (paramST === 'new') {
      const toastId = asyncToast.load('Adding sensor...');
      try {
        await sensors.addNewSensor({
          sensorType,
          description,
          sensorIDsInUse,
          valueNames: getValues(),
        });
        asyncToast.update(toastId, 'success', 'Sensor added successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    } else {
      const toastId = asyncToast.load('Updating sensor...');
      try {
        await sensors.editSensor(sensorType, {
          description,
          sensorIDsInUse,
          valueNames: getValues(),
        });
        asyncToast.update(toastId, 'success', 'Sensor updated successfully!');
      } catch (error) {
        asyncToast.update(toastId, 'error', error.response.data);
        if (error.response.status === 401) logout();
      }
    }
  };

  return (
    <Container component="main">
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

            <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
              <TextField
                fullWidth
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                id="value1"
                label="Value 1"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                id="value2"
                label="Value 2"
                variant="outlined"
                disabled={value1 === ''}
              />
              <TextField
                fullWidth
                value={value3}
                onChange={(e) => setValue3(e.target.value)}
                id="value3"
                label="Value 3"
                variant="outlined"
                disabled={value1 === '' || value2 === ''}
              />
              <TextField
                fullWidth
                value={value4}
                onChange={(e) => setValue4(e.target.value)}
                id="value4"
                label="Value 4"
                variant="outlined"
                disabled={value1 === '' || value2 === '' || value3 === ''}
              />
            </Stack>

            <Button
              fullWidth
              sx={{ marginTop: 3 }}
              disabled={
                notFound ||
                sensorType === '' ||
                description === '' ||
                sensorIDsInUse === '' ||
                value1 === ''
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
