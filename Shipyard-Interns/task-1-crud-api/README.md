# Shipyard Task 1 — RESTful CRUD API for Projects

A full-stack implementation of a Projects CRUD API built with **Express.js** (backend) and **Next.js** (frontend).

---

## Tech Stack
- **Backend:** Node.js, Express.js, express-validator, uuid
- **Frontend:** Next.js 14 (App Router), React 18
- **Storage:** In-memory store (Map)
- **Testing:** Jest + Supertest

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

---

### Backend Setup

```bash
cd backend
npm install
npm run dev        # starts at http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev        # starts at http://localhost:3000
```

---

## Running Tests

```bash
cd backend
npm test
```

All 15 tests should pass.

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects` | List all projects (paginated) |
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects/:id` | Get a single project |
| `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project |

### Query Parameters (GET /projects)
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max 100) |

### Project Schema

```json
{
  "id": "uuid-v4",
  "name": "string (2–100 chars, required)",
  "description": "string (max 500 chars, required)",
  "ownerId": "string (required)",
  "status": "active | inactive | archived | completed",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Example: Create a Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apollo Dashboard",
    "description": "Internal tooling for team Apollo",
    "ownerId": "user-001",
    "status": "active"
  }'
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Validation + error handling
│   ├── routes/          # Route definitions
│   ├── store/           # In-memory data layer
│   ├── validators/      # express-validator rule sets
│   └── app.js           # App entry point
└── tests/
    └── projects.test.js # All endpoint tests

frontend/
└── src/
    ├── app/             # Next.js App Router pages
    └── components/      # React UI components
```
