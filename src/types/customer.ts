import { Dispatch, ReactNode } from "react";

import { ActionType } from "@/hooks/useCreateReducer";

export interface Customer {
  id?: number;
  name: string;
  email: string;
  address: string;
  city: string;
  country?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  address: string;
  city: string;
  country?: string;
  phone?: string;
}

export interface CustomerOverviewProps {
  customers: Array<Customer>;
  pagination?: PaginationInfo;
  searchTerm?: string;
  onEdit?: (id: number, customer: Customer) => void;
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  apiError: string | null | Error;
}

export interface CustomerFormProps {
    customer: Customer | null;
    onEdit: (id: number, customer: Customer) => Promise<boolean>;
    onAdd: (customer: Customer) => Promise<boolean>;
    onClose: () => void;   
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerInitialState {
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null | Error;
  customers: Customer[];
  pagination: PaginationInfo;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CustomerContextProps {
  state: CustomerInitialState;
  handleFetchCustomers: (params?: any) => void;
  handleAddCustomer: (customer: Customer) => Promise<boolean>;
  handleUpdateCustomer: (id: number, customer: Customer) => Promise<boolean>;
  handleDeleteCustomer: (id: number) => Promise<boolean>;
  handleClearError: () => void;
  dispatch: Dispatch<ActionType<CustomerInitialState>>;
}

export interface CustomerProviderProps {
  children?: ReactNode;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
}
