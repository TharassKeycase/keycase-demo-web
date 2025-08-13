import React from "react";

import { CSSObject } from "@emotion/react";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Theme,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { useRouter } from "next/router";

import { theme } from "@/styles/theme";
import { useAuth } from "@/hooks/useAuth";

const NavbarRoot = styled(AppBar)(
  ({ theme }: { theme: Theme }): CSSObject => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
  }),
);

interface NavbarProps {}

interface ExecutionNavbarProps {
  projectName: string;
}

const ProjectNavbar = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <NavbarRoot theme={theme} sx={{ position: "unset", marginBottom: 3, height: "70px" }}>
      <Box
        sx={{
          mx: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Typography
          id="navbar-logo"
          variant="h6"
          color="primary"
          fontSize="20px"
          fontWeight={500}
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          KEYCASE CRM APP - DEMO QA
        </Typography>

        {isAuthenticated && user && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {user.name || user.username}
              </Typography>
              {user.role && (
                <Chip
                  label={user.role}
                  size="small"
                  color={user.role.toLowerCase() === 'admin' ? 'primary' : 'default'}
                  variant="outlined"
                />
              )}
            </Box>
            
            <Button
              id="navbar-logout-btn"
              variant="outlined"
              size="small"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ minWidth: 'auto' }}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Box>
    </NavbarRoot>
  );
};

export const Navbar: React.FC<NavbarProps> = () => {
  return <ProjectNavbar />;
};
