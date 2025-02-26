import { Router } from 'express';
import { register, login, logout } from '../controllers/user.controller.js';
import { isAuthenticated } from '../controllers/user.controller.js';

const router = Router();

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

// Protected route example to verify authentication
router.get("/authenticated", isAuthenticated, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.session.user, // User information from session
  });
});

export default router;
