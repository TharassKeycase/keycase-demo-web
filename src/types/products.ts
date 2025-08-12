import { Dispatch, ReactNode } from "react";

import { ActionType } from "@/hooks/useCreateReducer";
import { createdBy } from "./user";

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;  
  createdBy?: createdBy;
  updatedBy?: createdBy;
  createdAt?: Date;
  updatedAt?: Date;
  archived?: boolean;
  archivedAt?: Date;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductOverviewProps {
  products: Array<Product>;
  pagination?: PaginationInfo;
  searchTerm?: string;
  onEdit?: (id: number, product: Product) => void;
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface ProductFormProps {
  product: Product | null;
  onEdit: (id: number, product: Product) => void;
  onAdd: (product: Product) => Promise<boolean>;
  onClose: () => void;
}

export interface ProductInitialState {
  loading: boolean;
  error: string | null | Error;
  products: Product[];
  pagination: PaginationInfo;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ProductContextProps {
  state: ProductInitialState;
  handleFetchProducts: (params?: any) => void;
  handleAddProduct: (product: Product) => Promise<boolean>;
  handleUpdateProduct: (id: number, product: Product) => Promise<boolean>;
  handleDeleteProduct: (id: number) => Promise<boolean>;
  dispatch: Dispatch<ActionType<ProductInitialState>>;
  handleClearError: () => void;
}

export interface ProductProviderProps {
  children?: ReactNode;
}
