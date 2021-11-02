import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// valid values for type - 'admin', 'superadmin', and don't provice value for only checking login
const LoginAdminCheck = ({ user, type }) => {
  return (
    <Box
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!user && (
        <Typography component="h3" variant="h6">
          Please log in to continue.
        </Typography>
      )}

      {type === 'admin' && user && !(user.isAdmin || user.isSuperAdmin) && (
        <Typography component="h3" variant="h6">
          Only admins can access this resource.
        </Typography>
      )}

      {type === 'superadmin' && user && !user.isSuperAdmin && (
        <Typography component="h3" variant="h6">
          Only superadmin can access this resource.
        </Typography>
      )}
    </Box>
  );
};

export default LoginAdminCheck;
