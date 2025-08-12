import { errorDelay } from "@/config/constants";
import { ValidateTextBoxProps } from "@/types/common";
import { Box, Fade, Typography } from "@mui/material";

const ValidateTextBox: React.FC<ValidateTextBoxProps> = ({ visible, message }) => {
  return (
    <Box height="24px" minWidth="100px" paddingLeft="8px">
      <Fade in={visible} timeout={errorDelay}>
        <Typography color="error">{message}</Typography>
      </Fade>
    </Box>
  );
};

export default ValidateTextBox;
