import express from 'express';
import {getMyInfo, getMyProfile, updateMyProfile, changePasswordController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
//import { authorizeUserOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/myInfo', authMiddleware, getMyProfile);
router.put('/myInfo', authMiddleware, updateMyProfile);
router.post('/change-password', authMiddleware, changePasswordController);
router.get('/myInfoForRefresh', authMiddleware, getMyInfo);






export default router;