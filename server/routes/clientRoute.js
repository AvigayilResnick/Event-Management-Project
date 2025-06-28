import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getSuppliers,
  getSupplierFullDetails,
  sendContactMessage,
  requestSupplier,getAllEvents,getCategories,getMaxSupplierPrice
} from '../controllers/clientController.js';


const router = express.Router();


// GET /api/client/suppliers?eventName=...&limit=...&offset=...
router.get('/suppliers', getSuppliers);

// GET /api/client/suppliers/full/:id
router.get('/suppliers/full/:id', authMiddleware, getSupplierFullDetails);

router.get('/categories', getCategories);
router.get("/max-price", getMaxSupplierPrice);
router.get('/events', getAllEvents);



export default router;
