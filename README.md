# Bitespeed Backend Task: Identity Reconciliation

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (with `pg` driver)
- **Security**:
  - `helmet` for secure HTTP headers
  - `express-rate-limit` for API abuse prevention
  - Parameterized queries to prevent SQL Injection
- **Integrity**: Full database transactions and row-level locking for concurrent requests.

## 📄 Task Specification

- [Bitespeed Backend Task: Identity Reconciliation.pdf](./Bitespeed%20Backend%20Task_%20Identity%20Reconciliation.pdf)

## 📡 API Endpoints

All requests should use:

- **Header**: `Content-Type: application/json`
- **Body Format**: `raw-json`

### 1. Identify Contact

`POST /identify`

Consolidates contact information based on email or phone number.

**Request Body:**

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

### 2. Reset Database (For testing)

`DELETE /delete`

Resets the `Contact` table to a clean state containing only the test data (IDs 1, 11, 23, 27).

### 3. Health Check

`GET /health`

Returns the current status of the server.

## 🧪 Postman Collection

A pre-configured Postman collection with test cases and environments is available here:

- [Postman Test Collection](https://shivamrai-350663.postman.co/workspace/Shivam-Rai's-Workspace~e0802250-6ef0-4c96-8e4c-9c696907a6f8/collection/44522972-03c70bd6-9f81-4e60-89b2-bfcb14a3070b?action=share&creator=44522972&active-environment=44522972-198bd8f2-3892-4fa5-b0d7-8141722fa41a)

## 🛠️ Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgres_url_here
   PORT=3000
   ```
3. **Database Initialization**:
   Run the SQL commands in `src/setup.sql` to initialize the table and seed data.
4. **Start Server**:
   ```bash
   npm start
   ```
