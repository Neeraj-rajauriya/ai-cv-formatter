// routes/index.js
import express from 'express';
import userRoutes from './userRoutes.js';
import uploadRoutes from './uploadRoutes.js';
// import cvRoutes from './cvRoutes.js'  // agar chahiye

const router = express.Router();

router.use('/users', userRoutes);
router.use('/cv', uploadRoutes);
// router.use('/cv', cvRoutes); // uncomment if needed

export default router;
