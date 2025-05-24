import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
);

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

export default router; 