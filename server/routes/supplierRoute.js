import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    handleCreateSupplierBusiness,
    handleGetAllMyBusinesses,
    handleGetBusinessById,
    handleUpdateBusinessById,
    handleDeleteBusinessById,
    handleDeleteImage
} from '../controllers/supplierController.js';
import { upload } from '../middleware/uploadMiddleware_multer.js';

const router = express.Router();

router.post('/supplier-profile', authMiddleware, upload.array('images', 10), handleCreateSupplierBusiness);
router.get('/supplier-profile', authMiddleware, handleGetAllMyBusinesses);
router.get('/supplier-profile/:id', authMiddleware, handleGetBusinessById);
router.put('/supplier-profile/:id', authMiddleware, upload.array('images'), handleUpdateBusinessById);
router.delete('/supplier-profile/:id', authMiddleware, handleDeleteBusinessById);
router.delete('/images/:imageId', authMiddleware, handleDeleteImage);

export default router;