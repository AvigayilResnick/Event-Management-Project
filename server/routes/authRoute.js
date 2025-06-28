import express from 'express';
import { signupController, loginController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { signupValidationRules, loginValidationRules } from '../middleware/ValidatorsRules.js';
import { refreshToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', signupValidationRules, validate, signupController);
router.post('/login', loginValidationRules, validate, loginController);
router.get('/refresh', authMiddleware, refreshToken);

export default router;