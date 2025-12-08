// Test Update Profile API
const http = require('http');

// Bước 1: Login để lấy token
function login() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: 'test@example.com',
      password: 'test1234'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };

    console.log('🔐 Step 1: Logging in...');
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log('✅ Login successful!');
          console.log('Token:', response.token ? response.token.substring(0, 30) + '...' : 'NO TOKEN');
          resolve(response.token);
        } else {
          console.log('❌ Login failed:', data);
          reject(new Error('Login failed'));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Login error:', e.message);
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

// Bước 2: Update profile
function updateProfile(token) {
  return new Promise((resolve, reject) => {
    const updateData = JSON.stringify({
      fullName: 'Nguyễn Văn Test ' + Date.now()
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': updateData.length
      }
    };

    console.log('\n📝 Step 2: Updating profile...');
    console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);
    console.log('Method:', options.method);
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('\nStatus Code:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('\nResponse Body:');
        try {
          console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
          console.log(data);
        }
        
        if (res.statusCode === 200) {
          console.log('\n✅ Profile updated successfully!');
          resolve();
        } else {
          console.log('\n❌ Failed to update profile');
          reject(new Error('Update failed'));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Update error:', e.message);
      reject(e);
    });

    req.write(updateData);
    req.end();
  });
}

// Main
async function main() {
  console.log('🧪 Testing Update Profile API\n');
  console.log('='.repeat(50));
  
  try {
    const token = await login();
    if (!token) {
      console.log('\n❌ FAILED: No token received from login!');
      console.log('💡 Solution: Restart auth-service to load JWT code');
      return;
    }
    
    await updateProfile(token);
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED!');
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ TEST FAILED:', error.message);
  }
}

main();






