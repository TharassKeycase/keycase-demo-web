import React, { use, useContext, useEffect } from "react";

import { toast } from "react-hot-toast";

import {
  Order,
  OrderContextProps,
  OrderInitialState,
  OrderProviderProps,
} from "@/types/order";
import { OrderQueryParams, PaginatedOrders } from "@/services/orders";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import useFetch from "@/hooks/useFetch";

import { useCustomer } from "@/provider/CustomerProvider";

const OrderContext: React.Context<OrderContextProps> =
  React.createContext<OrderContextProps>(undefined!);

export const OrderProvider = ({
  children,
}: OrderProviderProps): JSX.Element => {
  const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();

  const contextValue = useCreateReducer<OrderInitialState>({
    initialState: {
      loading: false,
      selectedOrder: null,
      orders: [],
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      searchTerm: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });


  const {
    state: { orders, loading, pagination, searchTerm, sortBy, sortOrder },
    dispatch: orderDispatch,
  } = contextValue;

  useEffect(() => {
    (async () => {})();
  }, []);

  const handleFetchOrders = async (params: OrderQueryParams = {}) => {
    orderDispatch({ field: "loading", value: true });

    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.customerId) queryParams.append('customerId', params.customerId.toString());
      if (params.state) queryParams.append('state', params.state);
      
      const queryString = queryParams.toString();
      const url = `/api/orders${queryString ? `?${queryString}` : ''}`;
      
      const { ok, status, data } = await fetchData(url, {
        method: "GET",
      });
      if (ok) {
        orderDispatch({ field: "orders", value: data.data });
        orderDispatch({ field: "pagination", value: data.pagination });
        if (params.search !== undefined) {
          orderDispatch({ field: "searchTerm", value: params.search });
        }
        if (params.sortBy) {
          orderDispatch({ field: "sortBy", value: params.sortBy });
        }
        if (params.sortOrder) {
          orderDispatch({ field: "sortOrder", value: params.sortOrder });
        }
      }
    } catch (error) {
      toast.error("Error fetching Orders");
      console.log(error);
    } finally {
      orderDispatch({ field: "loading", value: false });
    }
  };

  const handleAddOrder = async (order: Order): Promise<boolean> => {
   
    try {
      const payload = {
        customerId: order.customer.id,
        orderItems: order.orderItems.map((orderItem) => ({
          productId: orderItem.productId,
          quantity: orderItem.quantity,
        })),
      };
      const { ok, status, data } = await fetchData(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (ok) {
        toast.success("Order added successfully");
        // Refresh with current filters and pagination
        handleFetchOrders({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'id' | 'total' | 'createdAt' | 'state',
          sortOrder,
        });
        return true;
      } 
      
    } catch (error) {
      orderDispatch({
        field: "error",
        value: error || "Error adding Order",
      });
    }
    return false;
  };

  const handleUpdateOrder = async (id: number, order: Order): Promise<boolean> => {
   
    try {
      const { ok, status, data } = await fetchData(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: order.orderItems,
        }),
      });
      if (ok) {
        toast.success("Order edited successfully");
        // Refresh with current filters and pagination
        handleFetchOrders({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'id' | 'total' | 'createdAt' | 'state',
          sortOrder,
        });
        return true;
      } 
      
    } catch (error) {
      orderDispatch({
        field: "error",
        value: error || "Error updating Order",
      });
    }
    return false;
  };

  const handleDeleteOrder = async (id: number): Promise<boolean> => {
   
    try {
      const { ok, status, data } = await fetchData(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (ok) {
        // Refresh with current filters and pagination
        handleFetchOrders({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'id' | 'total' | 'createdAt' | 'state',
          sortOrder,
        });
        toast.success("Order deleted successfully");
        return true;
      } 
    } catch (error) {
      orderDispatch({
        field: "error",
        value: error || "Error deleting Order",
      });
    }
    return false;
  };

  const handleFetchOrder = async (id: number) => {
    try {
      const { ok, status, data } = await fetchData(`/api/orders/${id}`, {
        method: "GET",
      });
      if (ok) {
        orderDispatch({ field: "selectedOrder", value: data });
        return true;
      }
    } catch (error) {
      orderDispatch({
        field: "error",
        value: error || "Error fetching Order",
      });
    }
    return false;
  };

  return (
    <OrderContext.Provider
      value={{
        ...contextValue,
        handleFetchOrders: handleFetchOrders,
        handleAddOrder: handleAddOrder,
        handleUpdateOrder: handleUpdateOrder,
        handleDeleteOrder: handleDeleteOrder,
        handleFetchOrder: handleFetchOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextProps => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
