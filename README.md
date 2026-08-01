# NestJS RBAC Starter
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

Production-ready authentication and authorization backend demonstrating scalable software architecture, JWT authentication, Role-Based Access Control (RBAC), PostgreSQL, Prisma ORM, and engineering practices commonly used in modern SaaS applications.

---
## Overview

This project demonstrates how to build a secure authentication and authorization system suitable for SaaS applications.

It implements JWT authentication, Role-Based Access Control (RBAC), permission guards, and a scalable backend architecture that can serve as a foundation for production systems.
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
---

Language 
Typescript
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

```
Incoming Request
        │
        ▼
 JWT Authentication Guard
        │
        ▼
Authenticated User
        │
        ▼
Permission Guard
        │
        ▼
Role & Permission Check
        │
        ▼
 Allow or Deny Access
```
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
## Production Considerations

- Environment-based configuration
- Password hashing using bcrypt
- JWT authentication
- Role-Based Access Control (RBAC)
- Global exception handling
- DTO validation
- Input sanitization
- API documentation with Swagger
---

---
## Design Principles

- Separation of Concerns
- Dependency Injection
- Single Responsibility Principle
- Stateless Authentication
- Modular Architecture
- Type Safety
- Security by Default
---

---
## Scalability

The architecture is designed to support future growth through:

- Modular services
- Stateless JWT authentication
- PostgreSQL relational modeling
- Separation of business logic
- Independent feature modules
---

---
## Future Roadmap

- Redis Caching
- Background Jobs
- Email Verification
- Password Reset
- OAuth Login
- Multi-Factor Authentication
- Audit Logging
- Rate Limiting
- Docker Support
- CI/CD Pipeline
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
