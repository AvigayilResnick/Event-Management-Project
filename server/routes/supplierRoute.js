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
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/supplier-profile', authMiddleware,checkRole('supplier') ,upload.array('images', 10), handleCreateSupplierBusiness);
router.get('/supplier-profile', authMiddleware,checkRole('supplier') , handleGetAllMyBusinesses);
router.get('/supplier-profile/:id', authMiddleware,checkRole('supplier') , handleGetBusinessById);
router.put('/supplier-profile/:id', authMiddleware,checkRole('supplier') , upload.array('images'), handleUpdateBusinessById);
router.delete('/supplier-profile/:id', authMiddleware,checkRole('supplier') , handleDeleteBusinessById);
router.delete('/images/:imageId', authMiddleware,checkRole('supplier') , handleDeleteImage);

export default router;