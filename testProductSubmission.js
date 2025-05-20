const axios = require('axios');

// Replace with a valid seller token from your application
const token = 'YOUR_SELLER_TOKEN_HERE';

const testProductSubmission = async () => {
  try {
    console.log('Testing product submission API...');
    
    // Sample product data that matches the schema requirements
    const productData = {
      title: 'Test Product',
      description: 'This is a test product description',
      price: 99.99,
      category: 'electronics',
      image: 'https://example.com/image.jpg',
      stock: 10
    };
    
    console.log('Submitting product data:', productData);
    
    const response = await axios.post(
      'http://localhost:5000/api/sellers/products/submit', 
      productData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testProductSubmission(); 