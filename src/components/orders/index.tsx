import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";

import { Order } from "@/types/order";

import { useCustomer } from "@/provider/CustomerProvider";
import { useOrder } from "@/provider/OrderProvider";
import { useProduct } from "@/provider/ProductProvider";
import { useAuth } from "@/hooks/useAuth";
import Loading from "../common/Loading";
import OrderCrud from "./components/OrderCrud";
import OrderOverview from "./components/OrderOverview";

const OrderPage = () => {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const { canEdit, canDelete } = useAuth();

  //userOrder
  const {
    state: { loading, orders, selectedOrder, pagination, sortBy, sortOrder, searchTerm },
    handleFetchOrders,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleFetchOrder, 
    dispatch: orderDispatch,
  } = useOrder();

  const {
    state: { customers, selectedCustomer  },
    handleFetchCustomers,
    dispatch: customerDispatch,
  } = useCustomer();

  const {
    state: { products },
    handleFetchProducts,
  } = useProduct();

  //invoke fetch execution sets and agents
  useEffect(() => {
    handleFetchCustomers({ page: 1, limit: 100 }); // Get all customers for dropdown
    handleFetchProducts({ page: 1, limit: 100 }); // Get all products for dropdown
    handleFetchOrders({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, []);

  const handlePageChange = (page: number) => {
    handleFetchOrders({
      page,
      limit: pagination.limit,
      sortBy,
      sortOrder,
    });
  };

  const handleLimitChange = (limit: number) => {
    handleFetchOrders({
      page: 1,
      limit,
      sortBy,
      sortOrder,
    });
  };

  const handleSearchChange = (search: string) => {
    handleFetchOrders({
      page: 1,
      limit: pagination.limit,
      search,
      sortBy,
      sortOrder,
    });
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    handleFetchOrders({
      page: 1,
      limit: pagination.limit,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  return (
    <Box
      sx={{
        marginTop: "20px",
        marginLeft: "20px",
      }}
    >
      {canEdit && (
        <Button
          id="add-order-button"
          variant="contained"
          sx={{
            marginBottom: "10px",
          }}
          onClick={() => {         
            orderDispatch({ field: "selectedOrder", value: null });
            setShowAddOrder(!showAddOrder);
          }}
        >
          {showAddOrder ? "Cancel" : "Add Order"}
        </Button>
      )}

      <Loading open={loading} />

      {canEdit && showAddOrder && (
        <OrderCrud
          selectedOrder={selectedOrder}
          selectedCustomer={selectedCustomer}       
          customers={customers}
          products={products}
          onAdd={handleAddOrder}
          onChangeCustomer={(customer) => {
            customerDispatch({ field: "selectedCustomer", value: customer });
          }}
          onEdit={handleUpdateOrder}
          onClose={() => {           
            setShowAddOrder(false);
          }}
        />
      )}

      {!showAddOrder && (
        <OrderOverview
          orders={orders}
          pagination={pagination}
          searchTerm={searchTerm}
          onEdit={canEdit ? (id, customer) => {    
            handleFetchOrder(id);     
            setShowAddOrder(true);
          } : undefined}
        
          onAdd={canEdit ? () => {
            orderDispatch({ field: "selectedOrder", value: null });
            setShowAddOrder(true);
          } : undefined}
          onDelete={canDelete ? handleDeleteOrder : undefined}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}        
        />
      )}
    </Box>
  );
};

export default OrderPage;
