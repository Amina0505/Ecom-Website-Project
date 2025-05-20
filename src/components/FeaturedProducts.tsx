import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { productService } from '../api';

interface Product {
  id: string;
  _id?: string;  // MongoDB ID
  title: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
  source?: 'database' | 'frontend';
  seller?: string;
  storeName?: string;
  isFeatured?: boolean;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProducts();
        
        if (response.success) {
          // First get explicitly featured products
          let featuredProducts = response.products.filter((product: Product) => 
            product.isFeatured === true
          );
          
          // If we don't have enough featured products, add high-rated products
          if (featuredProducts.length < 4) {
            const highRatedProducts = response.products
              .filter((product: Product) => 
                !featuredProducts.some((fp: Product) => (fp._id || fp.id) === (product._id || product.id)) &&
                (product.rating.rate >= 4.5 || product.rating.count >= 100)
              )
              .slice(0, 4 - featuredProducts.length);
              
            featuredProducts = [...featuredProducts, ...highRatedProducts];
          }
          
          // Limit to 4 products
          featuredProducts = featuredProducts.slice(0, 4);
          
          setProducts(featuredProducts);
        } else {
          setError('Failed to load featured products. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product._id || product.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    transition: 'all 0.3s ease',
                  },
                }}
                onClick={() => handleProductClick(product._id || product.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{ objectFit: 'contain', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3" noWrap>
                    {product.title}
                  </Typography>
                  
                  {product.storeName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Seller: {product.storeName}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => handleAddToCart(e, product)}
                    sx={{ mt: 2 }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedProducts; 