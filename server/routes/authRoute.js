import express from 'express';
import { signupController, loginController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { signupValidationRules, loginValidationRules } from '../middleware/ValidatorsRules.js';


const router = express.Router();

router.post('/signup', signupValidationRules, validate, signupController);
router.post('/login', loginValidationRules, validate, loginController);

export default router;