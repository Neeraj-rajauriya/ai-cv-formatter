import express from 'express';
import multer from 'multer';
import uploadCV from '../controllers/uploadController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

// Define multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route
router.post('/upload', authMiddleware, upload.single('cv'), uploadCV);

export default router;
