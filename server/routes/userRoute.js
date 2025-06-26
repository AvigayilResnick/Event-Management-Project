import express from 'express';
import {getMyInfo, getMyProfile, updateMyProfile, changePasswordController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeUserOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.post('/change-password', authMiddleware, changePasswordController);
router.get('/myInfo', authMiddleware, getMyInfo);






export default router;