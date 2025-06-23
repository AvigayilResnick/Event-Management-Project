import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeClientOnly } from '../middleware/roleMiddleware.js';
import {
  getSuppliers,
  getSupplierFullDetails,
  sendContactMessage,
  requestSupplier
} from '../controllers/clientController.js';
console.log('Client routes loaded');

const router = express.Router();

// GET /api/client/suppliers?eventName=...&limit=...&offset=...
router.get('/suppliers', getSuppliers);

// GET /api/client/suppliers/full/:id
router.get('/suppliers/full/:id', authMiddleware, getSupplierFullDetails);







export default router;
