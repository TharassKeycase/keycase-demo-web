import { useEffect, useState } from "react";

import { Alert, Box, Button } from "@mui/material";

import { Customer } from "@/types/customer";
import { useAuth } from "@/hooks/useAuth";

import { useCustomer } from "@/provider/CustomerProvider";
import Loading from "../common/Loading";
import CustomerCrud from "./components/CustomerCrud";
import CustomerOverview from "./components/CustomerOverview";

const CustomerPage = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const { canEdit, canDelete } = useAuth();

  console.log("customerPage canEdit, canDelete", canEdit, canDelete);
  //useCustomer
  const {
    state: {
      loading,
      customers,
      pagination,
      sortBy,
      sortOrder,
      searchTerm,
      error,
    },
    handleFetchCustomers,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    handleClearError,
  } = useCustomer();

  //invoke fetch execution sets and agents
  useEffect(() => {
    handleFetchCustomers({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  type CustomerState = Customer | null;

  const [customer, setCustomer] = useState<CustomerState>(null);

  const handlePageChange = (page: number) => {
    handleFetchCustomers({
      page,
      limit: pagination.limit,
      sortBy,
      sortOrder,
    });
  };

  const handleLimitChange = (limit: number) => {
    handleFetchCustomers({
      page: 1, // Reset to first page when limit changes
      limit,
      sortBy,
      sortOrder,
    });
  };

  const handleSearchChange = (search: string) => {
    handleFetchCustomers({
      page: 1, // Reset to first page when searching
      limit: pagination.limit,
      search,
      sortBy,
      sortOrder,
    });
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc",
  ) => {
    handleFetchCustomers({
      page: 1, // Reset to first page when sorting changes
      limit: pagination.limit,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };
  console.log("customerPage error", error);
  return (
    <Box
      sx={{
        marginTop: "20px",
        marginLeft: "20px",
      }}
    >
      {canEdit && (
        <Button
          id="add-customer-button"
          variant="contained"
          sx={{
            marginBottom: "10px",
          }}
          onClick={() => {
            setCustomer(null);
            setShowAddCustomer(!showAddCustomer);
          }}
        >
          {showAddCustomer ? "Cancel" : "Add Customer"}
        </Button>
      )}

      {error && <Alert severity="error" onClose={() => handleClearError()}>{error instanceof Error ? error.message : "Error"}</Alert>}

      <Loading open={loading} />
      {canEdit && showAddCustomer && (
        <CustomerCrud
          customer={customer ? customer : null}
          onEdit={handleUpdateCustomer}
          onAdd={handleAddCustomer}
          onClose={() => setShowAddCustomer(false)}
        />
      )}
  

      {!showAddCustomer && (
        <CustomerOverview
          apiError={error || null}
          customers={customers}
          pagination={pagination}
          searchTerm={searchTerm}
          onEdit={
            canEdit
              ? (id, customer) => {
                  setCustomer(customer);
                  setShowAddCustomer(true);
                }
              : undefined
          }
          onAdd={
            canEdit
              ? () => {
                  setCustomer(null);
                  setShowAddCustomer(true);
                }
              : undefined
          }
          onDelete={canDelete ? handleDeleteCustomer : undefined}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />
      )}
    </Box>
  );
};

export default CustomerPage;
