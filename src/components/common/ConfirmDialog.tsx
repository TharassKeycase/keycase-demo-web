import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ConfirmDialogProps } from "@/types/common";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, message, onConfirm }) => {
  return (
    <Dialog open={open} maxWidth="sm">
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        Confirm the action
        <IconButton id="confirm-dialog-close-btn" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "24px" }}>
        <Button id="confirm-dialog-cancel-btn" className="w-[92px]" color="primary" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button id="confirm-dialog-confirm-btn" className="w-[92px]" color="secondary" variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
