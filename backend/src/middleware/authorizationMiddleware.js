const db = require("../config/database");

const canModifyProject = (req, res, next) => {
  const projectId = req.params.id;

  db.get(
    "SELECT * FROM projects WHERE id = ?",
    [projectId],
    (err, project) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      if (
        project.ownerId === req.user.id ||
        req.user.role === "admin"
      ) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
  );
};

module.exports = canModifyProject;