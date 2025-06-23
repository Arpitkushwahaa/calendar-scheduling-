// Simple test server for Render deployment
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running correctly!',
    environment: process.env.NODE_ENV || 'development',
    port: port,
    time: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Current directory: ${__dirname}`);
}); 