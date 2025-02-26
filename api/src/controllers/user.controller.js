import UserModel from "../models/user.model.js";
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate if user or email already exist
    const existingUser = await UserModel.findUserByUsername(username);
    const existingEmail = await UserModel.findUserByEmail(email);
    if (existingUser || existingEmail) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    // Create user folders
    try {
      const userFolder = email.split('@')[0];
      const basePath = path.join(__dirname, '..', '..', 'uploads', userFolder);
      
      // Create the user's folders
      await fs.mkdir(path.join(basePath, 'full'), { recursive: true });
      await fs.mkdir(path.join(basePath, 'thumb'), { recursive: true });
      
      console.log(`Created folders for user ${userFolder}`);
    } catch (folderError) {
      console.error('Error creating user folders:', folderError);
      return res.status(500).json({ error: "Failed to create user folders" });
    }

    // Create the user
    const userId = await UserModel.createUser({ username, email, password });
    res.status(201).json({ 
      message: "User registered successfully", 
      userId,
      folderCreated: true 
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ error: error.message });
  }
};

// Log in
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserModel.findUserByUsername(username);
    if (!user || !(await UserModel.verifyPassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Regenerate session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).json({ error: "Session error" });
      }

      // Save user data in new session
      req.session.user = { 
        id: user.id, 
        username: user.username,
        loginTime: Date.now()
      };

      // Save session
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: "Session save error" });
        }
        res.status(200).json({ 
          message: "Login successful", 
          user: { id: user.id, username: user.username }
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Log out
const logout = (req, res) => {
  const cookieName = 'bon_photo_sid'; // Match session name

  if (!req.session) {
    // Already logged out
    res.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return res.status(200).json({ message: "Already logged out" });
  }

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: "Error during logout" });
    }

    // Clear cookie with matching settings
    res.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({ message: "Logout successful" });
  });
};

// Middleware to verify authentication
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export { register, login, logout, isAuthenticated };
