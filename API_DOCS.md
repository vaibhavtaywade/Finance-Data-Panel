# API Documentation

This backend provides RESTful APIs for user/role management, financial records, and dashboard analytics. All requests must include an `x-role` header (admin, analyst, or viewer) to simulate role-based access.

---

## Users

### Create User
- **POST /users**
- **Role:** admin
- **Body:**
  ```json
  {
    "username": "string",
    "role": "viewer|analyst|admin",
    "status": "active|inactive"
  }
  ```
- **Response:** 201 Created, user object

### List Users
- **GET /users**
- **Role:** admin
- **Response:** 200 OK, array of users

### Update User
- **PATCH /users/:id**
- **Role:** admin
- **Body:** (any updatable field)
- **Response:** 200 OK, updated user

### Delete User
- **DELETE /users/:id**
- **Role:** admin
- **Response:** 200 OK, message

---

## Financial Records

### Create Record
- **POST /records**
- **Role:** admin, analyst
- **Body:**
  ```json
  {
    "amount": 1000,
    "type": "income|expense",
    "category": "string",
    "date": "YYYY-MM-DD",
    "notes": "string",
    "createdBy": "userId"
  }
  ```
- **Response:** 201 Created, record object

### List/Filter Records
- **GET /records?type=&category=&startDate=&endDate=**
- **Role:** all
- **Response:** 200 OK, array of records

### Update Record
- **PATCH /records/:id**
- **Role:** admin
- **Body:** (any updatable field)
- **Response:** 200 OK, updated record

### Delete Record
- **DELETE /records/:id**
- **Role:** admin
- **Response:** 200 OK, message

---

## Dashboard

### Summary
- **GET /dashboard/summary**
- **Role:** all
- **Response:**
  ```json
  {
    "totalIncome": 0,
    "totalExpenses": 0,
    "netBalance": 0,
    "categoryTotals": { "category": amount },
    "recentActivity": [ ...records ]
  }
  ```

### Trends
- **GET /dashboard/trends**
- **Role:** all
- **Response:**
  ```json
  {
    "YYYY-MM": { "income": 0, "expense": 0 },
    
  }
  ```

---

## Error Responses
- 400 Bad Request: Invalid input
- 403 Forbidden: Insufficient role
- 404 Not Found: Resource not found

---

## Notes
- All endpoints require the `x-role` header.
- No authentication is implemented.
- Use the user ID from the users collection for `createdBy` in records.
