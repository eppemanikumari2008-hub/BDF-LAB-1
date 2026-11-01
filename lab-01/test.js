// test.js
// Automated test script to verify all endpoints and status codes for Lab 01

const http = require('http');
const app = require('./server');

async function runTests() {
  const PORT = 3001; // Use separate port for test isolation
  const server = app.listen(PORT);

  console.log(`[TEST SUITE] Starting test suite on http://localhost:${PORT}...\n`);

  let passed = 0;
  let total = 0;

  async function testEndpoint(name, path, expectedStatus, validator) {
    total++;
    try {
      const res = await fetch(`http://localhost:${PORT}${path}`);
      const status = res.status;
      const text = await res.text();

      let body = text;
      try {
        body = JSON.parse(text);
      } catch (e) {
        // text is fine
      }

      const statusMatch = status === expectedStatus;
      const contentValid = validator ? validator(body, text, res) : true;

      if (statusMatch && contentValid) {
        console.log(`✅ [PASS] ${name}`);
        console.log(`   Endpoint: ${path} | Status: ${status}`);
        console.log(`   Response: ${typeof body === 'object' ? JSON.stringify(body) : body}\n`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name}`);
        console.error(`   Endpoint: ${path} | Expected Status: ${expectedStatus}, Got: ${status}`);
        console.error(`   Response: ${text}\n`);
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${name}:`, err.message, '\n');
    }
  }

  // 1. GET /
  await testEndpoint('Home Route', '/', 200, (body, text) => {
    return text.includes('Welcome to Node.js and Express Server');
  });

  // 2. GET /about
  await testEndpoint('About Route', '/about', 200, (body) => {
    return (
      typeof body === 'object' &&
      body.name === 'E. Mani Kumari' &&
      body.section === 'AIDE-2A' &&
      body.registrationNumber === '252U1R5044'
    );
  });

  // 3. GET /time
  await testEndpoint('Time Route', '/time', 200, (body, text) => {
    const parsedDate = new Date(text);
    return !isNaN(parsedDate.getTime()) || (typeof body === 'object' && body.currentTime);
  });

  // 4. GET /time with format=json
  await testEndpoint('Time Route (JSON format)', '/time?format=json', 200, (body) => {
    return typeof body === 'object' && Boolean(body.currentTime);
  });

  // 5. GET /invalid (Unknown Route)
  await testEndpoint('404 Not Found Route (/invalid)', '/invalid', 404, (body) => {
    return typeof body === 'object' && body.message === 'Route not found';
  });

  // 6. GET /another-unknown-path
  await testEndpoint('404 Not Found Route (/some/other/path)', '/some/other/path', 404, (body) => {
    return typeof body === 'object' && body.message === 'Route not found';
  });

  server.close(() => {
    console.log(`[TEST SUMMARY] Tests completed: ${passed}/${total} passed.`);
    if (passed === total) {
      console.log('🎉 All Express endpoint tests PASSED successfully!\n');
    } else {
      console.error('⚠️ Some tests failed. Please review.');
      process.exit(1);
    }
  });
}

runTests();

