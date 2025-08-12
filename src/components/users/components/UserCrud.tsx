import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

import { User, UserFormProps, Role } from "@/types/user";
import useFetch from "@/hooks/useFetch";

const UserCrud: React.FC<UserFormProps> = ({
  user,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const { fetchData } = useFetch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      active: true,
      roleId: 1,
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { ok, data } = await fetchData('/api/roles', { method: 'GET' });
        if (ok) {
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit: SubmitHandler<User> = (data) => {
    if (user && user.id) {
      onEdit(user.id, data);
    } else {
      onAdd(data);
    }
    onClose();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          {user ? "EDIT" : "ADD"} User
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', maxWidth: 500 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            {...register("username", { 
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters"
              }
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            defaultValue={user?.username}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoComplete="given-name"
            {...register("firstName", { required: "First name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            defaultValue={user?.firstName}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="lastName"
            label="Last Name"
            autoComplete="family-name"
            {...register("lastName")}
            defaultValue={user?.lastName}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            defaultValue={user?.email}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="department"
            label="Department"
            {...register("department")}
            defaultValue={user?.department}
          />
          
          {!user && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message || "Default password is 'Welcome1' if not specified"}
            />
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Controller
              name="roleId"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select
                  labelId="role-select-label"
                  label="Role"
                  error={!!errors.roleId}
                  {...field}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          
          <FormControlLabel
            control={
              <Controller
                name="active"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Switch
                    checked={value || false}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Active"
            sx={{ mt: 2, mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5 }}
            >
              {user ? "Update" : "Create"} User
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserCrud;