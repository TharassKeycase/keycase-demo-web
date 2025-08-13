import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Restore,
  Warning,
  People,
  Business,
  Inventory,
  ShoppingCart,
  Security,
  CheckCircle,
} from "@mui/icons-material";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const { fetchData, loading } = useFetch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resetResult, setResetResult] = useState<any>(null);

  const handleResetData = async () => {
    try {
      const { ok, data } = await fetchData('/api/system/reset-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (ok) {
        setResetResult(data);
        toast.success('Database reset successfully!');
      } else {
        toast.error('Failed to reset database');
      }
    } catch (error: any) {
      console.error('Error resetting database:', error);
      toast.error('Error resetting database: ' + (error.message || 'Unknown error'));
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const resetData = [
    { icon: <Security />, label: "4 Roles", detail: "Admin, Manager, User, Viewer" },
    { icon: <People />, label: "6 Users", detail: "Including one archived user for testing" },
    { icon: <Business />, label: "5 Customers", detail: "Sample companies with contact info" },
    { icon: <Inventory />, label: "20 Products", detail: "Various software products with pricing" },
    { icon: <ShoppingCart />, label: "10 Orders", detail: "Orders with different states and items" },
  ];

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {/* Database Reset Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Restore sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h5" component="h2">
              Database Reset
            </Typography>
          </Box>

          <Alert id="settings-info-alert" severity="info" sx={{ mb: 3 }}>
            This is a QA demo environment. You can reset all data to default test values.
          </Alert>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Clicking "Reset Database" will:
          </Typography>

          <List sx={{ mb: 3 }}>
            {resetData.map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.detail}
                />
              </ListItem>
            ))}
          </List>

          <Alert id="settings-warning-alert" severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>⚠️ Warning:</strong> This will permanently delete ALL existing data and replace it with test data. 
              All users will have the password: <strong>Welcome1</strong>
            </Typography>
          </Alert>

          <Button
            variant="contained"
            color="warning"
            size="large"
            startIcon={<Restore />}
            onClick={() => setShowConfirmDialog(true)}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? 'Resetting...' : 'Reset Database'}
          </Button>

          {loading && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                This may take a few moments...
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Reset Result */}
        {resetResult && (
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" color="success.main">
                Reset Completed Successfully!
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Database has been reset with the following test data:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary={`${resetResult.data?.roles || 0} Roles created`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`${resetResult.data?.users || 0} Users created`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`${resetResult.data?.customers || 0} Customers created`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`${resetResult.data?.products || 0} Products created`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`${resetResult.data?.orders || 0} Orders created`} />
              </ListItem>
            </List>

            <Alert id="settings-success-alert" severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Login Credentials:</strong> All users have password: <strong>{resetResult.data?.defaultPassword}</strong>
                <br />
                Try logging in with: admin, john.manager, jane.user, bob.viewer, or test.user
              </Typography>
            </Alert>
          </Paper>
        )}

        {/* Test Accounts Info */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test Accounts (after reset)
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="admin" 
                secondary="Admin role - Full system access"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="john.manager" 
                secondary="Manager role - Can manage users, customers, orders, products"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="jane.user / test.user" 
                secondary="User role - Standard user access"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="bob.viewer" 
                secondary="Viewer role - Read-only access"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="archived.user" 
                secondary="Viewer role - Archived/inactive user for testing"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: 'warning.main' }} />
          Confirm Database Reset
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to reset the entire database?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
            • Delete all existing users, customers, orders, and products
            <br />
            • Create fresh test data
            <br />
            • Reset all passwords to "Welcome1"
            <br />
            • This action cannot be undone
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowConfirmDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetData}
            variant="contained"
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Restore />}
          >
            {loading ? 'Resetting...' : 'Yes, Reset Database'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;