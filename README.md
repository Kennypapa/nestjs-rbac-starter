# NestJS RBAC Starter

Production-ready authentication and authorization starter built with NestJS, PostgreSQL, JWT, Prisma and Swagger.

---
## Overview

This project demonstrates how to build a secure authentication and authorization system suitable for SaaS applications.

It implements JWT authentication, Role-Based Access Control (RBAC), permission guards, and a scalable backend architecture that can serve as a foundation for production systems.
---

---
## System Features

### Authentication

- JWT Authentication
- Refresh Tokens
- Password Hashing
- DTO Validation

### Authorization

- Role-Based Access Control (RBAC)
- Permission Guards
- Route Protection

### Database

- PostgreSQL
- Prisma ORM

### API

- Swagger Documentation
- Global Exception Filters
- RESTful API Design

### Developer Experience

- Environment Variables
- Type-safe Database Queries
- Modular Architecture
---

---
## System Architecture

                 Client
                    │
                    ▼
             NestJS Controller
                    │
                    ▼
          Authentication Guards
                    │
                    ▼
               Business Logic
                 (Services)
                    │
                    ▼
                Prisma ORM
                    │
                    ▼
               PostgreSQL
---

---
## Folder Structure
```
src
├── auth
│   ├── controllers
│   ├── services
│   ├── guards
│   └── dto
├── users
├── roles
├── permissions
├── prisma
├── common
└── config
```
---


---
## Authentication Flow

```
User Registers
      │
      ▼
Password Hashed
      │
      ▼
Saved to Database
      │
      ▼
User Logs In
      │
      ▼
Credentials Validated
      │
      ▼
JWT Generated
      │
      ▼
Authenticated Request
```
---


---
## Authorization Flow

User Registers
      │
      ▼
Password Hashed
      │
      ▼
Saved to Database
      │
      ▼
User Logs In
      │
      ▼
Credentials Validated
      │
      ▼
JWT Generated
      │
      ▼
Authenticated Request
---



---
# Engineering Decisions

This project was intentionally designed using common production patterns rather than the simplest implementation.

### Why JWT instead of Sessions?

JWT keeps the API stateless, making it easier to scale across multiple application instances without relying on server-side session storage.
---


---
## Security Considerations
- Passwords are hashed before storage.
- JWT protects authenticated routes.
- RBAC prevents unauthorized access.
- DTO validation prevents invalid requests.
- Environment variables store sensitive credentials.
---

---
## Future Improvements
- Redis Caching
- Email Verification
- Password Reset
- Audit Logs
- OAuth
- Multi-Factor Authentication
- Background Jobs
---


---
## API Endpoints
POST /auth/register

POST /auth/login

POST /auth/refresh

GET /users

POST /roles

POST /permissions
---

---
## Tech Stack
Backend
NestJS
Node.js

Database
PostgreSQL
Prisma

Authentication
JWT
RBAC

Documentation
Swagger

Language
TypeScript
---
