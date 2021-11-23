import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Button,
} from '@mui/material';

import LoginAdminCheck from './LoginAdminCheck';
import users from '../services/users';
import asyncToast from '../services/asyncToast';
import assign from '../services/assign';

const AssignParent = ({ user, setRoute }) => {
  const [allChildren, setAllChildren] = useState([]);
  const [currChild, setCurrChild] = useState('');
  const [currChildInfo, setCurrChildInfo] = useState(null);
  const [newParent, setNewParent] = useState('');

  useEffect(() => {
    setRoute('/assignparent');

    loadAllChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllChildren = async () => {
    try {
      const { data } = await users.getAllChildren();
      setAllChildren(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSelectChild = (event) => {
    const childId = event.target.value;
    setCurrChild(childId);

    const selectedChild = allChildren.find((child) => child._id === childId);
    setCurrChildInfo(selectedChild);
  };

  const handleSubmit = async () => {
    const toastId = asyncToast.load('Assigning Parent...');
    try {
      await assign.assignParent({ parentId: newParent, childId: currChild });
      asyncToast.update(toastId, 'success', 'Assigned suceessfully!');
    } catch (error) {
      asyncToast.update(toastId, 'error', error.response.data);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Assign Parent
      </Typography>
      <LoginAdminCheck user={user} type="admin" />
      {user && (user.isAdmin || user.isSuperAdmin) && (
        <>
          <FormControl sx={{ marginTop: 4 }} fullWidth>
            <InputLabel>Child</InputLabel>
            <Select
              label="Child"
              value={currChild}
              onChange={handleSelectChild}
            >
              {allChildren.map((child) => (
                <MenuItem key={child._id} value={child._id}>
                  {child.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ marginTop: 4 }} fullWidth>
            <InputLabel>New Parent</InputLabel>
            <Select
              label="New Parent"
              value={newParent}
              onChange={(e) => setNewParent(e.target.value)}
            >
              {allChildren.map((child) => (
                <MenuItem key={child._id} value={child._id}>
                  {child.username}
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
            {currChildInfo && (
              <>
                <Typography sx={{ mt: 2 }} variant="h6">
                  User Info:
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Child Name: {currChildInfo.name}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Child Username: {currChildInfo.username}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Current Parent Name : {currChildInfo.parentID.name}
                </Typography>
                <Typography sx={{ mt: 1, marginLeft: 2 }} variant="p">
                  Current Parent Username : {currChildInfo.parentID.username}
                </Typography>
              </>
            )}
          </Box>
        </>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleSubmit}
        disabled={currChild === '' || newParent._id === ''}
      >
        Assign
      </Button>
    </>
  );
};

export default AssignParent;
