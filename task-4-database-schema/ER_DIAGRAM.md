# ER Diagram - Shipyard Task 4

## Users
- id (PK)
- name
- email
- role

## Projects
- id (PK)
- name
- description
- status
- owner_id (FK -> Users.id)

## Project_Events
- id (PK)
- project_id (FK -> Projects.id)
- event_type
- description
- created_at

### Relationships
- Users (1) ----< Projects
- Projects (1) ----< Project_Events
