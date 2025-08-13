import React, { useCallback, useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from "@mui/icons-material/Info";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const drawerWidth = 240;

export const sidebarList = [
  { name: "dashboard", label: "DASHBOARD", route: "/", icon: <DashboardIcon /> },
  { name: "customers", label: "CUSTOMERS", route: "/customers", icon: <PersonIcon /> },
  { name: "orders", label: "ORDERS", route: "/orders", icon: <ShoppingCartIcon /> },
  { name: "products", label: "PRODUCTS", route: "/products", icon: <InventoryIcon /> },
  { name: "users", label: "USERS", route: "/users", icon: <PeopleAltIcon /> },
  { name: "profile", label: "PROFILE", route: "/profile", icon: <AccountCircleIcon /> },
  { name: "settings", label: "SETTINGS", route: "/settings", icon: <SettingsIcon /> },
  { name: "docs", label: "API DOCS", route: "/docs", icon: <DescriptionIcon /> }
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

const Sidebar = () => {
  const router = useRouter();
  const [isExpand, setExpand] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  const handleSelectListItem = (route: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(route);
  };

  const handleAboutOpen = () => setAboutOpen(true);
  const handleAboutClose = () => setAboutOpen(false);

  const handleExpand = useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  const renderSidebarHeader = useCallback(() => {
    return (
      <div className={`flex items-center w-full ${isExpand ? 'justify-between' : 'justify-center'}`}>
        {isExpand && (
          <Button
            onClick={() => router.push('/')}
            sx={{
              textTransform: 'none',
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8
              }
            }}
          >
            <Typography
              color="primary"
              fontWeight={700}
              fontSize="24px"
              fontFamily="Roboto Condensed"
            >
              KeyCase™ Demo
            </Typography>
          </Button>
        )}
        <IconButton id="sidebar-toggle-btn" onClick={handleExpand} color="primary" aria-label={isExpand ? "Collapse sidebar" : "Expand sidebar"}>
          {isExpand ? <ArrowBackIcon /> : <ArrowForwardIcon />}
        </IconButton>
      </div>
    );
  }, [isExpand, handleExpand, router]);

  return (
    <>
      <Drawer variant="permanent" open={isExpand}>
        <Box sx={{ display: "flex", alignItems: "center", height: "70px", px: 3 }}>
          {renderSidebarHeader()}
        </Box>
        <Divider />
        <div className="flex flex-col h-full justify-between">
          <List sx={{ p: 0 }}>
            {sidebarList.map((item) => {
              const isSelected = router.pathname === item.route;
              return (
                <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    id={`sidebar-nav-${item.name}`}
                    onClick={(event) => handleSelectListItem(item.route, event)}
                    sx={{
                      minHeight: 64,
                      justifyContent: "start",
                      alignItems: "center",
                      color: isSelected ? "primary.main" : "text.primary",
                      backgroundColor: isSelected ? "action.selected" : "transparent",
                      borderRight: isSelected ? "2px solid" : "",
                      borderRightColor: isSelected ? "primary.main" : "transparent",
                      "&:hover": { backgroundColor: "action.hover" }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isSelected ? "primary.main" : "text.secondary",
                        mr: isExpand ? "8px" : "auto",
                        justifyContent: "center"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {isExpand && (
                      <Typography
                        fontSize="14px"
                        fontWeight={500}
                        fontFamily="Roboto"
                        color={isSelected ? "primary.main" : "text.primary"}
                      >
                        {item.label}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* About Section */}
          <Box sx={{ mt: "auto", mb: 1 }}>
            <Divider sx={{ mx: 2, mb: 1 }} />
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                id="sidebar-about-btn"
                onClick={handleAboutOpen}
                sx={{
                  minHeight: 48,
                  justifyContent: "start",
                  alignItems: "center",
                  color: "text.secondary",
                  "&:hover": { backgroundColor: "action.hover" }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color: "text.secondary",
                    mr: isExpand ? "8px" : "auto",
                    justifyContent: "center"
                  }}
                >
                  <InfoIcon />
                </ListItemIcon>

                {isExpand && (
                  <Typography fontSize="12px" fontWeight={400} fontFamily="Roboto" color="text.secondary">
                    ABOUT
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          </Box>
        </div>
      </Drawer>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onClose={handleAboutClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            About KeyCase™ Demo
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              KeyCase™ Demo is a simplified Customer Relationship Management (CRM) application built with modern web technologies including Next.js, TypeScript, and Material-UI.
            </Typography>
            <Typography variant="body1" paragraph>
              This repository demonstrates core CRM features including customer management, order processing, product catalog, and user administration.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Note: This is a demo version and does <strong>not</strong> represent the full commercial KeyCase™ product. Certain features, integrations, and optimizations available in the commercial version are not included here.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              License
            </Typography>
            <Typography variant="body2" paragraph>
              This software is released under the MIT License.
            </Typography>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.85rem",
                lineHeight: 1.4
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
{`MIT License

Copyright (c) 2024–2025 Tharass Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The name KeyCase™ and associated logos are trademarks of Tharass Solutions and
may not be used in any way that suggests endorsement or affiliation without prior
written permission.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              KeyCase™ and associated logos are trademarks of Tharass Solutions.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button id="about-dialog-close-btn" onClick={handleAboutClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
