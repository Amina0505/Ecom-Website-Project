import React from 'react';
import { Box } from '@mui/material';
import Banner from '../components/Banner';
import HotProducts from '../components/HotProducts';
import FeaturedProducts from '../components/FeaturedProducts';
import ElectronicsProducts from '../components/ElectronicsProducts';
import Gadgets from '../components/Gadgets';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ 
      width: '100%',
      overflowX: 'hidden', // Prevent horizontal scroll
    }}>
      <Banner />
      <HotProducts />
      <FeaturedProducts />
      <ElectronicsProducts />
      <Gadgets />
    </Box>
  );
};

export default HomePage;
