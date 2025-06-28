import { body } from 'express-validator';

export const signupValidationRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const ratingValidationRules = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("supplierId")
    .isInt({ gt: 0 })
    .withMessage("Supplier ID must be a positive integer")
];



export const messageValidationRules = () => [
  body('toUserId')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .toInt()                       // המרה למספר
    .isInt({ gt: 0 })
    .withMessage('Recipient ID must be a positive integer'),

  body('messageText')
    .trim()
    .notEmpty()
    .withMessage('Message text is required')
    .isLength({ max: 1000 })
    .withMessage('Message text max length is 1000 characters'),
];

export const productValidationRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('image').optional().isURL().withMessage('Image URL must be valid')
];

