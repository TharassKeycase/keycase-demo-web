import React, { use, useContext, useEffect } from "react";

import { toast } from "react-hot-toast";

import {
  Customer,
  CustomerContextProps,
  CustomerInitialState,
  CustomerProviderProps,
} from "@/types/customer";
import { CustomerQueryParams, PaginatedCustomers } from "@/services/customers";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import useFetch from "@/hooks/useFetch";

const CustomerContext: React.Context<CustomerContextProps> =
  React.createContext<CustomerContextProps>(undefined!);

export const CustomerProvider = ({
  children,
}: CustomerProviderProps): JSX.Element => {
  const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();

  const contextValue = useCreateReducer<CustomerInitialState>({
    initialState: {
      selectedCustomer: null,
      loading: false,
      error: null,
      customers: [],
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
    state: { customers, pagination, searchTerm, sortBy, sortOrder },
    dispatch: customerDispatch,
  } = contextValue;

  useEffect(() => {
    (async () => {
      customerDispatch({ field: "error", value: fetchError || null });
      customerDispatch({ field: "loading", value: fetchLoading || false });
    })();
  }, [fetchError, fetchLoading]);

  const handleFetchCustomers = async (params: CustomerQueryParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const queryString = queryParams.toString();
      const url = `/api/customers${queryString ? `?${queryString}` : ''}`;
      
      const { ok, status, data } = await fetchData(url, {
        method: "GET",
      });
      
      if (ok) {
        customerDispatch({ field: "customers", value: data.data });
        customerDispatch({ field: "pagination", value: data.pagination });
        if (params.search !== undefined) {
          customerDispatch({ field: "searchTerm", value: params.search });
        }
        if (params.sortBy) {
          customerDispatch({ field: "sortBy", value: params.sortBy });
        }
        if (params.sortOrder) {
          customerDispatch({ field: "sortOrder", value: params.sortOrder });
        }
      }
    } catch (error) {
      customerDispatch({
        field: "error",
        value: error || "Error fetching customers",
      });
      console.log(error);
    }
  };

  const handleAddCustomer = async (customer: Customer): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if (ok) {
        toast.success("Customer added successfully");

        // Refresh with current filters and pagination
        handleFetchCustomers({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        return true;
      }
    } catch (error) {
      console.log("handleAddCustomer error", error);
      customerDispatch({
        field: "error",
        value: error || "Error adding customer",
      });
   
    }
    return false;
  };

  const handleUpdateCustomer = async (
    id: number,
    customer: Customer,
  ): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if (ok) {
        toast.success("Customer edited successfully");
        // Refresh with current filters and pagination
        handleFetchCustomers({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        return true;
      }
    } catch (error) {
      customerDispatch({
        field: "error",
        value: error || "Error updating customer",
      });
     
    }
    return false;
  };

  const handleDeleteCustomer = async (id: number): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/customers/${id}`, {
        method: "DELETE",
      });
      if (ok) {
        // Refresh with current filters and pagination
        handleFetchCustomers({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        toast.success("Customer deleted successfully");
        return true;
      }
    } catch (error) {
      toast.error("Error deleting customer");
    }
    return false;
  };

  const handleClearError = () => {
    customerDispatch({ field: "error", value: null });
  };

  return (
    <CustomerContext.Provider
      value={{
        ...contextValue,
        handleFetchCustomers,
        handleAddCustomer,
        handleUpdateCustomer,
        handleDeleteCustomer,
        handleClearError,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextProps => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within an CustomerProvider");
  }
  return context;
};
