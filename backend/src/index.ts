import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import contractRoutes from './routes/contracts';
import { apiRouter } from './routes/api';
import userRoutes from './routes/user';


// Load environment variables from .env file
dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// CORS Configuration
const corsOptions = {
  origin: [
    'https://identichain.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug route to show available endpoints
app.get('/debug/routes', (req, res) => {
  res.json({
    availableRoutes: [
      'GET /health',
      'GET /debug/routes',
      'POST /api/register',
      'POST /api/issueCredential', 
      'POST /api/requestAccess',
      'POST /api/consent',
      'POST /api/verifyCredential',
      'POST /api/verifyProfileHash',
      'GET /api/audit/recent',
      'GET /api/audit/by-address/:address',
      'POST /api/user/register',
      'GET /api/user/:walletAddress',
      'GET /api/user/:walletAddress/credentials',
      'GET /api/user/:walletAddress/access-requests',
      'GET /api/contracts/addresses',
      'POST /api/contracts/credential/issue',
      'POST /api/contracts/access/request',
      'POST /api/contracts/access/approve',
      'POST /api/contracts/identity/create'
    ],
    timestamp: new Date().toISOString()
  });
});

// Contract routes
app.use('/api/contracts', contractRoutes);

// User routes
app.use('/api/user', userRoutes);

// Other API routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 IdentiChain Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Contract API: http://localhost:${PORT}/api/contracts`);
});

export default app;
