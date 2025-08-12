import { Box } from "@mui/material";
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";

export const Layout = (props: { children: JSX.Element }) => {
  const { children } = props;

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
