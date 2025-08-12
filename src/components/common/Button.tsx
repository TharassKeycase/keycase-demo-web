import { Button, ButtonProps } from "@mui/material";

const CustomButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} sx={{ ...props.sx, borderRadius: "4px" }} />
);

export default CustomButton;
