/**
 * Project Controller
 * Contains all business logic for project CRUD operations.
 * Controllers are kept thin — they delegate storage to the store module.
 */

const { v4: uuidv4 } = require('uuid');
const store = require('../store/inMemoryStore');

/**
 * GET /api/projects
 * Returns a paginated list of all projects.
 * Query params: page (default 1), limit (default 10)
 */
const listProjects = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const all = store.getAll();
  const total = all.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const data = all.slice(startIndex, startIndex + limit);

  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
};

/**
 * GET /api/projects/:id
 * Returns a single project by ID.
 */
const getProject = (req, res) => {
  const project = store.getById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.status(200).json({ success: true, data: project });
};

/**
 * POST /api/projects
 * Creates a new project.
 * Body: { name, description, ownerId, status? }
 */
const createProject = (req, res) => {
  const { name, description, ownerId, status = 'active' } = req.body;

  const project = {
    id: uuidv4(),
    name,
    description,
    ownerId,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = store.insert(project);
  res.status(201).json({ success: true, data: created });
};

/**
 * PUT /api/projects/:id
 * Updates an existing project. Only provided fields are changed.
 */
const updateProject = (req, res) => {
  const updated = store.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.status(200).json({ success: true, data: updated });
};

/**
 * DELETE /api/projects/:id
 * Removes a project from the store.
 */
const deleteProject = (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.status(200).json({ success: true, message: 'Project deleted successfully' });
};

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject };
