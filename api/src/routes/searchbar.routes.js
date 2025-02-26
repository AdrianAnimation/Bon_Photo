import { Router } from 'express';
import { searchPhotos } from '../controllers/searchbar.controller.js';

const router = Router();

// Search route
router.get('/photos', searchPhotos);

export default router;  
