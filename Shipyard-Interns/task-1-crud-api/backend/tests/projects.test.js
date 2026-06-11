/**
 * Project API Tests
 * Uses supertest to make real HTTP calls against the Express app
 * without binding to a port. The in-memory store is reset before each
 * test suite to ensure isolation.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store/inMemoryStore');

// ── Helpers ──────────────────────────────────────────────────────────────
const samplePayload = (overrides = {}) => ({
  name: 'Apollo Dashboard',
  description: 'Internal tooling dashboard for team Apollo.',
  ownerId: 'user-001',
  status: 'active',
  ...overrides,
});

// ── Setup / Teardown ─────────────────────────────────────────────────────
beforeEach(() => store.clear());

// ── POST /api/projects ───────────────────────────────────────────────────
describe('POST /api/projects', () => {
  it('creates a project and returns 201 with the created data', async () => {
    const res = await request(app).post('/api/projects').send(samplePayload());
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ name: 'Apollo Dashboard', status: 'active' });
    expect(res.body.data.id).toBeDefined();
  });

  it('defaults status to "active" if not provided', async () => {
    const { status, ...payload } = samplePayload();
    const res = await request(app).post('/api/projects').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('active');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/projects').send({ description: 'x', ownerId: 'u1' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('name');
  });

  it('returns 400 when status is invalid', async () => {
    const res = await request(app).post('/api/projects').send(samplePayload({ status: 'flying' }));
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('status');
  });
});

// ── GET /api/projects ────────────────────────────────────────────────────
describe('GET /api/projects', () => {
  it('returns an empty list when no projects exist', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });

  it('returns all projects with pagination metadata', async () => {
    await request(app).post('/api/projects').send(samplePayload({ name: 'P1' }));
    await request(app).post('/api/projects').send(samplePayload({ name: 'P2' }));

    const res = await request(app).get('/api/projects?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it('paginates correctly', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app).post('/api/projects').send(samplePayload({ name: `Project ${i}` }));
    }
    const res = await request(app).get('/api/projects?page=2&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.totalPages).toBe(3);
  });
});

// ── GET /api/projects/:id ─────────────────────────────────────────────────
describe('GET /api/projects/:id', () => {
  it('returns the project for a valid ID', async () => {
    const created = await request(app).post('/api/projects').send(samplePayload());
    const { id } = created.body.data;

    const res = await request(app).get(`/api/projects/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('returns 404 for a non-existent ID', async () => {
    const res = await request(app).get('/api/projects/does-not-exist');
    expect(res.status).toBe(404);
  });
});

// ── PUT /api/projects/:id ─────────────────────────────────────────────────
describe('PUT /api/projects/:id', () => {
  it('updates the project fields', async () => {
    const created = await request(app).post('/api/projects').send(samplePayload());
    const { id } = created.body.data;

    const res = await request(app)
      .put(`/api/projects/${id}`)
      .send({ name: 'Renamed Project', status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Renamed Project');
    expect(res.body.data.status).toBe('completed');
  });

  it('returns 404 when updating a non-existent project', async () => {
    const res = await request(app).put('/api/projects/ghost-id').send({ name: 'Renamed Project' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid status on update', async () => {
    const created = await request(app).post('/api/projects').send(samplePayload());
    const { id } = created.body.data;

    const res = await request(app).put(`/api/projects/${id}`).send({ status: 'broken' });
    expect(res.status).toBe(400);
  });
});

// ── DELETE /api/projects/:id ──────────────────────────────────────────────
describe('DELETE /api/projects/:id', () => {
  it('deletes the project and returns success', async () => {
    const created = await request(app).post('/api/projects').send(samplePayload());
    const { id } = created.body.data;

    const res = await request(app).delete(`/api/projects/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('confirms the project is gone after deletion', async () => {
    const created = await request(app).post('/api/projects').send(samplePayload());
    const { id } = created.body.data;

    await request(app).delete(`/api/projects/${id}`);
    const res = await request(app).get(`/api/projects/${id}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting a non-existent project', async () => {
    const res = await request(app).delete('/api/projects/fake-id');
    expect(res.status).toBe(404);
  });
});
