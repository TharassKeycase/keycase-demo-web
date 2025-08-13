import { useEffect, useState } from "react";

import { Alert, Box, Button } from "@mui/material";
import Loading from "../common/Loading";
import ProductCrud from "./components/ProductCrud";
import ProductOverview from "./components/ProductOverview";
import { Product } from "@/types/products";
import { useProduct } from "@/provider/ProductProvider";
import { useAuth } from "@/hooks/useAuth";

const ProductPage = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { canEdit, canDelete } = useAuth();

  //useProduct
  const {
    state: { loading, products, error, pagination, sortBy, sortOrder, searchTerm },
    handleFetchProducts,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleClearError,
  } = useProduct();

  //invoke fetch execution sets and agents
  useEffect(() => {
    handleFetchProducts({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, []);

  const handlePageChange = (page: number) => {
    handleFetchProducts({
      page,
      limit: pagination.limit,
      sortBy,
      sortOrder,
    });
  };

  const handleLimitChange = (limit: number) => {
    handleFetchProducts({
      page: 1,
      limit,
      sortBy,
      sortOrder,
    });
  };

  const handleSearchChange = (search: string) => {
    handleFetchProducts({
      page: 1,
      limit: pagination.limit,
      search,
      sortBy,
      sortOrder,
    });
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    handleFetchProducts({
      page: 1,
      limit: pagination.limit,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  type ProductState = Product | null;

  const [product, setProduct] = useState<ProductState>(null);

  return (
    <Box
      sx={{
        marginTop: "20px",
        marginLeft: "20px",
      }}
    >
      {canEdit && (
        <Button
          id="add-product-button"
          variant="contained"
          sx={{
            marginBottom: "10px",
          }}
          onClick={() => {
            setProduct(null);
            setShowAddProduct(!showAddProduct)}}
        >
          {showAddProduct ? "Cancel" : "Add Product"}
        </Button>
      )}

      {error && <Alert id="products-error-alert" severity="error" sx={{ marginBottom: "10px" }} onClose={handleClearError}>Error: {error instanceof Error ? error.message : "Error"}</Alert>}

      <Loading open={loading} />
      {canEdit && showAddProduct && <ProductCrud product={product ? product : null} onEdit={handleUpdateProduct} onAdd={handleAddProduct} onClose={ ()=> setShowAddProduct(false)} />}
      {!showAddProduct && (
        <ProductOverview
          products={products}
          pagination={pagination}
          searchTerm={searchTerm}
          onEdit={
            canEdit ? (id, customer) => {
              setProduct(customer);
              setShowAddProduct(true);
            } : undefined
          }
          onAdd={canEdit ? () => {
            setProduct(null);
            setShowAddProduct(true);
          } : undefined}
          onDelete={canDelete ? handleDeleteProduct : undefined}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />
      )}
    </Box>
  );
};

export default ProductPage;
