# NestJS RBAC Starter

Production-ready authentication and authorization starter built with NestJS, PostgreSQL, JWT, Prisma and Swagger.

---

## Overview

This project demonstrates how to build a secure authentication and authorization system suitable for SaaS applications.

It implements JWT authentication, Role-Based Access Control (RBAC), permission guards, and a scalable backend architecture that can serve as a foundation for production systems.

---

## Features

- JWT Authentication
- Refresh Tokens
- RBAC
- Permission Guards
- PostgreSQL
- Prisma ORM
- Swagger API Documentation
- DTO Validation
- Global Exception Filters

---

## Authentication Flow

(We'll add a diagram later.)

---

## Authorization Flow

(We'll add another diagram later.)

---

# Engineering Decisions

This project was intentionally designed using common production patterns rather than the simplest implementation.

### Why JWT instead of Sessions?

JWT keeps the API stateless, making it easier to scale across multiple application instances without relying on server-side session storage.

---

### Why Guards instead of Middleware?

Authentication determines who the user is.

Authorization determines what the user can access.

Guards execute after authentication and have access to route metadata, making them the right place for permission checks.

---

### Why RBAC instead of hardcoded role checks?

Permissions evolve over time.

Using decorators and guards allows new roles and permissions to be added without changing controller logic.

---

### Why PostgreSQL?

The authorization model relies on relational data such as:

- Users
- Roles
- Permissions
- Workspaces
- Memberships

PostgreSQL handles these relationships efficiently while maintaining strong data integrity.

---

### Why Prisma?

Prisma provides:

- Type safety
- Cleaner database queries
- Easier schema evolution
- Better developer experience

---

### Trade-offs

JWT introduces challenges around token invalidation.

RBAC becomes more complex as permission requirements grow.

PostgreSQL schemas require more upfront planning than NoSQL databases.

These trade-offs were considered acceptable in exchange for stronger security, maintainability, and scalability.
