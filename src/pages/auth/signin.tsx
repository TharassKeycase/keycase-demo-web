import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signIn } from "next-auth/react";
import { FormEvent, SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import ChangePasswordDialog from "@/components/auth/ChangePasswordDialog";

const theme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginStarted, setIsLoginStarted] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const router = useRouter();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleClickSnackbar = () => {
    setOpenChangePasswordDialog(false);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginStarted(true);
    // setLoginError(false);

    try {
      const result = await signIn("credentials", {
        username: email,
        password: password,
        // The page where you want to redirect to after a
        // successful login
        redirect: false
      });

      setPassword("");
      if (!result) {
        setLoginError(true);
      } else if (result.error) {
        console.log("result.error: ", result.error);
        if (result.error === "PASSWORD_CHANGE") {
          setLoginError(false);
          setOpenChangePasswordDialog(true);
          return;
        }
        setLoginError(true);
      } else if (result.ok) {
        setLoginError(false);
        router.push("/");
      }
    } catch (error) {
      setLoginError(true);
    } finally {
      setIsLoginStarted(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {openChangePasswordDialog && (
          <ChangePasswordDialog
            open={openChangePasswordDialog}
            onClose={() => setOpenChangePasswordDialog(false)}
            userId={email}
            onSuccess={handleClickSnackbar}
          />
        )}

        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              value={email}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoginStarted}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
              name="password"
              value={password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={isLoginStarted}
            />
            <Button
              id="signin-submit-btn"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoginStarted}
              endIcon={isLoginStarted && <CircularProgress size="1rem" />}>
              Sign In
            </Button>
            {loginError ? (
              <Alert id="signin-error-alert" severity="error">
                Authentication failed, please enter correct credentials.
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <Snackbar id="password-changed-snackbar" open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert id="password-changed-alert" severity="success" sx={{ width: "100%" }}>
            Password has changed, please login with new Password!
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
