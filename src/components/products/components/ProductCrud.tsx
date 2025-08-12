import React from "react";

import {
  Box,
  Button, 
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Product, ProductFormProps } from "@/types/products";

const ProductCrud: React.FC<ProductFormProps> = ({
  product,
  onAdd,
  onEdit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: product || {},
  });

  const onSubmit: SubmitHandler<Product> = async (data) => {

    data.price = Number(data.price);

    // Send data to the server
    if (product && product.id) {
      onEdit(product.id, data);
    } else {
      const success = await onAdd(data);
      if (!success) {
        return; // don't close the form
      }
    }
    onClose();
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
          {product ? "EDIT" : "ADD"} product
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
            id="name"
            label="Name"
            autoComplete="name"
            autoFocus
            {...register("name", { required: true })}
            error={!!errors.name}
            helperText={errors.name && "This field is required"}
            defaultValue={product?.name}
          />
         
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            autoComplete="address"
            {...register("description", { required: true })}
            error={!!errors.description}
            helperText={errors.description && "This field is required"}
            defaultValue={product?.description}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            autoComplete="price"
            type="number"
            {...register("price", { required: true })}
            error={!!errors.price}
            helperText={errors.price && "This field is required"}
            defaultValue={product?.price}
          />         
          <Button
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

export default ProductCrud;
