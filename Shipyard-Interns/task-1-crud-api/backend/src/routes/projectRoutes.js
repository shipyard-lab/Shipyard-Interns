/**
 * Project Routes
 * Maps HTTP methods + paths to controller functions.
 * Validation middleware runs before the controller for write operations.
 */

const { Router } = require('express');
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const validate = require('../middleware/validate');
const {
  createProjectRules,
  updateProjectRules,
  paginationRules,
} = require('../validators/projectValidator');

const router = Router();

// GET  /api/projects          → list with pagination
// POST /api/projects          → create a new project
router
  .route('/')
  .get(paginationRules, validate, listProjects)
  .post(createProjectRules, validate, createProject);

// GET    /api/projects/:id    → fetch one
// PUT    /api/projects/:id    → update one
// DELETE /api/projects/:id    → remove one
router
  .route('/:id')
  .get(getProject)
  .put(updateProjectRules, validate, updateProject)
  .delete(deleteProject);

module.exports = router;
