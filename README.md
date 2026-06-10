# Secura
Secura is a secure project management system built using **Next.js**, **Express.js**, and **SQLite**. It demonstrates **JWT-based authentication**, **role-based authorization**, and **owner-based access control** for managing projects securely.

## Features

* User Registration
* User Login
* Password Hashing with bcrypt
* JWT Authentication
* Protected Routes
* Role-Based Authorization (dev, lead, admin)
* Project Creation
* Project Viewing
* Project Updating
* Project Deletion
* Owner/Admin Access Control

## Tech Stack

* Frontend: Next.js
* Backend: Express.js
* Database: SQLite
* Authentication: JWT
* Security: bcrypt

## Authorization Rules

* Only authenticated users can access project routes.
* Project owners can update or delete their own projects.
* Admins can update or delete any project.
* Unauthorized users receive an access denied response.

## Run the Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on:

```text
http://localhost:5000
```

## Sample Users

### Admin

```json
{
  "email": "emil@example.com",
  "password": "123456"
}
```

### Lead

```json
{
  "email": "lead@example.com",
  "password": "123456"
}
```

### Developer

```json
{
  "email": "dev@example.com",
  "password": "123456"
}
```

## Project Structure

```text
Shipyard-Interns-js
│
├── backend
│   ├── src
│   └── package.json
│
├── frontend
│   ├── src
│   └── package.json
│
├── README.md
└── documentation.md
```

## Author

Emil Tom Joseph
