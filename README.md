# Finance Dashboard Backend

## Overview
This backend is built with Node.js, Express, and MongoDB. It supports:
- User and role management (Viewer, Analyst, Admin)
- Financial records CRUD
- Dashboard summary APIs
- Role-based access control
- Input validation and error handling

## Setup
1. Install dependencies:
   npm install
2. Start MongoDB (default: mongodb://localhost:27017/finance_dashboard)
3. Run the server:
   npm run dev

## API Usage
- All requests must include an `x-role` header (admin, analyst, or viewer) to simulate role-based access.
- Endpoints:
  - `POST /users` (admin only): Create user
  - `GET /users` (admin only): List users
  - `PATCH /users/:id` (admin only): Update user
  - `DELETE /users/:id` (admin only): Delete user
  - `POST /records` (admin, analyst): Create record
  - `GET /records` (all roles): List/filter records
  - `PATCH /records/:id` (admin only): Update record
  - `DELETE /records/:id` (admin only): Delete record
  - `GET /dashboard/summary` (all roles): Summary data
  - `GET /dashboard/trends` (all roles): Monthly trends

## Notes
- No authentication is implemented; use the `x-role` header for access control.
- No optional enhancements (pagination, soft delete, etc.)
- See code comments for further details.
