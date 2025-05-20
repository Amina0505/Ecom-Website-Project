import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, Grid, CircularProgress, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
  category: string;
}

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9
  position: 'relative',
});

const PriceTypography = styled(Typography)({
  fontWeight: 'bold',
  color: '#2e7d32',
});

const Gadgets: React.FC = () => {
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
        const response = await axios.get('http://localhost:5000/api/products');
        
        if (response.data.success) {
          const products = response.data.products;
          if (products.length > 0) {
            const gadgetProducts = products.filter((product: Product) =>
              product.category === 'electronics' ||
              product.category === 'gaming' ||
              product.title.toLowerCase().includes('gadget') ||
              product.title.toLowerCase().includes('smart') ||
              product.title.toLowerCase().includes('device') ||
              product.title.toLowerCase().includes('watch')
            );
            setProducts(gadgetProducts);
          } else {
            setError('No gadget products found. Please try again later.');
          }
        } else {
          setError('Failed to load gadget products. Please try again later.');
        }
      } catch (err) {
        setError('Failed to load gadget products. Please try again later.');
        console.error('Error fetching products:', err);
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
      id: product.id,
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
      <Box sx={{ py: 8 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 6,
      backgroundColor: '#f8f9fa',
      position: 'relative',
      width: '100%',
    }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: '#1a1a1a',
            position: 'relative',
            pl: { xs: 2, md: 4 },
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #1a1a1a 0%, #666 100%)',
              margin: '16px 0',
              borderRadius: '2px',
            },
          }}
        >
          Cool Gadgets
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button 
                    size="large" 
                    sx={{ 
                      width: '100%',
                      bgcolor: '#2e7d32',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1b5e20',
                      },
                    }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Gadgets; 