const { body, validationResult } = require('express-validator');

const customerValidationRules = () => {
  return [
    // Name validation
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim(),

    // Email validation
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail()
      .custom((value) => {
        // Optional: Add custom email validation if needed
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          throw new Error('Invalid email format');
        }
        return true;
      }),

    // Phone number is optional, but must be a valid phone number if provided
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
      .trim(),

    // Address is optional
    body('address')
      .optional()
      .trim(),
  ];
};

// Validation middleware to catch errors
const validate = (req, res, next) => {
  console.log(req.body);
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = {
  customerValidationRules,
  validate
};
