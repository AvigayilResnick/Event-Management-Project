// routes/event.route.js

import express from 'express';
import {
  createEvent,
  getUserEvents,
  getSupplierEvents,
  updateEventStatus,
} from '../controllers/event.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = express.Router();

// לקוח יוצר בקשה חדשה
router.post('/', authenticateToken, authorizeRole('user'), createEvent);

// לקוח מקבל את כל הבקשות שלו
router.get('/my', authenticateToken, authorizeRole('user'), getUserEvents);

// ספק רואה את כל הבקשות שהוקצו לו
router.get('/assigned', authenticateToken, authorizeRole('supplier'), getSupplierEvents);

// ספק משנה סטטוס של בקשה (מאושר/נדחה/התקבל וכו')
router.patch('/:id/status', authenticateToken, authorizeRole('supplier'), updateEventStatus);

export default router;
