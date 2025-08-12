import { ActionType } from '@/hooks/useCreateReducer';
import { Dispatch, ReactNode } from 'react';
import { Customer } from './customer';


export interface HomeInitialState {
  loading: boolean;
  selectedCustomer: Customer | null;
}

export interface HomeContextProps {
  state: HomeInitialState;
  dispatch: Dispatch<ActionType<HomeInitialState>>;
}

export interface HomeProviderProps {
  children?: ReactNode;
}

