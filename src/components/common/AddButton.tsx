import AddIcon from "@mui/icons-material/Add";
import { Button, ButtonProps } from "@mui/material";

const AddButton: React.FC<ButtonProps> = (props) => (
  <Button
    {...props}
    sx={{
      paddingX: "10px",
      borderRadius: "4px",
      ...props.sx,
    }}
    startIcon={<AddIcon />}
  />
);

export default AddButton;
