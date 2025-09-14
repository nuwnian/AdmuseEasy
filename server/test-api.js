// Simple API test script
// Run with: node test-api.js

const baseURL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing AdmuseEasy API...\n');

  // Test 1: Health check
  try {
    const response = await fetch(`${baseURL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.message);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }

  // Test 2: Register user
  let token = null;
  try {
    const response = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    if (response.ok) {
      token = data.token;
      console.log('✅ User Registration:', data.message);
    } else {
      console.log('⚠️ User Registration:', data.message);
    }
  } catch (error) {
    console.log('❌ User Registration failed:', error.message);
  }

  // Test 3: Login user
  if (!token) {
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const data = await response.json();
      if (response.ok) {
        token = data.token;
        console.log('✅ User Login:', data.message);
      } else {
        console.log('❌ User Login:', data.message);
      }
    } catch (error) {
      console.log('❌ User Login failed:', error.message);
    }
  }

  // Test 4: Save project (requires auth)
  if (token) {
    try {
      const response = await fetch(`${baseURL}/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Project',
          productName: 'Amazing Coffee',
          description: 'Best coffee in town',
          targetAudience: 'Coffee lovers',
          mascot: 'hamster',
          generatedCopy: 'Test copy here'
        })
      });
      const data = await response.json();
      console.log('✅ Save Project:', data.message);
    } catch (error) {
      console.log('❌ Save Project failed:', error.message);
    }
  }

  // Test 5: Get dashboard
  if (token) {
    try {
      const response = await fetch(`${baseURL}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('✅ Dashboard:', `${data.stats.totalProjects} projects, ${data.stats.totalGenerations} generations`);
    } catch (error) {
      console.log('❌ Dashboard failed:', error.message);
    }
  }

  console.log('\n🎉 API testing complete!');
}

// Run tests
testAPI();