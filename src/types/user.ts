import { Dispatch, ReactNode } from "react";
import { ActionType } from "@/hooks/useCreateReducer";

export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName?: string;
  department?: string;
  email: string;
  passwordHash?: string;
  password?: string; // For form input only
  active?: boolean;
  createdDate?: Date;
  lastLoginDate?: Date;
  passwordChange?: boolean;
  archived?: boolean;
  archivedAt?: Date;
  roleId: number;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserOverviewProps {
  users: Array<User>;
  onEdit: (id: number, user: User) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onChangePassword?: (user: User) => void;
  canManage?: boolean;
}

export interface UserFormProps {
  user: User | null;
  onEdit: (id: number, user: User) => void;
  onAdd: (user: User) => void;
  onClose: () => void;
}

export interface UserInitialState {
  selectedUser: User | null;
  loading: boolean;
  users: User[];
  error: string | null;
}

export interface UserContextProps {
  state: UserInitialState;
  handleFetchUsers: () => Promise<boolean>;
  handleAddUser: (user: User) => Promise<boolean>;
  handleUpdateUser: (id: number, user: User) => Promise<boolean>;
  handleDeleteUser: (id: number) => Promise<boolean>;
  handleUpdateProfile: (profileData: Partial<User>) => Promise<boolean>;
  handleGetProfile: () => Promise<User | null>;
  dispatch: Dispatch<ActionType<UserInitialState>>;
}

export interface UserProviderProps {
  children?: ReactNode;
}

export interface createdBy {
  id: number;
  username: string;
  email: string;
  role: string;
}


export type SignupRequest = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};
