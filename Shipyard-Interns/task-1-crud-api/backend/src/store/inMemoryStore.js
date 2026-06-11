const fs = require('fs');
const path = require('path');
const os = require('os');

const FILE_PATH = path.join(os.tmpdir(), 'shipyard_projects.json');
const store = new Map();

// Helper to load data from file
const loadData = () => {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, 'utf-8');
      if (content.trim()) {
        const data = JSON.parse(content);
        store.clear();
        for (const item of data) {
          store.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load store data:', err.message);
  }
};

// Helper to save data to file
const saveData = () => {
  try {
    const data = Array.from(store.values());
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store data:', err.message);
  }
};

// Initial load
loadData();

/**
 * Returns all projects as an array.
 * @returns {Array}
 */
const getAll = () => {
  loadData();
  return Array.from(store.values());
};

/**
 * Returns a single project by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
const getById = (id) => {
  loadData();
  return store.get(id);
};

/**
 * Inserts a new project into the store.
 * @param {Object} project
 * @returns {Object} the inserted project
 */
const insert = (project) => {
  loadData();
  store.set(project.id, project);
  saveData();
  return project;
};

/**
 * Updates an existing project by merging fields.
 * @param {string} id
 * @param {Object} updates
 * @returns {Object|null} updated project or null if not found
 */
const update = (id, updates) => {
  loadData();
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  saveData();
  return updated;
};

/**
 * Deletes a project by ID.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
const remove = (id) => {
  loadData();
  if (!store.has(id)) return false;
  store.delete(id);
  saveData();
  return true;
};

/**
 * Clears the store — used in tests to reset state between runs.
 */
const clear = () => {
  store.clear();
  saveData();
};

module.exports = { getAll, getById, insert, update, remove, clear };
