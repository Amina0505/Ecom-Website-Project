import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, styled, Typography, Button, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Electronics Sale',
    link: '/category/electronics',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on latest gadgets',
    buttonText: 'Shop Now',
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80',
    alt: 'Fashion Collection',
    link: '/category/fashion',
    title: 'New Fashion Collection',
    subtitle: 'Discover the latest trends',
    buttonText: 'Explore More',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1683141443663-503f4140c667?q=80&w=1567&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Home & Furniture',
    link: '/category/furniture',
    title: 'Home & Furniture Sale',
    subtitle: 'Transform your living space',
    buttonText: 'View Collection',
  },
];

const BannerContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '70vh',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  display: 'flex',
  marginTop: '-10px',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
});

const BannerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
});

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(4, 8),
  color: 'white',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 4),
    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)',
  },
}));

const BannerControls = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  zIndex: 3,
});

const BannerDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 3,
}));

const Dot = styled('button')<{ active?: boolean }>(({ theme, active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: active ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.8)',
  },
}));

const BannerButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: '30px',
  border: '2px solid white',
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
  },
}));

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (link: string) => {
    navigate(link);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100vw', // Full viewport width
      height: { 
        xs: 'calc(100vh - 64px)', // Full viewport height minus header height for mobile
        sm: 'calc(100vh - 64px)', // For tablet
        md: 'calc(100vh - 64px)'  // For desktop
      },
      overflow: 'hidden',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    }}>
      {/* Banner Images */}
      {bannerImages.map((banner, index) => (
        <Box
          key={index}
          onClick={() => handleBannerClick(banner.link)}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={banner.url}
            alt={banner.alt}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // This ensures the image covers the full area
              objectPosition: 'center', // Centers the image
            }}
          />
          <BannerOverlay>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {banner.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                opacity: 0.9,
                maxWidth: '600px',
              }}
            >
              {banner.subtitle}
            </Typography>
            <BannerButton onClick={() => handleBannerClick(banner.link)}>
              {banner.buttonText}
            </BannerButton>
          </BannerOverlay>
        </Box>
      ))}

      <BannerControls>
        <IconButton onClick={prevSlide} size="large">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={nextSlide} size="large">
          <KeyboardArrowRight />
        </IconButton>
      </BannerControls>

      <BannerDots>
        {bannerImages.map((_, index) => (
          <Dot key={index} active={index === currentSlide} onClick={() => goToSlide(index)} />
        ))}
      </BannerDots>
    </Box>
  );
};

export default Banner;
