import { useEffect, useState } from "react";

import { Box, Button, Alert } from "@mui/material";

import { useUser } from "@/provider/UserProvider";
import { useAuth } from "@/hooks/useAuth";
import Loading from "../common/Loading";
import UserCrud from "./components/UserCrud";
import UserOverview from "./components/UserOverview";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { User } from "@/types/user";

const UserPage = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);
  const { user: currentUser, isAdmin, isManager, isViewer, canEdit, canDelete } = useAuth();

  const {
    state: { loading, users },
    handleFetchUsers,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUser();

  useEffect(() => {
    handleFetchUsers();
  }, []);

  type UserState = User | null;

  const [user, setUser] = useState<UserState>(null);

  // Check if current user can manage users (admin or manager)
  const canManageUsers = isAdmin || isManager;

  const handleChangePassword = (user: User) => {
    setSelectedUserForPassword(user);
    setShowChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    setSelectedUserForPassword(null);
  };

  // Debug logging
  console.log('UserPage render:', { 
    users: users?.length, 
    loading, 
    canManageUsers, 
    currentUser, 
    isAdmin, 
    isManager 
  });

  return (
    <Box
      sx={{
        marginTop: "20px",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      {!canManageUsers && (
        <Alert id="users-permissions-info-alert" severity="info" sx={{ mb: 2 }}>
          {isViewer ? "You have read-only access. You can view but not modify users." : "You need Admin or Manager privileges to manage users. You can only view the user list."}
        </Alert>
      )}

      {canManageUsers && (
        <Button
          id="add-user-button"
          variant="contained"
          sx={{
            marginBottom: "10px",
          }}
          onClick={() => {
            setUser(null);
            setShowAddUser(!showAddUser);
          }}
        >
          {showAddUser ? "Cancel" : "Add User"}
        </Button>
      )}

      <Loading open={loading} />
      
      {showAddUser && canManageUsers && (
        <UserCrud
          user={user ? user : null}
          onEdit={handleUpdateUser}
          onAdd={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}
      
      {!showAddUser && (
        <UserOverview
          users={users}
          onEdit={canManageUsers ? (id, user) => {
            setUser(user);
            setShowAddUser(true);
          } : () => {}}
          onAdd={() => {
            setUser(null);
            setShowAddUser(true);
          }}
          onDelete={canManageUsers ? handleDeleteUser : () => {}}
          onChangePassword={canManageUsers ? handleChangePassword : undefined}
          canManage={canManageUsers}
        />
      )}

      <ChangePasswordModal
        open={showChangePassword}
        user={selectedUserForPassword}
        onClose={handleCloseChangePassword}
        onSuccess={() => {
          // Optionally refresh users list or show success message
        }}
      />
    </Box>
  );
};

export default UserPage;