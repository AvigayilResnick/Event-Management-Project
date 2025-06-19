import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { handleCreateSupplier, handleGetMySupplierProfile } from '../controllers/supplierController.js';
import { upload } from '../middleware/uploadMiddleware_multer.js';

const router = express.Router();

// יצירת פרופיל ספק
router.post('/supplier-profile', authMiddleware, upload.array('images', 10),  handleCreateSupplier);
router.get('/supplier-profile/myProfile', authMiddleware, handleGetMySupplierProfile);

export default router;