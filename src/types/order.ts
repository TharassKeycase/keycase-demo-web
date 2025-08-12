import { Dispatch, ReactNode } from "react";

import { ActionType } from "@/hooks/useCreateReducer";

import { Customer } from "./customer";
import { Product } from "./products";

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price?: number;
}

export interface Order {
  id?: number;
  customer: Customer;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderCreate {
  customerId: number;
  productId: number;
  quantity: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderOverviewProps {
  orders: Array<Order>;
  pagination?: PaginationInfo;
  searchTerm?: string;
  onEdit?: (id: number, order: Order) => void; 
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface OrderCrudProps {
  selectedCustomer: Customer | null;
  selectedOrder: Order | null; 
  customers: Array<Customer>;
  products: Array<Product>;
  onChangeCustomer: (customer: Customer | null) => void;
  onEdit: (id: number, order: Order) => void;
  onAdd: (order: Order) => void;
  onClose: () => void;
}

export interface OrderInitialState {
  loading: boolean;
  selectedOrder: Order | null;
  orders: Order[];
  error: string | null;
  pagination: PaginationInfo;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface OrderContextProps {
  state: OrderInitialState;
  handleFetchOrders: (params?: any) => void;
  handleAddOrder: (order: Order) => Promise<boolean>;
  handleUpdateOrder: (id: number, order: Order) => Promise<boolean>;
  handleDeleteOrder: (id: number) => Promise<boolean>;
  handleFetchOrder: (id: number) => Promise<boolean>;
  dispatch: Dispatch<ActionType<OrderInitialState>>;
}

export interface OrderProviderProps {
  children?: ReactNode;
}
