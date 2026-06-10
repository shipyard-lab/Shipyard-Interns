# Project Management CRUD Application

## Overview
A full-stack project management CRUD application built with **Next.js 14** (frontend) and **Express.js** (backend). It supports creating, reading, updating, and deleting projects with real-time search, status filtering, pagination, and a premium dark-mode glassmorphism UI with an animated aurora background.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Background Effect:** OGL (WebGL) — SoftAurora component
- **State Management:** React useState/useEffect
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Middleware:** cors, dotenv
- **Testing:** Jest + Supertest (18 test cases)
- **Data Store:** In-memory JavaScript array

## Project Structure

```
Root/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── projects.js
│   │   ├── controllers/
│   │   │   └── projectController.js
│   │   ├── middleware/
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── store/
│   │   │   └── inMemoryStore.js
│   │   ├── tests/
│   │   │   └── projects.test.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── globals.css
│   │   │   └── page.js
│   │   ├── components/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SoftAurora.jsx
│   │   │   └── SoftAurora.css
│   │   └── lib/
│   │       └── api.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Backend Setup
```bash
cd backend
npm install
echo "PORT=5000" > .env
npm run dev
```
The API server starts at `http://localhost:5000`.

### Frontend Setup
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```
The frontend starts at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/projects | Create a new project |
| GET | /api/projects | List all projects (paginated, filterable, searchable) |
| GET | /api/projects/:id | Get a single project |
| PUT | /api/projects/:id | Update a project (partial updates) |
| DELETE | /api/projects/:id | Delete a project |

### Query Parameters (GET /api/projects)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 50)
- `status` — Filter by status (active/inactive/completed)
- `search` — Search in name and description

## Data Model

```json
{
  "id": "auto-generated UUID",
  "name": "string (3–100 chars)",
  "description": "string (10–500 chars)",
  "ownerId": "string (non-empty)",
  "status": "active | inactive | completed",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## Running Tests

```bash
cd backend
npm test
```

All 18 test cases covering CRUD operations, validation, pagination, filtering, and search.

## Features
- Full CRUD operations without page reloads
- Client-side and server-side validation
- Debounced search
- Badge-style status filters
- Staggered fade-in animations
- Dark glassmorphism UI with animated WebGL aurora background
- Mouse-reactive aurora effect
- Responsive design (mobile, tablet, desktop)
- Confirmation dialogs for destructive actions
- Loading spinners on all async operations
- Inline error messages for API and validation errors
