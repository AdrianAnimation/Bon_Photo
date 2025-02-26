import express from 'express';
import InteractionController from '../controllers/interaction.controller.js';
import { isAuthenticated } from '../controllers/user.controller.js';
import { contentGuard } from "../../middleware/content-guard.middleware.js";

const router = express.Router();

// Get photo details with interactions
router.get('/photos/:photoId', InteractionController.getPhotoDetails);

// Like/unlike a photo (requires authentication)
router.post('/photos/:photoId/like', isAuthenticated, InteractionController.toggleLike);

// Add a comment to a photo (requires authentication and content validation)
router.post('/photos/:photoId/comments', isAuthenticated, contentGuard, InteractionController.addComment);

// Delete a comment (requires authentication)
router.delete('/comments/:commentId', isAuthenticated, InteractionController.deleteComment);

export default router;
