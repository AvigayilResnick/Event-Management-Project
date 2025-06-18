import express from 'express';
import { requestRole, getRequests, handleRequest } from '../controllers/roleRequestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const router = express.Router();

router.post('/request', authMiddleware, requestRole); // כל משתמש מחובר יכול לבקש
router.get('/requests', authMiddleware, checkAdmin, getRequests); // רק admin יכול לראות
router.patch('/requests/:requestId', authMiddleware, checkAdmin, handleRequest); // אישור/דחייה

export default router;