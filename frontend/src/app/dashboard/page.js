"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState("");

  // Create project state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!savedToken) {
      router.push("/login");
    } else {
      setToken(savedToken);
      setUserEmail(email || "User");
      fetchProjects(savedToken);
    }
  }, [router]);

  const fetchProjects = async (authToken) => {
    setLoadingProjects(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load projects.");
      }
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Failed to load projects. Make sure the backend server is running.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!name) {
      setCreateError("Project name is required.");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, status }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project.");
      }

      setCreateSuccess("Project created successfully!");
      setName("");
      setDescription("");
      setStatus("active");

      // Reload projects list
      fetchProjects(token);
    } catch (err) {
      setCreateError(err.message || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#070c15",
          color: "#9ca3af",
          fontSize: "0.9rem",
        }}
      >
        Securing session...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          SECURA<span>.</span>
        </div>
        <div className="nav-user">
          <span className="welcome-msg">Logged in as: {userEmail}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Manage and monitor your infrastructure deployment security logs.</p>
        </div>

        {/* Left column: Create Project Form */}
        <section className="dashboard-section">
          <h2 className="section-title">Create Project</h2>
          {createError && <div className="alert alert-error">{createError}</div>}
          {createSuccess && <div className="alert alert-success">{createSuccess}</div>}

          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label className="form-label" htmlFor="projName">
                Project Name
              </label>
              <input
                id="projName"
                type="text"
                className="form-input"
                placeholder="Database Protection Shield"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projDesc">
                Description
              </label>
              <textarea
                id="projDesc"
                className="form-input"
                rows="4"
                placeholder="Log analyzer and threat prevention modules..."
                style={{ resize: "vertical", fontFamily: "inherit" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projStatus">
                Project Status
              </label>
              <select
                id="projStatus"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={creating}
              >
                <option value="active">Active (active)</option>
                <option value="completed">Completed (completed)</option>
                <option value="pending">Pending (pending)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }} disabled={creating}>
              {creating ? "Creating Project..." : "Deploy Project"}
            </button>
          </form>
        </section>

        {/* Right column: Projects List */}
        <section className="dashboard-section">
          <h2 className="section-title">Deployed Systems</h2>
          {error && <div className="alert alert-error">{error}</div>}

          {loadingProjects ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              Retrieving projects list from SECURA vault...
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>Create a security project using the form to populate this view.</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <span className="project-name">{project.name}</span>
                    <span className={`status-badge ${project.status || "unknown"}`}>{project.status}</span>
                  </div>
                  {project.description && <p className="project-desc">{project.description}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
