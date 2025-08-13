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
  Chip,
} from "@mui/material";
import { Add, Receipt } from "@mui/icons-material";

import { OrderOverviewProps, PaginationInfo } from "@/types/order";
import TablePagination from "@/components/common/TablePagination";
import SearchFilter from "@/components/common/SearchFilter";

function OrderTable({ 
  orders, 
  pagination,
  searchTerm,
  onAdd, 
  onEdit, 
  onDelete,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onSortChange,
}: OrderOverviewProps) {
  const sortByOptions = [
    { value: 'id', label: 'Order ID' },
    { value: 'total', label: 'Total' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'state', label: 'State' },
  ];
  if (orders && orders.length > 0) {
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by customer name, email, or order ID..."
            sortByOptions={sortByOptions}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            defaultSortBy="createdAt"
            defaultSortOrder="desc"
          />
        )}
        
        <Paper elevation={2}>
          <TableContainer component={Paper}>
            <Table id="orders-table">
            <TableHead>
              <TableRow id="orders-table-header" sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>   
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>                   
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow 
                  id={`order-row-${order.id}`}
                  key={order.id}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" }
                  }}
                >
                  <TableCell id={`order-id-${order.id}`} sx={{ fontWeight: "600", color: "#1976d2" }}>
                    #{order.id}
                  </TableCell>
                  <TableCell id={`order-customer-name-${order.id}`} sx={{ fontWeight: "500" }}>{order.customer.name}</TableCell>
                  <TableCell id={`order-customer-id-${order.id}`}>
                    <Chip 
                      label={`#${order.customer.id}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell id={`order-total-${order.id}`} sx={{ fontWeight: "600", color: "#2e7d32", fontSize: "1.1rem" }}>
                    ${order.total?.toFixed(2) || "0.00"}
                  </TableCell>

                  <TableCell>
                    {onEdit && (
                      <Button
                        id={`edit-order-${order.id}`}
                        variant="contained"
                        color="primary"
                        size="small"                                           
                        sx={{
                          mr: 1,
                          minWidth: "60px",                      
                        }}
                        onClick={() => {
                          if (order.id) onEdit(order.id, order);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        id={`delete-order-${order.id}`}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ minWidth: "60px" }}
                        onClick={() => {
                          if (order.id) onDelete(order.id);
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
  } else if (orders && orders.length === 0) {
    // Check if user is searching/filtering
    const isFiltering = searchTerm && searchTerm.trim().length > 0;
    
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by customer name, email, or order ID..."
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
          <Receipt 
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
            {isFiltering ? "No Results Found" : "No Orders Yet"}
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
              ? `No orders match your search criteria "${searchTerm}". Try adjusting your search terms or clearing filters.`
              : "No customer orders have been placed yet. Create your first order to start tracking sales and revenue."
            }
          </Typography>
          {onAdd && !isFiltering && (
            <Button
              id="add-first-order-btn"
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
              Create Your First Order
            </Button>
          )}
          {isFiltering && onSearchChange && (
            <Button
              id="clear-search-orders-btn"
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
          Loading orders...
        </Typography>
      </Paper>
    );
  }
}

export default OrderTable;
