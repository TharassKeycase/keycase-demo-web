import React, { useEffect, useState } from "react";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
} from "@mui/material";

import { Customer } from "@/types/customer";
import { Order, OrderCrudProps, OrderItem } from "@/types/order";
import { Product } from "@/types/products";

const OrderPage = ({
  selectedCustomer,
  selectedOrder,
  customers,
  products,
  onAdd,
  onEdit,
  onClose,
  onChangeCustomer,
}: OrderCrudProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<Array<OrderItem>>([]);

  useEffect(() => {
    setOrderItems([]); //clear the order items when the selected customer changes
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedOrder) {
      //set the order items
      setOrderItems(selectedOrder.orderItems);
    }
  }, [selectedOrder]);

  const handleProductChange = (newValue: Product | null) => {
    setSelectedProduct(newValue);
  };

  const handleSubmit = () => {
    if (!selectedCustomer) return;
    if (orderItems.length === 0) return;

    if(selectedOrder){
      const newOrder = {
        customer: selectedCustomer,
        orderItems: orderItems,
      } as Order;
      onEdit(selectedOrder.id || -1, newOrder);
    }

    else{
      const newOrder = {
        customer: selectedCustomer,
        orderItems: orderItems,
      } as Order;
      onAdd(newOrder);
    }

    onClose();
    // e.preventDefault();
    // Handle form submission (e.g., send data to the server)
  };

  const handleEditQuantity = (orderItemId: number, quantity: number) => {
    //find the orderItem id, and update the quantity
    setOrderItems((prevItem) =>
      prevItem.map((item) =>
        item.id === orderItemId ? { ...item, quantity: quantity } : item,
      ),
    );
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;
    if (quantity <= 0) return;
    const item = {
      id: Date.now() + Math.floor(Math.random() * 100),
      productId: selectedProduct?.id,
      price: selectedProduct?.price,
      productName: selectedProduct?.name,
      quantity: quantity,
    } as OrderItem;

    //add the order it, but first check if the productId already exists in the orderItems array then update the quantity instead of adding a new item
    const index = orderItems.findIndex(
      (item) => item.productId === selectedProduct?.id,
    );
    if (index > -1) {
      const newOrderItems = [...orderItems];
      newOrderItems[index].quantity += quantity;
      setOrderItems(newOrderItems);
    } else {
      setOrderItems([...orderItems, item]);
    }

    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleDeleteItem = (productId: number) => {
    //find the productId based on the number in the array, then filter out
    const newOrderItems = orderItems.filter(
      (item) => item.productId !== productId,
    );
    setOrderItems(newOrderItems);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          {selectedOrder
            ? `Edit Order #${selectedOrder.id}`
            : "Create New Order"}
        </Typography>
      </Box>

      {selectedOrder && selectedCustomer && (
        <Alert id="orders-editing-info-alert" severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Editing order for <strong>{selectedCustomer.name}</strong> (ID: {selectedCustomer.id})
          </Typography>
        </Alert>
      )}

      {!selectedOrder && (
        <Card sx={{ mb: 4, bgcolor: "grey.50" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Select Customer
              </Typography>
            </Box>
            <Autocomplete
              sx={{ maxWidth: 400 }}
              id="order-customer-select"
              options={customers}
              value={selectedCustomer}
              getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
              onChange={(event, newValue) => onChangeCustomer(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="order-customer-input"
                  label="Choose customer for this order"
                  variant="outlined"
                  required
                  placeholder="Search customers..."
                />
              )}
            />
          </CardContent>
        </Card>
      )}

      {selectedCustomer && (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
          <Card sx={{ flex: 1, minWidth: 400 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AddIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Add Product to Order
                </Typography>
              </Box>
              
              <Stack spacing={3}>
                <Autocomplete
                  id="order-product-select"
                  value={selectedProduct}
                  options={products}
                  getOptionLabel={(option) => `${option.name} - $${option.price}`}
                  onChange={(e, newValue) => handleProductChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="order-product-input"
                      label="Select Product"
                      variant="outlined"
                      required
                      placeholder="Search products..."
                    />
                  )}
                />
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <TextField
                    id="order-quantity-input"
                    value={quantity || ""}
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    required
                    inputProps={{ min: 1 }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setQuantity(isNaN(value) ? 0 : value);
                    }}
                    sx={{ flex: 1 }}
                  />
                  
                  {selectedProduct && (
                    <Box sx={{ minWidth: 100, textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        Unit Price
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                        ${selectedProduct.price}
                      </Typography>
                      {quantity > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Total: ${(selectedProduct.price * quantity).toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
                
                <Button 
                  id="add-to-order-btn"
                  variant="contained" 
                  onClick={handleAddItem}
                  disabled={!selectedProduct || quantity <= 0}
                  startIcon={<AddIcon />}
                  size="large"
                  fullWidth
                >
                  Add to Order
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 2, minWidth: 600 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ShoppingCartIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Order Items
                </Typography>
                {orderItems.length > 0 && (
                  <Chip 
                    label={`${orderItems.length} item${orderItems.length > 1 ? 's' : ''}`}
                    color="primary"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>
              
              {orderItems.length === 0 ? (
                <Paper 
                  sx={{ 
                    p: 6, 
                    textAlign: "center",
                    backgroundColor: "grey.50",
                    border: "2px dashed #e0e0e0"
                  }}
                >
                  <ShoppingCartIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: "grey.400", 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
                    No Items Added
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select products from the left panel to add them to this order
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <TableContainer component={Paper} elevation={1}>
                    <Table id="order-items-table">
                      <TableHead>
                        <TableRow id="order-items-table-header" sx={{ backgroundColor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                          <TableCell sx={{ fontWeight: "bold", width: 120 }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: "bold", width: 100 }}>Unit Price</TableCell>
                          <TableCell sx={{ fontWeight: "bold", width: 100 }}>Total</TableCell>
                          <TableCell sx={{ fontWeight: "bold", width: 60 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((orderItem, index) => (
                          <TableRow 
                            id={`order-item-row-${orderItem.productId}`}
                            key={index}
                            sx={{ 
                              "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                              "&:hover": { backgroundColor: "#f0f0f0" }
                            }}
                          >
                            <TableCell id={`order-item-product-${orderItem.productId}`}>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {orderItem.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {orderItem.productId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                id={`order-item-quantity-${orderItem.id}`}
                                value={orderItem.quantity}
                                type="number"
                                variant="outlined"
                                size="small"
                                inputProps={{ min: 1 }}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (orderItem.id && !isNaN(value) && value > 0) {
                                    handleEditQuantity(orderItem.id, value);
                                  }
                                }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell id={`order-item-price-${orderItem.productId}`}>
                              <Typography variant="body2">
                                ${orderItem.price?.toFixed(2) || '0.00'}
                              </Typography>
                            </TableCell>
                            <TableCell id={`order-item-total-${orderItem.productId}`}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                ${orderItem.price && orderItem.quantity ? 
                                  (orderItem.price * orderItem.quantity).toFixed(2) : '0.00'
                                }
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                id={`delete-order-item-${orderItem.productId}`}
                                onClick={() => handleDeleteItem(orderItem.productId)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 3, p: 3, backgroundColor: "primary.light", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6" sx={{ color: "primary.contrastText" }}>
                        Order Total
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.contrastText" }}>
                        ${orderItems.reduce((total, item) => {
                          return total + (item.price ? item.price * item.quantity : 0);
                        }, 0).toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Button
                      id="submit-order-btn"
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      onClick={handleSubmit}
                      sx={{ 
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600
                      }}
                    >
                      {selectedOrder ? "Update Order" : "Create Order"}
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
};

export default OrderPage;
