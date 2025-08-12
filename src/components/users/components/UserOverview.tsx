import React from "react";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { PersonAdd, People } from "@mui/icons-material";

import { UserOverviewProps } from "@/types/user";
import { VpnKey } from "@mui/icons-material";

function UserTable({
  users,
  onAdd,
  onEdit,
  onDelete,
  onChangePassword,
  canManage = true,
}: UserOverviewProps) {
  if (users && users.length > 0) {
    return (
      <Paper elevation={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow 
                  key={user.id}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" }
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>{user.username}</TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>{user.role?.name || 'N/A'}</TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.archived ? 'Archived' : (user.active ? 'Active' : 'Inactive')}
                      color={user.archived ? 'error' : (user.active ? 'success' : 'warning')}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {canManage ? (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ minWidth: "60px" }}
                          onClick={() => {
                            if (user.id) onEdit(user.id, user);
                          }}
                          disabled={user.archived}
                        >
                          Edit
                        </Button>
                        {onChangePassword && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<VpnKey />}
                            sx={{ minWidth: "120px" }}
                            onClick={() => onChangePassword(user)}
                            disabled={user.archived}
                          >
                            Change Password
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ minWidth: "70px" }}
                          onClick={() => {
                            if (user.id) onDelete(user.id);
                          }}
                          disabled={user.archived}
                        >
                          {user.archived ? 'Archived' : 'Archive'}
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        View Only
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  } else if (users && users.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 6, 
          textAlign: "center",
          backgroundColor: "#fafafa",
          border: "2px dashed #e0e0e0"
        }}
      >
        <People 
          sx={{ 
            fontSize: 80, 
            color: "#bdbdbd", 
            mb: 2 
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2, 
            color: "#666",
            fontWeight: "500"
          }}
        >
          No Users Found
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            color: "#888",
            maxWidth: "400px",
            mx: "auto"
          }}
        >
          No system users have been created yet. Add your first user to start managing team access and permissions.
        </Typography>
        {onAdd && canManage && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => onAdd()}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            Add Your First User
          </Button>
        )}
      </Paper>
    );
  } else {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Loading users...
        </Typography>
      </Paper>
    );
  }
}

export default UserTable;