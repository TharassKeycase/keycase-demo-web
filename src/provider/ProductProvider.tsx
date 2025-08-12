import React, { use, useContext, useEffect } from "react";

import { toast } from "react-hot-toast";

import {
  Product,
  ProductContextProps,
  ProductInitialState,
  ProductProviderProps,
} from "@/types/products";
import { ProductQueryParams, PaginatedProducts } from "@/services/products";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import useFetch from "@/hooks/useFetch";

const ProductContext: React.Context<ProductContextProps> =
  React.createContext<ProductContextProps>(undefined!);

export const ProductProvider = ({
  children,
}: ProductProviderProps): JSX.Element => {
  const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();

  const contextValue = useCreateReducer<ProductInitialState>({
    initialState: {
      loading: false,
      error: null,
      products: [],
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
    state: { products, pagination, searchTerm, sortBy, sortOrder },
    dispatch: productDispatch,
  } = contextValue;

  useEffect(() => {
    (async () => {
      productDispatch({ field: "loading", value: fetchLoading });
      productDispatch({ field: "error", value: fetchError?.message ?? null });
    })();
  }, [fetchLoading, fetchError]);

  const handleFetchProducts = async (params: ProductQueryParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      
      const queryString = queryParams.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      const { ok, status, data } = await fetchData(url, {
        method: "GET",
      });
      if (ok) {
        productDispatch({ field: "products", value: data.data });
        productDispatch({ field: "pagination", value: data.pagination });
        if (params.search !== undefined) {
          productDispatch({ field: "searchTerm", value: params.search });
        }
        if (params.sortBy) {
          productDispatch({ field: "sortBy", value: params.sortBy });
        }
        if (params.sortOrder) {
          productDispatch({ field: "sortOrder", value: params.sortOrder });
        }
      }
    } catch (error) {
      productDispatch({
        field: "error",
        value: error || "Error fetching products",
      });
    }
  };

  const handleAddProduct = async (product: Product): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(product),
      });
      if (ok) {
        toast.success("product added successfully");
        // Refresh with current filters and pagination
        handleFetchProducts({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        return true;
      }
    } catch (error) {
      productDispatch({
        field: "error",
        value: error || "Error adding product",
      });
      console.log(error);
    }

    return false;
  };

  const handleUpdateProduct = async (id: number, product: Product): Promise<boolean> => {
    try {
      const { ok, status, data } = await fetchData(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (ok) {
        toast.success("product edited successfully");
        // Refresh with current filters and pagination
        handleFetchProducts({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        return true;

      } 
      
    } catch (error) {
      productDispatch({
        field: "error",
        value: error || "Error updating product",
      });
    }
    return false;
  };

  const handleDeleteProduct = async (id: number): Promise<boolean> => {
    
    try {
      const { ok, status, data } = await fetchData(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (ok) {
        // Refresh with current filters and pagination
        handleFetchProducts({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'updatedAt',
          sortOrder,
        });
        toast.success("product deleted successfully");
        return true;
      } 

    } catch (error) {
      productDispatch({
        field: "error",
        value: error || "Error deleting product",
      });
    }
    return false;
  };

  const handleClearError = () => {
    productDispatch({ field: "error", value: null });
  };

  return (
    <ProductContext.Provider
      value={{
        ...contextValue,
        handleFetchProducts: handleFetchProducts,
        handleAddProduct: handleAddProduct,
        handleUpdateProduct: handleUpdateProduct,
        handleDeleteProduct: handleDeleteProduct,
        handleClearError: handleClearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within an ProductProvider");
  }
  return context;
};
