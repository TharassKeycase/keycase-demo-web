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
import { PersonAdd, People } from "@mui/icons-material";

import { CustomerOverviewProps, PaginationInfo } from "@/types/customer";
import TablePagination from "@/components/common/TablePagination";
import SearchFilter from "@/components/common/SearchFilter";

function CustomerTable({
  customers,
  pagination,
  searchTerm,
  onAdd,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onSortChange,
}: CustomerOverviewProps) {
  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
  ];

  if (customers && customers.length > 0) {
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by name, email, city, or address..."
            sortByOptions={sortByOptions}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            defaultSortBy="createdAt"
            defaultSortOrder="desc"
          />
        )}
        
        <Paper elevation={2}>
          <TableContainer component={Paper}>
            <Table id="customers-table">
            <TableHead>
              <TableRow id="customers-table-header" sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow 
                  id={`customer-row-${customer.id}`}
                  key={customer.id}
                  sx={{ 
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" }
                  }}
                >
                  <TableCell id={`customer-id-${customer.id}`}>{customer.id}</TableCell>
                  <TableCell id={`customer-name-${customer.id}`} sx={{ fontWeight: "500" }}>{customer.name}</TableCell>
                  <TableCell id={`customer-email-${customer.id}`}>{customer.email}</TableCell>
                  <TableCell id={`customer-address-${customer.id}`}>{customer.address}</TableCell>
                  <TableCell id={`customer-city-${customer.id}`}>{customer.city}</TableCell>
                  <TableCell id={`customer-country-${customer.id}`}>{customer.country}</TableCell>
                  <TableCell id={`customer-phone-${customer.id}`}>{customer.phone}</TableCell>
                  <TableCell>
                    {onEdit && (
                      <Button
                        id={`edit-customer-${customer.id}`}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          mr: 1,
                          minWidth: "60px",
                        }}
                        onClick={() => {
                          if (customer.id) onEdit(customer.id, customer);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        id={`delete-customer-${customer.id}`}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ minWidth: "60px" }}
                        onClick={() => {
                          if (customer.id) onDelete(customer.id);
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
  } else if (customers && customers.length === 0) {
    // Check if user is searching/filtering
    const isFiltering = searchTerm && searchTerm.trim().length > 0;
    
    return (
      <Box>
        {onSearchChange && onSortChange && (
          <SearchFilter
            searchPlaceholder="Search by name, email, city, or address..."
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
          <People 
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
            {isFiltering ? "No Results Found" : "No Customers Found"}
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
              ? `No customers match your search criteria "${searchTerm}". Try adjusting your search terms or clearing filters.`
              : "You haven't added any customers yet. Start building your customer base by adding your first customer."
            }
          </Typography>
          {onAdd && !isFiltering && (
            <Button
              id="add-first-customer-btn"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PersonAdd />}
              onClick={onAdd}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "500",
              }}
            >
              Add Your First Customer
            </Button>
          )}
          {isFiltering && onSearchChange && (
            <Button
              id="clear-search-btn"
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
          Loading customers...
        </Typography>
      </Paper>
    );
  }
}

export default CustomerTable;
