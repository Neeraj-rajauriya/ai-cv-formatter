import express from 'express';
import { registerUser,loginUser, verifyToken } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/verify', authMiddleware, verifyToken);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
