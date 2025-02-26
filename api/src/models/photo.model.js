import pool from "../config/db.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Photos {
  // Crear una nueva foto
  static async createPhoto({ title, description, photo_url, alt, users_id, categories_id, status }) {
    const [result] = await pool.query(
      "INSERT INTO photos (title, description, photo_url, alt, users_id, categories_id, status, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
      [title, description, photo_url, alt, users_id, categories_id, status]
    );
    return result.insertId;
  }

  // Obtener fotos por ID de usuario
  static async getPhotosByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT p.*, u.username as photographer_name 
      FROM photos p 
      JOIN users u ON p.users_id = u.id 
      WHERE p.users_id = ?
      ORDER BY p.upload_date DESC
    `, [userId]);
    return rows;
  }

  // Actualizar una foto
  static async updatePhoto(id, { title, description, photo_url, alt, categories_id }) {
    const [result] = await pool.query(
      "UPDATE photos SET title = ?, description = ?, photo_url = ?, alt = ?, categories_id = ? WHERE id = ?",
      [title, description, photo_url, alt, categories_id, id]
    );
    return result.affectedRows;
  }

  // Eliminar una foto
  static async deletePhoto(id) {
    try {
      // First get the photo details
      const [photo] = await pool.query("SELECT photo_url, users_id FROM photos WHERE id = ?", [id]);
      if (!photo[0]) return { affectedRows: 0, photo: null };

      // Get the photo paths
      const photoUrl = photo[0].photo_url;
      const baseDir = path.join(__dirname, '..', '..'); 
      const fullPhotoPath = path.join(baseDir, photoUrl);
      const thumbPath = fullPhotoPath.replace('\\full\\', '\\thumb\\');

      // Delete the database record
      const [result] = await pool.query("DELETE FROM photos WHERE id = ?", [id]);

      // If database deletion was successful, delete the files
      if (result.affectedRows > 0) {
        try {
          await Promise.allSettled([
            fs.unlink(fullPhotoPath),
            fs.unlink(thumbPath)
          ]);
          console.log('Photo deleted successfully');
        } catch (fileError) {
          console.error('Error deleting photo files');
        }
      }

      return { affectedRows: result.affectedRows, photo: photo[0] };
    } catch (error) {
      console.error('Error in deletePhoto:', error);
      throw error;
    }
  }

  // Obtener un número limitado de fotos públicas
  static async getPublicPhotos(limit) {
    const [rows] = await pool.query(`
      SELECT p.*, u.username as photographer_name 
      FROM photos p 
      JOIN users u ON p.users_id = u.id 
      WHERE p.status = 1 
      ORDER BY p.upload_date DESC 
      LIMIT ?
    `, [limit]);
    return rows;
  }

  // Obtener fotos aleatorias públicas
  static async getRandomPublicPhotos(limit = 30) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u.username as photographer_name,
        c.name as category_name
      FROM photos p 
      JOIN users u ON p.users_id = u.id 
      JOIN categories c ON p.categories_id = c.id
      WHERE p.status = 1 
      ORDER BY RAND() 
      LIMIT ?
    `, [limit]);
    return rows;
  }

  // Obtener una foto por ID
  static async getPhotoById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, u.username as photographer_name 
      FROM photos p 
      JOIN users u ON p.users_id = u.id 
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }
}

export default Photos;
