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
import sensors from '../services/sensors';
import { toast } from 'react-toastify';
import asyncToast from '../services/asyncToast';

const Sensors = ({ user, logout, setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/sensors'), []);

  const [rows, setRows] = useState([]);

  const [sensorTypeToDelete, setSensorTypeToDelete] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const alertOpen = (sensorType) => {
    setSensorTypeToDelete(sensorType);
    setDeleteAlert(true);
  };
  const alertClose = (confirm) => {
    setDeleteAlert(false);
    console.log(confirm);
    if (confirm) deleteRow(sensorTypeToDelete);
  };

  const getRows = async () => {
    try {
      const { data } = await sensors.getAllSensors();
      toast.success('Sensors fetched successfully!');
      setRows(data);
    } catch (error) {
      toast.error('Could not fetch sensors!');
      if (error.response.status === 401) logout();
    }
  };

  const deleteRow = async (sensorType) => {
    const toastId = asyncToast.load('Deleting sensor...');
    try {
      await sensors.deleteSensor(sensorType);
      asyncToast.update(toastId, 'success', 'Sensor deleted successfully!');
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
        Sensors
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
                <Button variant="contained" component={Link} to="/sensors/new">
                  Add New Sensor
                </Button>
                <br />
              </>
            )}
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Sensor Type
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Description
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Sensor IDs In Use
                    </StyledTableCell>
                    <StyledTableCell align="center">Value 1</StyledTableCell>
                    <StyledTableCell align="center">Value 2</StyledTableCell>
                    <StyledTableCell align="center">Value 3</StyledTableCell>
                    <StyledTableCell align="center">Value 4</StyledTableCell>
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
                      key={row.sensorType}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <StyledTableCell align="center">
                        {row.sensorType}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.sensorIDsInUse}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.valueNames[0]}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.valueNames[1]}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.valueNames[2]}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.valueNames[3]}
                      </StyledTableCell>
                      {user.isSuperAdmin && (
                        <>
                          <StyledTableCell align="center">
                            <IconButton
                              sx={{ padding: '4px' }}
                              component={Link}
                              to={`/sensors/${row.sensorType}`}
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
                              onClick={() => alertOpen(row.sensorType)}
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
        <DialogTitle>Are you sure you want to delete this sensor?</DialogTitle>
        <DialogActions>
          <Button onClick={() => alertClose(true)}>OK</Button>
          <Button onClick={() => alertClose(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sensors;
