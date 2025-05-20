import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface EditProductProps {
  productId: string;
  onSuccess: () => void;
}

const categories = [
  'electronics',
  'fashion',
  'furniture',
  'grocery',
  'gaming',
  'beauty',
  'books',
];

const EditProduct: React.FC<EditProductProps> = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        const product = response.data;
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image,
          stock: product.stock.toString(),
          isFeatured: product.isFeatured,
        });
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isFeatured: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await axios.put(`http://localhost:5000/api/products/${productId}`, productData);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Product
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Product updated successfully!
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'grid',
          gap: 2,
          maxWidth: 600,
        }}
      >
        <TextField
          required
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          required
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          required
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          required
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          required
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isFeatured}
              onChange={handleFeaturedChange}
              name="isFeatured"
            />
          }
          label="Featured Product"
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Update Product
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onSuccess}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditProduct; 