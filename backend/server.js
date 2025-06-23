const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'https://calendar-scheduling-6rhl.vercel.app', // Your frontend on Vercel
  'http://localhost:3000'                        // Local dev (optional)
];

// ✅ Apply CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true // if you're using cookies, auth headers, etc.
}));

// ✅ Add body parser middleware (optional but useful)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Simple test route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running correctly!',
    environment: process.env.NODE_ENV || 'development',
    port: port,
    time: new Date().toISOString()
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Current directory: ${__dirname}`);
});
