import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ratingValidationRules } from '../middleware/ValidatorsRules.js';
import { validate } from '../middleware/validate.js';
import { submitRating, getRatingStats } from '../controllers/ratingController.js';

const router = express.Router();

// שליחת דירוג - מוגן בטוקן
router.post('/', authMiddleware, ratingValidationRules, validate, submitRating);

// סטטיסטיקת דירוג (ממוצע + כמות)
router.get('/:supplierId', getRatingStats);

export default router;
