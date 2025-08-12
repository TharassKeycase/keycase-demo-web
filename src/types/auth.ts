import { ActionType } from '@/hooks/useCreateReducer';
import { Session } from 'next-auth';
import { Dispatch, ReactNode } from 'react';

export interface AuthInitialState {
  session: Session | null;
  userId: string;
  name: string;
  roles: Array<string>;
}

export interface AuthContextProps {
  state: AuthInitialState;
  dispatch: Dispatch<ActionType<AuthInitialState>>;
}

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface ChangePasswordDialogProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ErrorTypes {
  isValid: boolean;
  errorMsg: string;
  isSubmitted: boolean;
}