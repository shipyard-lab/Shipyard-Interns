'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [form, setForm] = useState({ name: '', description: '', ownerId: '', status: 'active' });
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadProjects(pageNumber = 1) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects?page=${pageNumber}&limit=${pagination.limit}`);
      const resData = await response.json();
      if (response.ok && resData.success) {
        setProjects(resData.data || []);
        setPagination(resData.pagination || { page: pageNumber, limit: pagination.limit, total: 0, totalPages: 1 });
      } else {
        setError(resData.message || 'Failed to load projects.');
      }
    } catch (err) {
      setError('Unable to load projects. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects(1).catch(() => setError('Unable to initialize projects.'));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!form.ownerId.trim()) {
      setError('Owner ID is required.');
      return;
    }

    try {
      const isEdit = !!editingProject;
      const url = isEdit ? `${API_URL}/projects/${editingProject.id}` : `${API_URL}/projects`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const resData = await response.json();

      if (!response.ok) {
        const msg = resData.errors && resData.errors.length > 0
          ? resData.errors.map((e) => e.message).join(', ')
          : resData.message || 'Validation failed';
        setError(msg);
        if (response.status === 404) {
          setEditingProject(null);
          setForm({ name: '', description: '', ownerId: '', status: 'active' });
          await loadProjects(1);
        }
        return;
      }

      setSuccess(isEdit ? 'Project updated successfully!' : 'Project created successfully!');
      setForm({ name: '', description: '', ownerId: '', status: 'active' });
      setEditingProject(null);
      await loadProjects(isEdit ? pagination.page : 1);
    } catch (err) {
      setError('Failed to connect to the backend.');
    }
  }

  function handleEdit(project) {
    setError('');
    setSuccess('');
    setEditingProject(project);
    setForm({
      name: project.name || '',
      description: project.description || '',
      ownerId: project.ownerId || '',
      status: project.status || 'active',
    });
  }

  async function handleDelete(id) {
    setError('');
    setSuccess('');
    if (editingProject && editingProject.id === id) {
      setEditingProject(null);
      setForm({ name: '', description: '', ownerId: '', status: 'active' });
    }
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to delete project.');
        if (response.status === 404) {
          await loadProjects(pagination.page);
        }
        return;
      }
      setSuccess('Project deleted successfully.');
      const isLastItem = projects.length === 1;
      const targetPage = isLastItem && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await loadProjects(targetPage);
    } catch (err) {
      setError('Failed to delete project.');
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'archived':
        return 'status-archived';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  return (
    <main className="page">
      <div className="bg-glow"></div>
      <section className="shell">
        <header className="header">
          <div className="logo-section">
            <span className="logo-icon">⚓</span>
            <div>
              <h1>Shipyard Projects</h1>
              <p>Create and manage premium workspaces and team goals.</p>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Form Card */}
          <div className="card form-card">
            <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="e.g. Apollo Dashboard"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectOwner">Owner ID</label>
                <input
                  id="projectOwner"
                  value={form.ownerId}
                  onChange={(event) => setForm({ ...form, ownerId: event.target.value })}
                  placeholder="e.g. user-001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectStatus">Status</label>
                <select
                  id="projectStatus"
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Summarize objectives, goals, and deliverables..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingProject(null);
                      setForm({ name: '', description: '', ownerId: '', status: 'active' });
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* List Card */}
          <div className="list-container">
            <div className="list-header">
              <h2>Project Directory</h2>
              <span className="total-badge">{pagination.total} Projects</span>
            </div>

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📂</span>
                <p>No projects found. Create one to get started!</p>
              </div>
            ) : (
              <div className="list">
                {projects.map((project) => (
                  <article className="card project-card" key={project.id}>
                    <div className="project-info">
                      <div className="project-title-row">
                        <h3>{project.name}</h3>
                        <span className={`badge ${getStatusClass(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="project-desc">{project.description || 'No description provided.'}</p>
                      <div className="project-meta">
                        <span>👤 Owner: <strong>{project.ownerId}</strong></span>
                        <span className="separator">•</span>
                        <span suppressHydrationWarning>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="project-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => handleEdit(project)}
                        title="Edit Project"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(project.id)}
                        title="Delete Project"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => loadProjects(pagination.page - 1)}
                >
                  ◀ Prev
                </button>
                <span className="page-indicator">
                  Page <strong>{pagination.page}</strong> of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadProjects(pagination.page + 1)}
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: #f8fafc;
          color: #0f172a;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        button,
        input,
        textarea,
        select {
          font-family: inherit;
        }
      `}</style>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 60px 20px;
          position: relative;
        }

        .bg-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1400px;
          height: 350px;
          background: radial-gradient(circle at top, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%);
          z-index: 0;
          pointer-events: none;
        }

        .shell {
          margin: 0 auto;
          max-width: 1200px;
          position: relative;
          z-index: 1;
        }

        .header {
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          font-size: 44px;
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #1e293b;
          line-height: 1.2;
        }

        header p {
          color: #64748b;
          font-size: 16px;
          margin-top: 4px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 968px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .form-card {
          position: sticky;
          top: 30px;
        }

        .form-card h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        input,
        textarea,
        select {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 12px 14px;
          width: 100%;
          font-size: 15px;
          color: #1e293b;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        textarea {
          resize: vertical;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 15px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          padding: 14px;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
        }

        .btn-primary:active {
          transform: translateY(1px);
        }

        .btn-secondary {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 8px 16px;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f1f5f9;
          color: #1e293b;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .alert {
          margin-top: 20px;
          padding: 12px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14.5px;
          font-weight: 500;
          animation: slideUp 0.3s ease;
        }

        .alert-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .alert-success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .alert-icon {
          font-size: 18px;
        }

        .list-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }

        .list-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }

        .total-badge {
          background: #e2e8f0;
          color: #475569;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
        }

        .list {
          display: grid;
          gap: 16px;
        }

        .project-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          border: 1px solid #e2e8f0;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
          border-color: #cbd5e1;
        }

        .project-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .project-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .project-title-row h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .status-inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .status-archived {
          background: #fef3c7;
          color: #d97706;
        }

        .status-completed {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .project-desc {
          color: #475569;
          font-size: 14.5px;
          line-height: 1.5;
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
          flex-wrap: wrap;
        }

        .separator {
          color: #cbd5e1;
        }

        .project-actions {
          display: flex;
          gap: 8px;
          align-self: center;
        }

        .btn-edit {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          color: #2563eb;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit:hover {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
        }

        .btn-delete {
          background: #fff5f5;
          border: 1px solid #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-delete:hover {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
          box-shadow: 0 4px 10px rgba(220, 38, 38, 0.15);
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .form-actions .btn {
          flex: 1;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
          padding: 12px 0;
        }

        .page-indicator {
          font-size: 14.5px;
          color: #475569;
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: #64748b;
          gap: 12px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #cbd5e1;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          color: #64748b;
          gap: 12px;
          background: #ffffff;
        }

        .empty-icon {
          font-size: 40px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
