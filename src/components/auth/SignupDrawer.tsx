import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useSignup } from '@/contexts/SignupContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface SignupFormData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const SignupDrawer: React.FC = () => {
  const { isSignupOpen, closeSignup } = useSignup();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Signup failed');
        return;
      }

      toast.success('Account created successfully! You can now login with password: Welcome1');
      reset();
      closeSignup();
      
      // Optionally redirect to login or keep them on the same page
      if (router.pathname !== '/login') {
        router.push('/login');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    closeSignup();
  };

  return (
    <Drawer
      id="signup-drawer"
      anchor="right"
      open={isSignupOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Create Account
          </Typography>
          <IconButton onClick={handleClose} id="close-signup-drawer">
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} id="signup-error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="signup-username"
            fullWidth
            label="Username"
            margin="normal"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            id="signup-firstname"
            fullWidth
            label="First Name"
            margin="normal"
            {...register('firstname', {
              required: 'First name is required',
            })}
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
          />

          <TextField
            id="signup-lastname"
            fullWidth
            label="Last Name"
            margin="normal"
            {...register('lastname', {
              required: 'Last name is required',
            })}
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
          />

          <TextField
            id="signup-email"
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            Your default password will be: <strong>Welcome1</strong>
            <br />
            Please change it after your first login.
          </Typography>

          <Button
            id="signup-submit"
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};