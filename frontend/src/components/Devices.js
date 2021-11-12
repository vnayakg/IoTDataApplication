import {
  Container,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StyledTableCell } from './common/StyledTable';

import LoginAdminCheck from './LoginAdminCheck';
import devices from '../services/devices';
import { toast } from 'react-toastify';
import asyncToast from '../services/asyncToast';

const Devices = ({ user, logout, setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/devices'), []);

  const [rows, setRows] = useState([]);

  const [deviceTypeToDelete, setDeviceTypeToDelete] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const alertOpen = (deviceType) => {
    setDeviceTypeToDelete(deviceType);
    setDeleteAlert(true);
  };
  const alertClose = (confirm) => {
    setDeleteAlert(false);
    console.log(confirm);
    if (confirm) deleteRow(deviceTypeToDelete);
  };

  const getRows = async () => {
    try {
      const { data } = await devices.getAllDevices();
      toast.success('Devices fetched successfully!');
      setRows(data);
    } catch (error) {
      toast.error('Could not fetch devices!');
      if (error.response.status === 401) logout();
    }
  };

  const deleteRow = async (deviceType) => {
    const toastId = asyncToast.load('Deleting device...');
    try {
      await devices.deleteDevice(deviceType);
      asyncToast.update(toastId, 'success', 'Device deleted successfully!');
      getRows();
    } catch (error) {
      asyncToast.update(toastId, 'error', error.response.data);
      if (error.response.status === 401) logout();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getRows(), []);

  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h5">
        Devices
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LoginAdminCheck user={user} />
        {user && (
          <>
            {user.isSuperAdmin && (
              <>
                <Button variant="contained" component={Link} to="/devices/new">
                  Add New Device
                </Button>
                <br />
              </>
            )}
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Device Type
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Description
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Device IDs In Use
                    </StyledTableCell>
                    {user.isSuperAdmin && (
                      <>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      hover
                      key={row.deviceType}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <StyledTableCell align="center">
                        {row.deviceType}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.deviceIDsInUse}
                      </StyledTableCell>
                      {user.isSuperAdmin && (
                        <>
                          <StyledTableCell align="center">
                            <IconButton
                              sx={{ padding: '4px' }}
                              component={Link}
                              to={`/devices/${row.deviceType}`}
                            >
                              <EditOutlined
                                fontSize="small"
                                sx={{ color: 'mediumseagreen' }}
                              />
                            </IconButton>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <IconButton
                              sx={{ padding: '4px' }}
                              onClick={() => alertOpen(row.deviceType)}
                            >
                              <DeleteOutline
                                fontSize="small"
                                sx={{ color: 'red' }}
                              />
                            </IconButton>
                          </StyledTableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Dialog open={deleteAlert} onClose={() => alertClose(false)}>
        <DialogTitle>Are you sure you want to delete this device?</DialogTitle>
        <DialogActions>
          <Button onClick={() => alertClose(true)}>OK</Button>
          <Button onClick={() => alertClose(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Devices;
