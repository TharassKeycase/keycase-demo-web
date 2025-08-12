import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Inventory } from "@mui/icons-material";

import { ProductOverviewProps, PaginationInfo } from "@/types/products";
import TablePagination from "@/components/common/TablePagination";
import SearchFilter from "@/components/common/SearchFilter";

function productTable({
  products,
  pagination,
  searchTerm,
  onAdd,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onSortChange,
}: ProductOverviewProps) {
  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
  ];
  if (products && products.length > 0) {
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by name or description..."
            sortByOptions={sortByOptions}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            defaultSortBy="createdAt"
            defaultSortOrder="desc"
          />
        )}
        
        <Paper elevation={2}>
          <TableContainer component={Paper}>
            <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>           
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow 
                  key={product.id}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" }
                  }}
                >
                   <TableCell>{product.id}</TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>{product.name}</TableCell>
                  <TableCell sx={{ maxWidth: "200px" }}>{product.description}</TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#1976d2" }}>
                    ${product.price?.toFixed(2) || "0.00"}
                  </TableCell>
                
                  <TableCell>
                    {onEdit && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          mr: 1,
                          minWidth: "60px",
                        }}
                        onClick={() => {
                          if (product.id) onEdit(product.id, product);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ minWidth: "60px" }}
                        onClick={() => {
                          if (product.id) onDelete(product.id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                    {!onEdit && !onDelete && (
                      <em>View Only</em>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {pagination && onPageChange && onLimitChange && (
          <TablePagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        )}
      </Paper>
      </Box>
    );
  } else if (products && products.length === 0) {
    // Check if user is searching/filtering
    const isFiltering = searchTerm && searchTerm.trim().length > 0;
    
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by name or description..."
            sortByOptions={sortByOptions}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            defaultSortBy="createdAt"
            defaultSortOrder="desc"
          />
        )}
        
        <Paper 
          elevation={2} 
          sx={{ 
            p: 6, 
            textAlign: "center",
            backgroundColor: "#fafafa",
            border: "2px dashed #e0e0e0"
          }}
        >
          <Inventory 
            sx={{ 
              fontSize: 80, 
              color: "#bdbdbd", 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              color: "#666",
              fontWeight: "500"
            }}
          >
            {isFiltering ? "No Results Found" : "No Products Available"}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: "#888",
              maxWidth: "400px",
              mx: "auto"
            }}
          >
            {isFiltering 
              ? `No products match your search criteria "${searchTerm}". Try adjusting your search terms or clearing filters.`
              : "Your product catalog is empty. Add your first product to start selling and managing inventory."
            }
          </Typography>
          {onAdd && !isFiltering && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Add />}
              onClick={() => onAdd()}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "500",
              }}
            >
              Add Your First Product
            </Button>
          )}
          {isFiltering && onSearchChange && (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => onSearchChange('')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "500",
              }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      </Box>
    );
  } else {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Loading products...
        </Typography>
      </Paper>
    );
  }
}

export default productTable;
