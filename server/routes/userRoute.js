import express from 'express';
import { getMyInfo, getUserProfile, updateUserProfile ,changePasswordController} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeUserOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();
// User route for getting and updating user profiles
router.get('/:id', authMiddleware, authorizeUserOrAdmin, getUserProfile);
router.put('/:id', authMiddleware, authorizeUserOrAdmin, updateUserProfile);
router.post('/change-password', authMiddleware, changePasswordController);
router.get('/myInfo', authMiddleware, getMyInfo);






export default router;
// This code defines the user route for getting and updating user profiles.
// It uses Express.js to create a router that handles GET and PUT requests for user profiles.