# Secura - Technical Documentation

## Overview

Secura is a secure project management system built using **Express.js**, **SQLite**, **JWT**, and **bcrypt**. The application demonstrates secure authentication and authorization by allowing users to register, log in, and manage projects while enforcing role-based and owner-based access control.

---

## Tech Stack

| Component         | Technology |
| ----------------- | ---------- |
| Frontend          | Next.js    |
| Backend           | Express.js |
| Database          | SQLite     |
| Authentication    | JWT        |
| Password Security | bcryptjs   |

---

## Core Features

### Authentication

* User Registration
* User Login
* Password Hashing
* JWT Token Generation
* Protected Routes
* Token Expiry Handling

### Authorization

* Role-Based Access Control
* Owner-Based Access Control
* Admin Privileges

### Project Management

* Create Projects
* View Projects
* Update Projects
* Delete Projects

---

## System Flow

```text
User
  │
  ▼
Register / Login
  │
  ▼
JWT Token Generated
  │
  ▼
Protected Routes
  │
  ▼
Authentication Check
  │
  ▼
Authorization Check
  │
  ▼
Database Access
```

---

## Authentication

Authentication verifies the identity of a user before granting access to protected resources.

### Registration Process

1. User submits registration details.
2. Password is hashed using bcrypt.
3. User data is stored in the database.
4. Registration confirmation is returned.

### Login Process

1. User submits email and password.
2. Credentials are validated.
3. JWT token is generated.
4. Token is returned to the client.

### JWT Authentication

Protected routes require a valid JWT token.

```http
Authorization: Bearer <token>
```

The token contains user information and expires after **1 hour**.

---

## Authorization

Authorization determines what actions a user can perform after authentication.

### Roles

| Role  | Permissions                           |
| ----- | ------------------------------------- |
| dev   | Create, view, and manage own projects |
| lead  | Create, view, and manage own projects |
| admin | Full access to all projects           |

---

## Owner-Based Access Control

Each project is linked to its creator through an `ownerId`.

A project can be modified only by:

* The project owner
* An administrator

Any other user attempting to update or delete the project will receive an **Access Denied** response.

---

## Middleware

### Authentication Middleware

**File:** `authMiddleware.js`

Responsibilities:

* Extract JWT token
* Verify token validity
* Decode user information
* Allow or deny access

### Authorization Middleware

**File:** `authorizationMiddleware.js`

Responsibilities:

* Verify project ownership
* Verify administrator privileges
* Prevent unauthorized modifications

---

## Database Design

### Users Table

| Field    | Description            |
| -------- | ---------------------- |
| id       | Unique user identifier |
| name     | User name              |
| email    | User email             |
| password | Hashed password        |
| role     | User role              |

### Projects Table

| Field       | Description               |
| ----------- | ------------------------- |
| id          | Unique project identifier |
| name        | Project name              |
| description | Project description       |
| status      | Project status            |
| ownerId     | Project owner             |

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Projects

```http
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

---

## Security Measures

* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Owner-Based Access Control
* Token Expiry Handling

---

## Project Structure

```text
Shipyard-Interns-js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── documentation.md
```

---

## Conclusion

Secura demonstrates a secure authentication and authorization system using modern backend development practices. By combining JWT authentication, password hashing, role-based authorization, and owner-based access control, the application ensures that resources remain accessible only to authorized users.
