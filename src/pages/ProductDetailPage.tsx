import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Paper,
  Avatar,
  ListItem,
  List,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FavoriteBorder, Favorite, Send } from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useWishlist } from '../contexts/WishlistContext';

interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  _id?: string;
}

interface Product {
  id: string;
  _id?: string;  // MongoDB ID
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  stock?: number;
  isFeatured?: boolean;
  isCustom?: boolean;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
  reviews?: Review[];
  numOfReviews?: number;
  ratings?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  maxHeight: '500px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
});

const SizeButton = styled(Button)(({ theme }) => ({
  minWidth: '60px',
  margin: theme.spacing(0.5),
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const ReviewItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const ReviewAuthor = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isInWishlistState, setIsInWishlistState] = useState(false);

  // Review states
  const [reviewRating, setReviewRating] = useState<number | null>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product with ID:', id);
        
        const response = await axios.get(`http://localhost:5000/api/products/product/${id}`);
        console.log('Product response:', response.data);
        
        if (response.data.success && response.data.product) {
          const productData = response.data.product;
          setProduct(productData);
          setIsInWishlistState(isInWishlist(productData.id));
          
          // Fetch recommended products from the same category
          try {
            const categoryResponse = await axios.get(`http://localhost:5000/api/products?category=${productData.category}`);
            if (categoryResponse.data.success) {
              const recommended = categoryResponse.data.products
                .filter((p: Product) => p.id !== productData.id)
                .slice(0, 4);
              setRecommendedProducts(recommended);
            }
          } catch (categoryError) {
            console.error('Error fetching recommended products:', categoryError);
            // Don't set error state for recommended products failure
          }
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to load product details. Please try again later.');
        } else {
          setError('Failed to load product details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, isInWishlist]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please log in to add items to cart');
      setSnackbarOpen(true);
      return;
    }

    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    setSnackbarMessage('Product added to cart');
    setSnackbarOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!product) {
      setSnackbarMessage('Product not found');
      return;
    }

    if (isInWishlistState) {
      removeFromWishlist(product.id);
      setIsInWishlistState(false);
      setSnackbarMessage('Product removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating
      });
      setIsInWishlistState(true);
      setSnackbarMessage('Product added to wishlist');
    }
    setSnackbarOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setReviewError('Please log in to submit a review');
      return;
    }
    
    if (!reviewRating) {
      setReviewError('Please select a rating');
      return;
    }
    
    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }
    
    if (!product || !product.id) {
      setReviewError('Product information is missing');
      return;
    }
    
    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);
    
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await axios.put(
        'http://localhost:5000/api/products/review',
        {
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setReviewSuccess('Your review has been submitted successfully');
        setReviewComment('');
        setReviewRating(0);
        
        // Refresh product data to show the new review
        const productResponse = await axios.get(`http://localhost:5000/api/products/product/${id}`);
        if (productResponse.data.success) {
          setProduct(productResponse.data.product);
        }
      } else {
        setReviewError(response.data.message || 'Failed to submit review');
      }
    } catch (err: any) {
      console.error('Review submission error:', err);
      setReviewError(err.response?.data?.message || 'Error submitting review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <ProductImage src={product.image} alt={product.title} />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating.rate} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.rating.count} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          {/* Size Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Size
            </Typography>
            <Box>
              {sizes.map((size) => (
                <SizeButton
                  key={size}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? 'selected' : ''}
                >
                  {size}
                </SizeButton>
              ))}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {isInWishlistState ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          {/* Product Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Description" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1">
              {product.description}
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Review Form */}
            {isAuthenticated ? (
              <Box component="form" onSubmit={handleSubmitReview} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                
                {reviewError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {reviewError}
                  </Alert>
                )}
                
                {reviewSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {reviewSuccess}
                  </Alert>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Your Rating</Typography>
                  <Rating
                    name="review-rating"
                    value={reviewRating}
                    onChange={(_, newValue) => setReviewRating(newValue)}
                    precision={1}
                    size="large"
                  />
                </Box>
                
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  margin="normal"
                  required
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={reviewSubmitting}
                  startIcon={<Send />}
                  sx={{ mt: 2 }}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Please log in to write a review
              </Alert>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* Reviews List */}
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            
            {product.reviews && product.reviews.length > 0 ? (
              <List sx={{ width: '100%', pt: 0 }}>
                {product.reviews.map((review, index) => (
                  <ReviewItem key={review._id || index}>
                    <ReviewAuthor>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {review.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.name}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                    </ReviewAuthor>
                    <Typography variant="body1">{review.comment}</Typography>
                  </ReviewItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1">
              Free shipping on orders over $50. Standard delivery takes 3-5 business days.
            </Typography>
          </TabPanel>
        </Grid>
      </Grid>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Recommended Products
          </Typography>
          <Grid container spacing={3}>
            {recommendedProducts.map((recommendedProduct) => (
              <Grid item key={recommendedProduct.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/product/${recommendedProduct.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={recommendedProduct.image}
                    alt={recommendedProduct.title}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {recommendedProduct.title}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${recommendedProduct.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProductDetailPage; 