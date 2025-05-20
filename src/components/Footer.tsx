import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="h6" gutterBottom>
              "Welcome to our online store, where convenience meets quality in
              every click." Let me know if you want a more formal, friendly, or
              poetic ton
            </Typography>

            {/* <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              About
            </Link>
            <Link
              component={RouterLink}
              to="/careers"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Careers
            </Link>
            <Link
              component={RouterLink}
              to="/press"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Press
            </Link> */}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link
              component={RouterLink}
              to="/help"
              color="inherit"
              underline="none"
              display="block"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'green',
                },
              }}
            >
              Help Center: 1234567890
            </Link>
            <Link
              component={RouterLink}
              to="/returns"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'green',
                },
              }}
            >
              Returns : 1234567890
            </Link>
            <Link
              component={RouterLink}
              to="/shipping"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'green',
                },
              }}
            >
              Shipping Info : 1234567890
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>

            <Link
              href="https://facebook.com"
              color="inherit"
              display="flex"
              alignItems="center"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: '#1877F2', // Facebook blue
                },
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon sx={{ mr: 1 }} />
              Facebook
            </Link>

            <Link
              href="https://twitter.com"
              color="inherit"
              display="flex"
              alignItems="center"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'blue', // Twitter blue
                },
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon sx={{ mr: 1 }} />
              Twitter
            </Link>

            <Link
              href="https://instagram.com"
              color="inherit"
              display="flex"
              alignItems="center"
              sx={{
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: '#E4405F', // Instagram pink
                },
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon sx={{ mr: 1 }} />
              Instagram
            </Link>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="inherit"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
