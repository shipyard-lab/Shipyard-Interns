const db = require("../config/database");

const getProjects = (req, res) => {
  db.all(
    "SELECT * FROM projects",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      res.json({
        success: true,
        projects: rows
      });
    }
  );
};

const createProject = (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required"
    });
  }

  db.run(
    `INSERT INTO projects
    (name, description, status, ownerId)
    VALUES (?, ?, ?, ?)`,
    [
      name,
      description,
      status || "active",
      req.user.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        projectId: this.lastID
      });
    }
  );
};

const updateProject = (req, res) => {
  const { name, description, status } = req.body;

  db.run(
    `UPDATE projects
     SET name = ?, description = ?, status = ?
     WHERE id = ?`,
    [
      name,
      description,
      status,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      res.json({
        success: true,
        message: "Project updated"
      });
    }
  );
};

const deleteProject = (req, res) => {
  db.run(
    "DELETE FROM projects WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      res.json({
        success: true,
        message: "Project deleted"
      });
    }
  );
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};