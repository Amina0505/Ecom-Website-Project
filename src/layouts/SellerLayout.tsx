import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SellerSidebar from '../components/seller/SellerSidebar';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex' }}>
            <SellerSidebar />
            <Box
              sx={{
                flexGrow: 1,
                p: { xs: 1, md: 2 },
                width: { xs: '100%', md: 'calc(100% - 240px)' },
              }}
            >
              {children}
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default SellerLayout; 