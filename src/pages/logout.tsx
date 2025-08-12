import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Logout() {
  useEffect(() => {
    signOut({ 
      callbackUrl: '/login',
      redirect: true 
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="h6" color="text.secondary">
        Signing out...
      </Typography>
    </Box>
  );
}