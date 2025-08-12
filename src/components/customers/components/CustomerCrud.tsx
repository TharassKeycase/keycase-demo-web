import React from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

import { Customer, CustomerFormProps } from "@/types/customer";

const CustomerCrud: React.FC<CustomerFormProps> = ({
  customer,
  onAdd,
  onEdit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: customer || {},
  });

  const onSubmit: SubmitHandler<Customer> = async (data) => {
    // Send data to the server
    if (customer && customer.id) {
      const result = await onEdit(customer.id, data);
      if (result) {
        onClose();
      }
    } else {
      const result = await onAdd(data);
      if (result) {
        onClose();
      }
    }   
  };

  return (
    <Paper>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {customer ? "EDIT" : "ADD"} Customer
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, width: 400 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="customer_name"
            label="Name"
            autoComplete="name"
            autoFocus
            {...register("name", { required: true })}
            error={!!errors.name}
            helperText={errors.name && "This field is required"}
            defaultValue={customer?.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="customer_email"
            label="Email Address"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            defaultValue={customer?.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="customer_address"
            label="Address"
            autoComplete="address"
            {...register("address", { required: true })}
            error={!!errors.address}
            helperText={errors.address && "This field is required"}
            defaultValue={customer?.address}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="customer_city"
            label="City"
            autoComplete="city"
            {...register("city", { required: true })}
            error={!!errors.city}
            helperText={errors.city && "This field is required"}
            defaultValue={customer?.city}
          />
          <TextField
            margin="normal"
            fullWidth
            id="customer_country"
            label="Country"
            autoComplete="country"
            {...register("country")}
            defaultValue={customer?.country}
          />
          <TextField
            margin="normal"
            fullWidth
            id="customer_phone"
            label="Phone"
            autoComplete="phone"
            {...register("phone")}
            defaultValue={customer?.phone}
          />
          <Button
            id="add_customer_submit"
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomerCrud;
