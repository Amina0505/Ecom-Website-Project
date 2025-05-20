const axios = require('axios');

// Replace with a valid seller token from your application
const token = 'YOUR_SELLER_TOKEN_HERE';

const testSellerDashboard = async () => {
  try {
    console.log('Testing seller dashboard API...');
    const response = await axios.get('http://localhost:5000/api/sellers/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testSellerDashboard(); 