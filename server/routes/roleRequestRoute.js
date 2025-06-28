import express from 'express';
import { requestRole, getRequests, handleRequest ,getMyRoleRequestStatus} from '../controllers/roleRequestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware,(req, res, next) => {
  next();
}, requestRole); // כל משתמש מחובר יכול לבקש
router.get('/requests', authMiddleware, checkRole('admin'), getRequests); // רק admin יכול לראות
router.patch('/requests/:requestId', authMiddleware, checkRole('admin'), handleRequest); // אישור/דחייה




router.get('/status', authMiddleware, getMyRoleRequestStatus);


export default router;