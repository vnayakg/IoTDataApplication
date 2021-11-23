import { useEffect, useState } from 'react';

import {
  MenuItem,
  FormControl,
  Select,
  Button,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Container
} from '@mui/material/';
import { DeleteOutline } from '@mui/icons-material';
import { StyledTableCell } from './common/StyledTable';

import Device from '../services/devices';
import User from '../services/users';
import Assign from '../services/assign';
import asyncToast from '../services/asyncToast';
import LoginAdminCheck from './LoginAdminCheck';

const AssignDevice = ({ user, setRoute }) => {
  const [devices, setDevices] = useState([]);
  const [currentDevice, setCurrentDevice] = useState('');
  const [currentChildren, setCurrentChildren] = useState('');
  const [children, setChildren] = useState([]);
  const [deviceID, setDeviceID] = useState('');
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setRoute('/assigndevice');
    loadDevices();
    loadChildren();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await Device.getUserDevices();
      console.log(res.data);
      setDevices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadChildren = async () => {
    try {
      const res = await User.getChildren();
      setChildren(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeviceChange = (event) => {
    const dev = event.target.value;
    setCurrentDevice(dev);
    const currIds = [];
    for (let i = 1; i <= dev.deviceIDsInUse; i++) {
      currIds.push(i);
    }
    setIds(currIds);
    console.log(currIds);
  };

  const handleChildrenChange = (event) => {
    const curr = children.filter((child) => child._id === event.target.value);
    console.log(curr);
    setCurrentChildren(curr[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loadDevices();
    loadChildren();
    const toastID = asyncToast.load('Assigning device...');
    try {
      const data = {
        childId: currentChildren._id,
        deviceID,
        deviceType: currentDevice.deviceType,
      };

      console.log(data);
      const res = await Assign.assignDevice(data);
      console.log(res.status);
      if (res.status !== 200)
        return asyncToast.update(toastID, 'error', res.data);
      else {
        console.log('curr child', currentChildren);
        const curr = children.filter(
          (child) => child._id === currentChildren._id
        );

        setCurrentChildren(curr[0]);
        console.log('after child', currentChildren);
        loadDevices();
        loadChildren();

        return asyncToast.update(toastID, 'success', res.data);
      }
    } catch (error) {
      asyncToast.update(toastID, 'error', error.response.data);
      console.log(error);
    }
  };

  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const alertOpen = (id, type) => {
    setDeviceToDelete({ deviceID: id, deviceType: type });
    setDeleteAlert(true);
  };
  const alertClose = (confirm) => {
    setDeleteAlert(false);
    console.log(confirm);
    if (confirm) {
      removeDevice();
    }
  };

  const removeDevice = async () => {
    const toastID = asyncToast.load('Assigning device...');
    try {
      console.log('currentChildre', currentChildren);
      const data = {
        childId: currentChildren._id,
        deviceID: deviceToDelete.deviceID,
        deviceType: deviceToDelete.deviceType,
      };
      console.log(data);
      const res = await Assign.removeDevices(data);
      console.log(res.data);
      if (res.status !== 200)
        return asyncToast.update(toastID, 'error', res.data);
      else {
        setDevices(
          devices.filter(
            (device) =>
              device.deviceID !== data.deviceID &&
              data.deviceType !== device.deviceType
          )
        );
        return asyncToast.update(toastID, 'success', res.data);
      }
    } catch (error) {
      asyncToast.update(toastID, 'error', error.response.data);
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography component="h1" variant="h5">
        Assign Device
      </Typography>
      <LoginAdminCheck user={user} type="admin" />
      {user && (user.isAdmin || user.isSuperAdmin) && (
        <>
          <FormControl sx={{ marginTop: 4 }} fullWidth>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="User"
              value={currentChildren && currentChildren._id}
              onChange={handleChildrenChange}
            >
              {children.length &&
                children.map((child) => (
                  <MenuItem key={child._id} value={child._id}>
                    {child.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 4 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Device</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Device"
              value={currentDevice}
              onChange={handleDeviceChange}
            >
              {devices.length &&
                devices.map((device) => (
                  <MenuItem key={device._id} value={device}>
                    {device.deviceIDsInUse +
                      ' ' +
                      device.deviceType +
                      ' ' +
                      device.description}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 4 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Select ID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Device"
              value={deviceID}
              onChange={(e) => setDeviceID(e.target.value)}
            >
              {ids &&
                ids.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            {currentChildren && (
              <>
                <Typography sx={{ mt: 2 }} variant="h6">
                  User Info:{' '}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Name: {currentChildren.name}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Username: {currentChildren.username}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Phone: {currentChildren.phone}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Name: {currentChildren.name}
                </Typography>
              </>
            )}
            <Typography sx={{ mt: 2 }} variant="h6">
              Users Devices
            </Typography>
          </Box>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Device Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentChildren &&
                currentChildren.assignedDevices.map((device) => (
                  <TableRow
                    key={device.deviceID}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {device.deviceID}
                    </TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        sx={{ padding: '4px' }}
                        onClick={() =>
                          alertOpen(device.deviceID, device.deviceType)
                        }
                      >
                        <DeleteOutline fontSize="small" sx={{ color: 'red' }} />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            disabled={currentDevice === '' || currentChildren._id === ''}
          >
            Assign
          </Button>
          <Dialog open={deleteAlert} onClose={() => alertClose(false)}>
            <DialogTitle>
              Are you sure you want to delete this device?
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => alertClose(true)}>OK</Button>
              <Button onClick={() => alertClose(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AssignDevice;
