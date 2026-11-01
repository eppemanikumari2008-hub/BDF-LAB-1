// server.js
// Main Express server for BDF Lab 01: Node.js and Express Server
// Student: E. Mani Kumari (252U1R5044) | Section: AIDE-2A

const express = require('express');

// Initialize the Express application
const app = express();

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route 1: GET / - Welcome message
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Node.js and Express Server');
});

// Route 2: GET /about - Student information in JSON
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'E. Mani Kumari',
    registrationNumber: '252U1R5044',
    section: 'AIDE-2A'
  });
});

// Route 3: GET /time - Current date and time
app.get('/time', (req, res) => {
  const currentTime = new Date();
  // Return JSON if explicitly requested, otherwise default to date string
  if (req.query.format === 'json') {
    return res.status(200).json({
      currentTime: currentTime.toISOString(),
      timestamp: currentTime.getTime()
    });
  }
  res.status(200).send(currentTime.toString());
});

// Route 4: 404 Handler for all unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server only if this file is run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
    console.log(`Access the server at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please free port ${PORT} or configure a different PORT environment variable.`);
    } else {
      console.error('Error starting server:', err.message);
    }
  });
}

module.exports = app;
