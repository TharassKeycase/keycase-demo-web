import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import Loading from "../common/Loading";
import ChangePasswordModal from "./ChangePasswordModal";
import { User } from "@/types/user";
import { VpnKey } from "@mui/icons-material";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { fetchData, loading, error } = useFetch();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<User>();

  // Clear errors when component mounts
  useEffect(() => {
    setLocalError(null);
  }, []);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      
      setLocalError(null); // Clear any previous errors
      
      try {
        const { ok, data } = await fetchData('/api/me', {
          method: 'GET',
        });
        
        if (ok) {
          setProfileData(data);
          // Populate form with current data
          reset({
            firstName: data.firstName,
            lastName: data.lastName || '',
            email: data.email,
            department: data.department || '',
          });
        } else {
          setLocalError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLocalError('Error loading profile');
      }
    };

    fetchProfile();
  }, [isAuthenticated]); // Only depend on authentication status

  const handleClearError = () => {
    setLocalError(null);
  };

  const onSubmit: SubmitHandler<User> = async (data) => {
    setLocalError(null); // Clear any previous errors
    
    try {
      const { ok } = await fetchData('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          department: data.department,
        }),
      });

      if (ok) {
        toast.success('Profile updated successfully');
        // Optionally refetch profile data
        const { ok: fetchOk, data: updatedData } = await fetchData('/api/me', {
          method: 'GET',
        });
        if (fetchOk) {
          setProfileData(updatedData);
        }
      } else {
        setLocalError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setLocalError('Error updating profile');
      toast.error('Error updating profile');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearError}>
            {localError || (error instanceof Error ? error.message : "Error loading profile")}
          </Alert>
        )}

        <Loading open={loading} />

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          
          {profileData && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoComplete="given-name"
                {...register("firstName", { 
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters"
                  }
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                margin="normal"
                fullWidth
                id="lastName"
                label="Last Name"
                autoComplete="family-name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                margin="normal"
                fullWidth
                id="department"
                label="Department"
                {...register("department")}
                error={!!errors.department}
                helperText={errors.department?.message}
              />

              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                value={profileData.username}
                disabled
                helperText="Username cannot be changed"
              />

              <TextField
                margin="normal"
                fullWidth
                id="role"
                label="Role"
                value={profileData.role?.name || 'No role assigned'}
                disabled
                helperText="Role is managed by administrators"
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<VpnKey />}
                  onClick={() => setShowChangePassword(true)}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={() => {
          // Password changed successfully
        }}
      />
    </Container>
  );
};

export default ProfilePage;