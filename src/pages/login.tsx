import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useSignup } from "@/contexts/SignupContext";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { openSignup } = useSignup();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your username and password.");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            color="primary"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            CRM APP
          </Typography>
          <Typography variant="h6" color="text.secondary">
            DEMO QA
          </Typography>
        </Box>

        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your account to continue
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {error && (
              <Alert id="login-error-alert" severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                disabled={loading}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  mb: 2,
                  position: "relative",
                }}
              >
                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      marginLeft: "-10px",
                      marginTop: "-10px",
                    }}
                  />
                )}
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 3 }}
              >
                Demo credentials: Use any username from the database
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Button
                  id="create-account-button"
                  variant="text"
                  color="primary"
                  onClick={openSignup}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  No credentials? Create one
                </Button>
                
                <Link href="/docs" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    id="docs-link-button"
                    variant="text"
                    color="secondary"
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                  >
                    View Documentation
                  </Button>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 CRM Demo App. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};