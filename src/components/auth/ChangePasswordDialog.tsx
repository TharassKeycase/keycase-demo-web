import { ChangePasswordDialogProps, ErrorTypes } from "@/types/auth";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Typography,
  Dialog
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  userId,
  onSuccess,
  onClose
}) => {
  const [loadingProcess, setLoadingProcess] = useState<boolean>(false);
  const [error, setError] = useState<ErrorTypes>({
    isValid: false,
    errorMsg: "",
    isSubmitted: false
  });
  const [valid, setValid] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingProcess}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle sx={{ pb: 0 }}>
        <Typography>Change Password</Typography>
        <Tooltip sx={{ pb: 1 }} title="Password needs to be at least 6 characters">
          <IconButton size="small">
            <HelpIcon color="primary" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 1, pb: 0 }}>
        <FormGroup>
          <FormControl fullWidth sx={{ pb: 1 }} required>
            <InputLabel htmlFor="newPasswordLabel">New Password</InputLabel>
            <OutlinedInput
              sx={{ width: 300 }}
              id="newPassword"
              // type={showPassword ? "text" : "password"}
              // value={newPasswordValue}
              // onChange={newPasswordChangeHandler}
              // onBlur={newPasswordBlurHandler}
              label="newPasswordLabel"
              endAdornment={
                <IconButton
                  onClick={(event) => {
                    event.preventDefault();
                    setShowPassword((prevValue) => !prevValue);
                  }}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500]
                  }}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              }
            />
            {/* {newPasswordHasError ? (
              <FormHelperText error>Password not confirm </FormHelperText>
            ) : (
              ""
            )} */}
          </FormControl>

          <FormControl fullWidth sx={{ pb: 1 }} required>
            <InputLabel htmlFor="newPasswordConfirmLabel">New Password Confirm</InputLabel>
            <OutlinedInput
              sx={{ width: 300 }}
              id="newPasswordConfirm"
              type={showPassword ? "text" : "password"}
              // value={newPasswordConfirmValue}
              // onChange={newPasswordConfirmChangeHandler}
              // onBlur={newPasswordConfirmBlurHandler}
              label="newPasswordConfirmLabel"
              endAdornment={
                <IconButton
                  onClick={(event) => {
                    event.preventDefault();
                    setShowPassword((prevValue) => !prevValue);
                  }}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500]
                  }}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              }
            />
            {/* {newPasswordConfirmHasError ? (
              <FormHelperText error>Confirm new password not equal to new password</FormHelperText>
            ) : (
              ""
            )} */}
          </FormControl>
        </FormGroup>
        <Button
          sx={{ width: 300, height: 50, pb: 2, mb: 2, ml: 0 }}
          variant="contained"
          disabled={!valid}
          // onClick={submitHandler}
        >
          CHANGE
        </Button>
      </DialogContent>

      {error.isSubmitted && !error.isValid && (
        <Alert severity="error">
          Error — <strong>{error.errorMsg}</strong>
        </Alert>
      )}
    </Dialog>
  );
};

export default ChangePasswordDialog;
