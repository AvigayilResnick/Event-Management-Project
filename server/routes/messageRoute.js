import express from 'express';
import { postMessage } from '../controllers/messageController.js';
import { validate } from '../middleware/validate.js';
import { messageValidationRules } from '../middleware/ValidatorsRules.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/send-message',
  authMiddleware,           
  messageValidationRules(),
  validate,
  postMessage
);

export default router;
