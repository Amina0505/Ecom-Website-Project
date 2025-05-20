import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  FormHelperText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// Add a base URL constant
const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend URL

// Define product categories matching the backend enum
const productCategories = [
  'electronics',
  'fashion',
  'furniture',
  'grocery',
  'gaming',
  'beauty',
  'books'
];

// Category display names (for user-friendly display)
const categoryDisplayNames: Record<string, string> = {
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'furniture': 'Home & Furniture',
  'grocery': 'Grocery',
  'gaming': 'Gaming',
  'beauty': 'Beauty & Personal Care',
  'books': 'Books'
};

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
}

interface SubmitProductFormProps {
  onSubmissionSuccess?: () => void;
}

const initialFormState: FormData = {
  title: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  image: ''
};

interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  image?: string;
}

const SubmitProductForm: React.FC<SubmitProductFormProps> = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user selects
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setFormData({
      ...formData,
      image: value
    });
    
    // Clear image error if it exists
    if (errors.image) {
      setErrors({
        ...errors,
        image: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URLs
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Submitting product with token:', !!token);

      // Prepare the data according to the backend model
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image
      };
      
      console.log('Submitting product data:', productData);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/sellers/products/submit`, 
        productData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Product submission response:', response.data);
      
      setSubmitSuccess(true);
      setFormData(initialFormState);
      
      // Call the callback if provided
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting product:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
        setSubmitError(error.response.data.message || 'Failed to submit product. Please try again.');
      } else {
        setSubmitError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Submit a New Product
      </Typography>
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Product submitted successfully! Your submission is now pending approval.
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Price ($)"
              name="price"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={formData.price}
              onChange={handleInputChange}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Stock Quantity"
              name="stock"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.stock}
              onChange={handleInputChange}
              error={!!errors.stock}
              helperText={errors.stock}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleSelectChange}
              >
                {productCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {categoryDisplayNames[category]}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Product Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Product Image URL"
              name="image"
              value={formData.image}
              onChange={handleImageUrlChange}
              error={!!errors.image}
              helperText={errors.image || "Enter a valid URL to your product image"}
              placeholder="https://example.com/your-image.jpg"
            />
            
            {formData.image && isValidUrl(formData.image) && (
              <Box sx={{ mt: 2, maxWidth: 300, mx: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom>Image Preview:</Typography>
                <img 
                  src={formData.image} 
                  alt="Product Preview"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x300?text=Image+Load+Error';
                  }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit Product for Review'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SubmitProductForm; 