
// Import required modules
import { Router } from 'express';
import express from "express";
const router = express.Router();

// Import route modules
import userRoutes from './user.routes.js';
import productRoutes from './dashboard.routes.js';
import interactionRoutes from './interaction.routes.js';
import searchRoutes from './searchbar.routes.js'; 

// Define route groups
router.use('/users', userRoutes);   
router.use('/dashboard', productRoutes); 
router.use('/interactions', interactionRoutes); 
router.use('/search', searchRoutes); 

// Default route for unmatched endpoints
router.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Export the router
export default router;