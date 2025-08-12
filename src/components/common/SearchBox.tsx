import SearchIcon from "@mui/icons-material/Search";
import { styled, TextField, TextFieldProps } from "@mui/material";

const StyledSearchInput = styled(TextField)(({}) => ({
  "& .MuiInputBase-root": {
    paddingLeft: "10px",
    borderRadius: "4px",
  },
  "& .MuiFormLabel-root": {
    fontFamily: "Roboto",
  },
}));

const SearchBox: React.FC<TextFieldProps> = (props) => (
  <StyledSearchInput
    {...props}
    InputProps={{ startAdornment: <SearchIcon color="disabled" /> }}
  />
);

export default SearchBox;
