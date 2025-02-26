import pool from "../config/db.js";
import bcrypt from "bcrypt";

class UserModel {
  // Method to create a new user
  async createUser({ username, email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password, created_at, role_id) VALUES (?, ?, ?, NOW(), 1)",
        [username, email, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  // Find a user by email
  async findUserByEmail(email) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows[0];
    } catch (error) {
      console.error('Error in findUserByEmail:', error);
      throw error;
    }
  }

  // Find a user by ID
  async findUserById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in findUserById:', error);
      throw error;
    }
  }

  // Find a user by username
  async findUserByUsername(username) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
      return rows[0];
    } catch (error) {
      console.error('Error in findUserByUsername:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(inputPassword, hashedPassword) {
    try {
      return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
      console.error('Error in verifyPassword:', error);
      throw error;
    }
  }
}

export default new UserModel();