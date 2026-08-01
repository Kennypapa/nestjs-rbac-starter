# NestJS RBAC Starter

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/Kennypapa/nestjs-rbac-starter/ci.yml?branch=main&style=for-the-badge&label=CI)

A NestJS backend starter that shows how I design authentication, authorization, and API architecture for SaaS-style applications — not just how to wire a tutorial together.

Built with JWT access tokens, rotating refresh tokens, RBAC (roles + permissions), PostgreSQL, Prisma, Swagger, Docker, and GitHub Actions CI.

---

## Why this project exists

Most auth demos stop at “login returns a token.”

This one goes further into the decisions production backends actually need:

- Short-lived access tokens + revocable refresh tokens
- Authorization that is secure by default
- Clear module boundaries so features can grow without becoming spaghetti
- Docs, tests, containers, and CI so the project is runnable and reviewable

If you’re evaluating me as a backend engineer, this repo is meant to answer: *Can this person design and ship a secure API foundation?*

---

## What a recruiter / hiring manager should notice

| Signal | Where it shows up |
|--------|-------------------|
| Auth that can scale | Stateless JWT + hashed refresh tokens in Postgres |
| Real authorization, not role strings only | Roles mapped to `resource:action` permissions |
| Secure defaults | Global auth guard; public routes opted in with `@Public()` |
| Clean architecture | Controllers → services → Prisma; feature modules |
| Production habits | Env validation, DTO validation, exception filter, Docker, CI |
| Explainable decisions | “Engineering Decisions” section below |

---

## Tech Stack

| Area | Choice |
|------|--------|
| Runtime | Node.js 20 |
| Framework | NestJS |
| Language | TypeScript (strict) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Passport |
| Docs | Swagger / OpenAPI (`/docs`) |
| Containers | Docker + Compose |
| CI | GitHub Actions (lint → test → build) |

---

## Features

**Authentication**
- Register / login / logout
- JWT access tokens
- Refresh token rotation (stored hashed)
- bcrypt password hashing

**Authorization (RBAC)**
- Roles: `ADMIN`, `MANAGER`, `USER`
- Permissions as `resource:action` (e.g. `users:read`)
- Guards: JWT → Roles → Permissions
- Decorators: `@Public()`, `@Roles()`, `@RequirePermissions()`, `@CurrentUser()`

**Platform**
- Swagger UI
- Global validation pipe + exception filter
- Joi environment validation
- Unit tests for auth + guards
- Dockerized Postgres + API
- CI on every push to `main`

---

## Architecture

```
Client
  │
  ▼
Controller
  │
  ▼
JWT Guard → Roles Guard → Permissions Guard
  │
  ▼
Service (business rules)
  │
  ▼
Prisma
  │
  ▼
PostgreSQL
```

**Auth flow:** credentials validated → access JWT issued → refresh token hashed & stored → client sends `Authorization: Bearer <token>`

**Authz flow:** authenticate identity → check role (if required) → check permission (if required) → allow / deny

```
src/
├── auth           # register, login, refresh, logout, JWT strategy
├── users          # profile + role assignment
├── roles          # role management + permission mapping
├── permissions    # permission catalog
├── prisma         # database access
├── common         # guards, decorators, filters
└── config         # env config + validation
```

---

## Quick start

**Prerequisites:** Node.js 20+, Docker

```bash
git clone https://github.com/Kennypapa/nestjs-rbac-starter.git
cd nestjs-rbac-starter
npm install
cp .env.example .env
npm run db:up
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

| | |
|--|--|
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/docs |
| Admin login | `admin@example.com` / `Admin123!` |

> Postgres is mapped to host port **5433** by default so it won’t collide with a local Postgres on `5432`.

**One-command stack:**

```bash
docker compose up --build
```

---

## Try it

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

### Main endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/` | Public health |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `POST` | `/auth/refresh` | Public |
| `POST` | `/auth/logout` | Public |
| `GET` | `/users/me` | Authenticated |
| `GET` | `/users` | Admin + `users:read` |
| `PATCH` | `/users/:id/roles` | Admin + `users:manage` |
| `GET`/`POST` | `/roles` | Role + permission protected |
| `GET`/`POST` | `/permissions` | Role + permission protected |

---

## Engineering decisions

**JWT instead of sessions**  
Keeps the API stateless so multiple instances can authenticate requests without shared session storage.

**Refresh tokens (hashed in DB)**  
Access tokens stay short-lived. Refresh tokens can be rotated and revoked on logout — something pure JWT-only setups usually can’t do cleanly.

**Roles + permissions**  
Roles alone get brittle (“isManager-ish”). Mapping roles to `resource:action` permissions keeps authorization explicit as the product grows.

**Global guards + `@Public()`**  
Secure by default. Every route requires auth unless I deliberately open it.

**Prisma**  
Type-safe queries, reviewable migrations, and a schema that doubles as documentation of the domain model.

---

## Security notes

- Passwords hashed with bcrypt (cost 12)
- Refresh tokens stored as SHA-256 hashes, never plaintext
- DTO whitelist validation (`forbidNonWhitelisted`)
- Env vars validated at startup with Joi
- Authorization enforced server-side in guards
- CORS origin configured via environment

---

## CI pipeline

Every push / PR to `main`:

```
Install → Prisma generate → Lint → Unit tests → Build
```

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

```bash
npm test
npm run lint
npm run build
```

Tests focus on auth flows and authorization guards — the highest-risk logic in this starter.

---

## Screenshots

Add these after you capture them (Swagger + a few request/response shots make the repo feel real in under 10 seconds of scrolling):

1. Swagger UI (`/docs`)
2. Login response with access + refresh tokens
3. `GET /users/me` with Bearer auth
4. Forbidden response when a `USER` hits an admin route

---

## What’s next

Intentional follow-ons, not missing homework:

- Rate limiting
- Email verification + password reset
- Audit logging
- Redis-backed token denylist
- Broader integration test suite

---

## License

MIT
