# Database Schema & Migration Module 

## Overview 

This module implements the database layer for a project management system using SQLite and Knex.js. 

Includes: 
- Database configuration 
- migrations 
- Seed data 
- ER diagram 

### Backend 

- Node.js 
- Knex.js 

### Database 

- SQLite 

## Project Structure
text
task-4-database-schema/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── migrations/
│   │   ├── create_users.js
│   │   ├── create_projects.js
│   │   └── create_project_events.js
│   └── seeds/
│       └── seed_initial_data.js
├── database.sqlite
├── knexfile.js
├── README.md
├── ER_DIAGRAM.md
└── documentation.md

## Database Schema 

### Users 
- id (Primary Key) 
- name 
- email (Unique) 
- role 

### Projects 
- id (Primary Key) 
- name 
- description 
- status 
- owner_id (Foreign Key → Users.id) 

### Project Events 
- id (Primary Key) 
- project_id (Foreign Key → Projects.id) 
- event_type 
- description 
- created_at 

## Relationships 
- One User can own multiple Projects. 
- One Project can contain multiple Project Events. 

### Install

```bash
npm install

### Run Migrations

```bash
npx knex migrate:latest

### Run Seed Data

```bash
npx knex seed:run

## Features 
- Normalized database schema 
- Foreign key relationships 
- Migration-based schema management 
- Seed data for testing 
