import InteractionModel from '../models/interaction.model.js';

class InteractionController {
  // Toggle like on a photo
  async toggleLike(req, res) {
    try {
      const { photoId } = req.params;
      const userId = req.session.user.id;

      const hasLiked = await InteractionModel.hasUserLikedPhoto(userId, photoId);
      
      if (hasLiked) {
        await InteractionModel.removeLike(userId, photoId);
      } else {
        await InteractionModel.addLike(userId, photoId);
      }

      const likeCount = await InteractionModel.getLikeCount(photoId);
      
      res.json({
        success: true,
        liked: !hasLiked,
        likeCount
      });
    } catch (error) {
      console.error('Error in toggleLike:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like'
      });
    }
  }

  // Add a comment to a photo
  async addComment(req, res) {
    try {
      const { photoId } = req.params;
      const { content } = req.body;
      const userId = req.session.user.id;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Comment content is required'
        });
      }

      await InteractionModel.addComment(userId, photoId, content);
      const comments = await InteractionModel.getPhotoComments(photoId);

      res.json({
        success: true,
        comments
      });
    } catch (error) {
      console.error('Error in addComment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment'
      });
    }
  }

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.session.user.id;

      const result = await InteractionModel.deleteComment(commentId, userId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found or unauthorized'
        });
      }

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteComment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete comment'
      });
    }
  }

  // Get photo details with interactions
  async getPhotoDetails(req, res) {
    try {
      const { photoId } = req.params;
      const userId = req.session.user ? req.session.user.id : null;

      const photo = await InteractionModel.getPhotoWithInteractions(photoId);
      
      if (!photo) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      const hasLiked = userId ? await InteractionModel.hasUserLikedPhoto(userId, photoId) : false;
      const comments = await InteractionModel.getPhotoComments(photoId);

      res.json({
        success: true,
        photo: {
          ...photo,
          hasLiked,
          comments
        }
      });
    } catch (error) {
      console.error('Error in getPhotoDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get photo details'
      });
    }
  }
}

export default new InteractionController();
