# Project Architecture & Data Flow

## Overview
This backend is a Node.js/Express application using MongoDB (Atlas) for data storage. It provides REST APIs for user/role management, financial records, and dashboard analytics, with role-based access control.

---

## Entry Point
- **src/index.js**
  - Loads environment variables from `.env` (MongoDB Atlas URI)
  - Connects to MongoDB
  - Sets up Express app and JSON middleware
  - Loads all routes from `src/routes.js`
  - Starts the server

---

## Main Components
- **src/models.js**
  - Defines Mongoose models:
    - `User`: username, status, role
    - `FinancialRecord`: amount, type, category, date, notes, createdBy
- **src/routes.js**
  - Defines all REST API endpoints for users, records, dashboard
- **src/middleware.js**
  - Role-based access control (checks `x-role` header)
  - Input validation using Joi

---

## Data Structure
- **User**
  - `username`: String
  - `status`: 'active' | 'inactive'
  - `role`: 'viewer' | 'analyst' | 'admin'
- **FinancialRecord**
  - `amount`: Number
  - `type`: 'income' | 'expense'
  - `category`: String
  - `date`: Date
  - `notes`: String
  - `createdBy`: User reference

---

## API Flow Diagram

```
sequenceDiagram
    participant Client
    participant ExpressApp
    participant Middleware
    participant Routes
    participant MongoDB

    Client->>ExpressApp: HTTP Request
    ExpressApp->>Middleware: Validate role & input
    Middleware-->>ExpressApp: Allow or reject
    ExpressApp->>Routes: Route handler
    Routes->>MongoDB: Query/Update data
    MongoDB-->>Routes: Data/result
    Routes-->>ExpressApp: Response
    ExpressApp-->>Client: HTTP Response
```

---

## Example Request Flow
1. Client sends a request (e.g., POST /records) with `x-role` header.
2. Middleware checks role and validates input.
3. If allowed, route handler processes the request and interacts with MongoDB.
4. Response is sent back to the client.

---

## Notes
- No authentication: role is simulated via `x-role` header.
- MongoDB Atlas is used via the `.env` file's `MONGO_URI`.
- All business logic is separated by models, routes, and middleware for clarity.
