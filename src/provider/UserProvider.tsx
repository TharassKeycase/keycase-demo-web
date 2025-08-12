import React, { useContext, useEffect } from "react";

import { toast } from "react-hot-toast";

import {
  User,
  UserContextProps,
  UserInitialState,
  UserProviderProps,
} from "@/types/user";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import useFetch from "@/hooks/useFetch";

const UserContext: React.Context<UserContextProps> =
  React.createContext<UserContextProps>(undefined!);

export const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();

  const contextValue = useCreateReducer<UserInitialState>({
    initialState: {
      selectedUser: null,
      loading: false,
      users: [],
      error: null,
    },
  });

  const {
    state: { users },
    dispatch: userDispatch,
  } = contextValue;

  useEffect(() => {
    (async () => {
      userDispatch({ field: "loading", value: fetchLoading });
      userDispatch({ field: "error", value: fetchError || null });
    })();
  }, [fetchLoading, fetchError]);

  const handleFetchUsers = async (): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/users`, {
        method: "GET",
      });

      if (ok) {
        userDispatch({ field: "users", value: data });
        return true;
      }
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error fetching users",
      });
    }
    return false;
  };

  const handleAddUser = async (user: User): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (ok) {
        toast.success("User added successfully");
        handleFetchUsers();
        return true;
      }
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error adding user",
      });
    }
    return false;
  };

  const handleUpdateUser = async (id: number, user: User): Promise<boolean> => {
   
    try {
      const { ok, status, data } = await fetchData(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (ok) {
        toast.success("User updated successfully");
        handleFetchUsers();
        return true;
      } 
      
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error updating user",
      });
    }
    return false;
  };

  const handleDeleteUser = async (id: number): Promise<boolean> => {   
    try {
      const { ok, status, data } = await fetchData(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (ok) {
        handleFetchUsers();
        toast.success("User deleted successfully");
        return true;
      } 
      
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error deleting user",
      });
    }
    return false;
  };

  const handleUpdateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      if (ok) {
        toast.success("Profile updated successfully");
        return true;
      }
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error updating profile",
      });
    }
    return false;
  };

  const handleGetProfile = async (): Promise<User | null> => {
    try {
      const { ok, status, data } = await fetchData(`/api/me`, {
        method: "GET",
      });
      if (ok) {
        return data;
      }
    } catch (error) {
      userDispatch({
        field: "error",
        value: error || "Error fetching profile",
      });
    }
    return null;
  };

  return (
    <UserContext.Provider
      value={{
        ...contextValue,
        handleFetchUsers,
        handleAddUser,
        handleUpdateUser,
        handleDeleteUser,
        handleUpdateProfile,
        handleGetProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
