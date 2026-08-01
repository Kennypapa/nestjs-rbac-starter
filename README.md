# NestJS RBAC Starter

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

Production-ready NestJS backend starter for SaaS applications featuring JWT authentication, refresh tokens, Role-Based Access Control (RBAC), PostgreSQL, Prisma, Swagger, Docker, CI/CD, and a modular architecture you can extend in real projects.

---

## Overview

This project demonstrates how to design a secure authentication and authorization backend using patterns common in production SaaS systems:

- Stateless JWT access tokens
- Rotating refresh tokens stored as hashes
- Roles and permissions enforced by guards
- Type-safe data access with Prisma
- API docs with Swagger
- Reproducible local setup with Docker
- Automated quality checks with GitHub Actions

---

## Tech Stack

| Area | Choice |
|------|--------|
| Runtime | Node.js 20 |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Passport |
| Docs | Swagger / OpenAPI |
| Containers | Docker + Compose |
| CI/CD | GitHub Actions |

---

## Features

### Authentication
- User registration
- Login
- JWT access tokens
- Refresh token rotation
- Password hashing with bcrypt
- Logout / token revocation

### Authorization (RBAC)
- Roles: `ADMIN`, `MANAGER`, `USER`
- Fine-grained permissions (`resource:action`)
- Global JWT, roles, and permissions guards
- Custom decorators: `@Public()`, `@Roles()`, `@RequirePermissions()`, `@CurrentUser()`

### API & Platform
- RESTful endpoints
- Swagger UI at `/docs`
- DTO validation with `class-validator`
- Global exception filter
- Environment validation with Joi
- Unit tests for auth and guards
- Dockerized Postgres + API
- CI pipeline: install → lint → test → build

---

## System Architecture

```
Client
  │
  ▼
NestJS Controller
  │
  ▼
JWT Auth Guard → Roles Guard → Permissions Guard
  │
  ▼
Service Layer (business logic)
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

### Authentication flow

```
Register/Login
    → Validate credentials
    → Issue short-lived access JWT
    → Store hashed refresh token
    → Client sends Bearer access token
```

### Authorization flow

```
Incoming request
    → JWT authentication
    → Role check (if required)
    → Permission check (if required)
    → Allow or deny
```

---

## Folder Structure

```
src
├── auth            # register, login, refresh, logout, JWT strategy
├── users           # user profile and role assignment
├── roles           # role CRUD + permission assignment
├── permissions     # permission catalog
├── prisma          # PrismaService (global DB access)
├── common          # guards, decorators, filters
└── config          # env config + validation
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker (recommended for PostgreSQL)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/nestjs-rbac-starter.git
cd nestjs-rbac-starter
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

```bash
npm run db:up
```

Postgres is published on host port `5433` by default (avoids conflicts with a local Postgres already using `5432`).

### 4. Run migrations and seed

```bash
npx prisma migrate dev
npm run prisma:seed
```

### 5. Start the API

```bash
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

### Seed admin account

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `Admin123!` |

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/` | Public health check |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public |
| POST | `/auth/logout` | Public |
| GET | `/users/me` | Authenticated |
| GET | `/users` | Admin + `users:read` |
| GET | `/users/:id` | Admin/Manager + `users:read` |
| PATCH | `/users/:id/roles` | Admin + `users:manage` |
| GET/POST | `/roles` | Protected by role + permission |
| GET/POST | `/permissions` | Protected by role + permission |

---

## Quick Auth Example

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"StrongPass123!","firstName":"Jane"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Protected route
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer <accessToken>"
```

---

## Docker

Run the full stack:

```bash
docker compose up --build
```

This starts PostgreSQL and the API, applies migrations, seeds roles/permissions, and serves the app on port `3000`.

---

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

```
Checkout
  → Install dependencies
  → Generate Prisma Client
  → Lint
  → Unit tests
  → Build
```

Workflow file: `.github/workflows/ci.yml`

---

## Engineering Decisions

### Why JWT instead of sessions?
JWT keeps authentication stateless, which simplifies horizontal scaling across multiple API instances without shared session storage.

### Why refresh tokens?
Short-lived access tokens reduce risk if leaked. Refresh tokens are stored hashed in the database so they can be rotated and revoked on logout.

### Why RBAC with permissions?
Roles alone become inflexible. Mapping roles to `resource:action` permissions keeps authorization explicit and easier to evolve as product features grow.

### Why Prisma?
Prisma provides type-safe queries, clear migrations, and a schema that documents the domain model for both humans and the application.

### Why global guards + `@Public()`?
Secure-by-default routing: every endpoint requires authentication unless explicitly marked public.

---

## Security Considerations

- Passwords hashed with bcrypt (cost factor 12)
- Refresh tokens hashed with SHA-256 before storage
- DTO whitelist validation rejects unexpected fields
- Environment variables validated at startup
- Role and permission checks enforced server-side
- CORS configured via environment

---

## Testing

```bash
npm test
npm run test:cov
npm run lint
npm run build
```

Unit coverage focuses on authentication flows and authorization guards — the highest-risk logic in this starter.

---

## Future Roadmap

- Redis caching / token denylist
- Email verification
- Password reset
- OAuth social login
- Multi-factor authentication
- Audit logging
- Rate limiting
- Multi-tenancy

---

## License

MIT
