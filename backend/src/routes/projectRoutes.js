const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const canModifyProject = require("../middleware/authorizationMiddleware");

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

router.get(
  "/",
  authenticate,
  getProjects
);

router.post(
  "/",
  authenticate,
  createProject
);

router.put(
  "/:id",
  authenticate,
  canModifyProject,
  updateProject
);

router.delete(
  "/:id",
  authenticate,
  canModifyProject,
  deleteProject
);

module.exports = router;