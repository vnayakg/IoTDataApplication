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
} from '@mui/material';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StyledTableCell } from './common/StyledTable';

import LoginAdminCheck from './LoginAdminCheck';
import devices from '../services/devices';
import asyncToast from '../services/asyncToast';

const Devices = ({ user, logout, setRoute }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRoute('/devices'), []);

  const [rows, setRows] = useState([]);

  const getRows = async () => {
    const toastId = asyncToast.load('Fetching devices...');
    try {
      const { data } = await devices.getAllDevices();
      console.log(data);
      asyncToast.update(toastId, 'success', 'Devices fetched successfully!');
      setRows(data);
    } catch (error) {
      console.log(error.response);
      asyncToast.update(toastId, 'error', 'Could not fetch devices!');
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
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                            <IconButton sx={{ padding: '4px' }}>
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
    </Container>
  );
};

export default Devices;
