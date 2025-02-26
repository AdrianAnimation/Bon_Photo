import pool from "../config/db.js";

class InteractionModel {
  // Add a like to a photo
  async addLike(userId, photoId) {
    const [result] = await pool.query(
      `INSERT INTO likes (users_id, photos_id, date) VALUES (?, ?, NOW())`,
      [userId, photoId]
    );
    return result;
  }

  // Remove a like from a photo
  async removeLike(userId, photoId) {
    const [result] = await pool.query(
      `DELETE FROM likes WHERE users_id = ? AND photos_id = ?`,
      [userId, photoId]
    );
    return result;
  }

  // Check if a user has liked a photo
  async hasUserLikedPhoto(userId, photoId) {
    const [rows] = await pool.query(
      `SELECT * FROM likes WHERE users_id = ? AND photos_id = ?`,
      [userId, photoId]
    );
    return rows.length > 0;
  }

  // Get like count for a photo
  async getLikeCount(photoId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM likes WHERE photos_id = ?`,
      [photoId]
    );
    return rows[0].count;
  }

  // Add a comment to a photo
  async addComment(userId, photoId, content) {
    const [result] = await pool.query(
      `INSERT INTO comments (user_id, photo_id, content, status) VALUES (?, ?, ?, 1)`,
      [userId, photoId, content]
    );
    return result;
  }

  // Get comments for a photo with user info
  async getPhotoComments(photoId) {
    const [rows] = await pool.query(
      `SELECT c.*, u.username, u.id as user_id 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.photo_id = ? AND c.status = 1 
       ORDER BY c.date DESC`,
      [photoId]
    );
    return rows;
  }

  // Delete a comment
  async deleteComment(commentId, userId) {
    const [result] = await pool.query(
      `DELETE FROM comments WHERE id = ? AND user_id = ?`,
      [commentId, userId]
    );
    return result;
  }

  // Get photo details with likes and comments count
  async getPhotoWithInteractions(photoId) {
    const [rows] = await pool.query(
      `SELECT p.*, 
              u.username as photographer_name,
              ud.location as photographer_location,
              COUNT(DISTINCT l.users_id) as likes_count,
              COUNT(DISTINCT c.id) as comments_count
       FROM photos p
       LEFT JOIN users u ON p.users_id = u.id
       LEFT JOIN user_details ud ON u.id = ud.users_id
       LEFT JOIN likes l ON p.id = l.photos_id
       LEFT JOIN comments c ON p.id = c.photo_id AND c.status = 1
       WHERE p.id = ?
       GROUP BY p.id`,
      [photoId]
    );
    return rows[0];
  }
}

export default new InteractionModel();
