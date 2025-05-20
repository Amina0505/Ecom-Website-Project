import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, CircularProgress, Alert, IconButton, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../api';

interface Product {
  _id?: string;
  id: string;
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
}

const ProductCard = styled(Card)(({ theme }) => ({
  width: '250px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  flexShrink: 0,
  margin: theme.spacing(0, 1),
  borderRadius: '8px',
  backgroundColor: '#fff',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  position: 'relative',
  padding: theme.spacing(1, 0),
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '75%',
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
});

const ProductPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '1.25rem',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
});

const HotProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setSnackbarMessage('Please log in to add items to cart');
      setSnackbarOpen(true);
      return;
    }

    addToCart({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    setSnackbarMessage('Product added to cart');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('HotProducts: Fetching products...');
        const response = await productService.getProducts();
        
        if (response.success) {
          const products = response.products;
          console.log('HotProducts: Products received, count:', products.length);
          
          if (products.length > 0) {
            // Log product sources
            const sources = products.map((p: Product) => p.source);
            const uniqueSources = Array.from(new Set(sources));
            console.log('Product sources:', uniqueSources);
            
            // Find any DB products
            const dbProducts = products.filter((p: Product) => p.source === 'database');
            console.log('Database products found:', dbProducts.length);
            
            if (dbProducts.length > 0) {
              console.log('Sample DB product:', dbProducts[0]);
            }
            
            // Sort products - ensure we display database products
            let sortedProducts: Product[] = [];
            
            // First add database products (up to 4 or all if less than 4)
            if (dbProducts.length > 0) {
              // Sort database products by rating
              const sortedDbProducts = [...dbProducts].sort((a, b) => b.rating.rate - a.rating.rate);
              sortedProducts = sortedDbProducts.slice(0, Math.min(4, dbProducts.length));
              console.log('Database products selected for display:', sortedProducts.length);
            }
            
            // Then fill remaining slots with highest rated products (that aren't already included)
            const remainingSlots = 8 - sortedProducts.length;
            if (remainingSlots > 0) {
              // Get IDs of already selected products to avoid duplicates
              const selectedIds = new Set(sortedProducts.map(p => p._id || p.id));
              
              // Filter and sort remaining products
              const otherProducts = products
                .filter((p: Product) => !selectedIds.has(p._id || p.id))
                .sort((a: Product, b: Product) => b.rating.rate - a.rating.rate)
                .slice(0, remainingSlots);
              
              sortedProducts = [...sortedProducts, ...otherProducts];
            }
            
            console.log('Final products to display:', sortedProducts.length);
            console.log('Database products in final display:', 
              sortedProducts.filter(p => p.source === 'database').length);
            
            setProducts(sortedProducts);
          } else {
            setError('No products found. Please try again later.');
          }
        } else {
          setError('Failed to load products. Please try again later.');
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress color="secondary" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 4,
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      pl: { xs: 2, md: 4 },
    }}>
      <Container maxWidth={false} disableGutters>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 700,
            textAlign: 'left',
            color: '#2C3E50',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              backgroundColor: 'secondary.main',
              margin: '12px 0',
              borderRadius: '2px',
            },
          }}
        >
          Hot Products
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {showLeftArrow && (
            <ScrollButton
              onClick={() => scroll('left')}
              sx={{ left: 0 }}
              size="large"
            >
              <ChevronLeft />
            </ScrollButton>
          )}
          
          <ScrollContainer
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {products.map((product) => (
              <ProductCard 
                key={product._id || product.id}
                onClick={() => handleProductClick(product._id || product.id)}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      lineHeight: '1.3em',
                      height: '2.6em',
                    }}
                  >
                    {product.title}
                  </Typography>
                  
                  {product.storeName && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Seller: {product.storeName}
                    </Typography>
                  )}
                  
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <Rating
                      value={product.rating.rate}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  
                  <ProductPrice variant="h6">
                    ${product.price.toFixed(2)}
                  </ProductPrice>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    sx={{ width: '100%', borderRadius: '4px' }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </ProductCard>
            ))}
          </ScrollContainer>
          
          {showRightArrow && (
            <ScrollButton
              onClick={() => scroll('right')}
              sx={{ right: 0 }}
              size="large"
            >
              <ChevronRight />
            </ScrollButton>
          )}
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default HotProducts; 