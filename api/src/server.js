import "dotenv/config";
import express from 'express';
import path from "path";
import cors from 'cors';
import session from "express-session";
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const MySQLStore = require("express-mysql-session")(session);

import router from "./routes/index.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:5173"], // Allow connection to React dev server
      upgradeInsecureRequests: null // Don't upgrade during development
    }
  },
  crossOriginEmbedderPolicy: false // Allow loading resources from different origins
}));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session configuration
app.use(
  session({
    name: 'bon_photo_sid',  // Explicit session name
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'  // Explicit path
    },
    store: new MySQLStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      createDatabaseTable: true,
      clearExpired: true,
      checkExpirationInterval: 900000, // Clean up every 15 minutes
      expiration: 86400000 // Session expires in 24 hours
    })
  })
);

// API Routes
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
