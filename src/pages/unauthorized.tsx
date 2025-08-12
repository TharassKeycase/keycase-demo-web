import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Lock, Home } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function Unauthorized() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Lock
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />
            <Typography variant="h3" gutterBottom color="error">
              403
            </Typography>
            <Typography variant="h4" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You don't have permission to access this resource.
              {user && (
                <>
                  <br />
                  Current role: <strong>{user.role}</strong>
                </>
              )}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{ py: 1.5, px: 4 }}
          >
            Go to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}