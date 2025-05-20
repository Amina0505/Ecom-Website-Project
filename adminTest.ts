import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('Attempting to login as admin...');
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@example.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      // Test getting users with the admin token
      await testGetUsers(response.data.token);
    }
  } catch (error: any) {
    console.error('Error testing admin login:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

const testGetUsers = async (token: string) => {
  try {
    console.log('Attempting to fetch users with admin token...');
    const response = await axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Users response status:', response.status);
    console.log('Total users found:', response.data.users?.length || 0);
    console.log('Users response data:', response.data);
  } catch (error: any) {
    console.error('Error fetching users:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testAdminLogin(); 