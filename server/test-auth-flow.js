const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuthFlow() {
  console.log('🧪 Testing User Management API Authentication Flow\n');

  try {
    // Test 1: Register a new user
    console.log('1. Registering a new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Registration successful!');
    console.log('User:', registerResponse.data.user);
    console.log('Access Token:', registerResponse.data.accessToken.substring(0, 50) + '...');
    console.log('Refresh Token:', registerResponse.data.refreshToken.substring(0, 50) + '...\n');

    const { accessToken, refreshToken } = registerResponse.data;

    // Test 2: Login with the registered user
    console.log('2. Logging in with the registered user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('New Access Token:', loginResponse.data.accessToken.substring(0, 50) + '...');
    console.log('New Refresh Token:', loginResponse.data.refreshToken.substring(0, 50) + '...\n');

    // Test 3: Refresh the access token
    console.log('3. Refreshing access token...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: loginResponse.data.refreshToken
    });

    console.log('✅ Token refresh successful!');
    console.log('New Access Token:', refreshResponse.data.accessToken.substring(0, 50) + '...');
    console.log('New Refresh Token:', refreshResponse.data.refreshToken.substring(0, 50) + '...\n');

    // Test 4: Test protected route (if you have any)
    console.log('4. Testing protected route access...');
    try {
      const protectedResponse = await axios.get(`${BASE_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${refreshResponse.data.accessToken}`
        }
      });
      console.log('✅ Protected route access successful!');
      console.log('Response:', protectedResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  Protected route not implemented yet (404 - Not Found)');
      } else {
        console.log('❌ Protected route access failed:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 All authentication tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAuthFlow();
}

module.exports = { testAuthFlow };