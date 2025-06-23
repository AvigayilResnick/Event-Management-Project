import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { handleCreateSupplier } from '../controllers/supplierController.js';
import { upload } from '../middleware/uploadMiddleware_multer.js';

const router = express.Router();

// יצירת פרופיל ספק
router.post('/supplier-profile', authMiddleware, upload.array('images', 10),  handleCreateSupplier);

export default router;