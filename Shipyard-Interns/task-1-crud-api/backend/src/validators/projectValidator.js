/**
 * Project Validators
 * Uses express-validator chains.
 * These are reusable arrays that plug directly into route definitions.
 */

const { body, query } = require('express-validator');

const VALID_STATUSES = ['active', 'inactive', 'archived', 'completed'];

/**
 * Validation rules for creating a project.
 * All fields are required; status must be one of the allowed values.
 */
const createProjectRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('ownerId')
    .trim()
    .notEmpty().withMessage('Owner ID is required'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

/**
 * Validation rules for updating a project.
 * All fields are optional but must be valid if provided.
 */
const updateProjectRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('ownerId')
    .optional()
    .trim()
    .notEmpty().withMessage('Owner ID cannot be empty'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

/**
 * Validation rules for pagination query params.
 */
const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = { createProjectRules, updateProjectRules, paginationRules };
