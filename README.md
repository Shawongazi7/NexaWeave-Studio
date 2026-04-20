# NexaWeave Studio

NexaWeave Studio is a modern website builder platform that lets users create, edit, and publish multi-page websites through a visual editor, reusable templates, and account-based project management.

It ships with:

- A React + TypeScript frontend (Vite)
- An Express backend API
- SQLite persistence (direct SQL, no Prisma)

## Why This Project

- Build and customize websites quickly with template-driven workflows
- Save and publish user projects with authentication
- Edit rich page content in a visual environment with section-level controls
- Keep local development lightweight with SQLite

## Core Features

- Template gallery with preview and one-click usage
- Advanced visual page editor with section controls
- Authentication (signup, login, me)
- User dashboard for project management
- Publish workflow with generated public URL metadata
- Toast-driven UX feedback and robust API error handling

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind-based UI components
- Backend: Node.js, Express, JWT, bcrypt
- Database: SQLite (via Node builtin node:sqlite API)
- Build Tools: Vite, ESLint

## Monorepo Structure

```text
.
|- src/                  # Frontend app (React + TypeScript)
|  |- components/        # UI and feature components
|  |- hooks/             # App-level logic hooks
|  |- contexts/          # Auth and global state
|  |- data/              # Static dataset (template catalog)
|  |- lib/               # API client wrappers
|  |- utils/             # Frontend API utility helpers
|
|- server/               # Express backend API
|- data/                 # SQLite DB file location (created at runtime)
|- public/               # Static assets
|- .env.example          # Environment template
|- package.json
```

## Quick Start (Local)

### 1. Prerequisites

- Node.js 22+ (required for node:sqlite)
- npm 10+

### 2. Install

```bash
npm install
```

### 3. Configure environment

Create a local env file from the template:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Run backend + frontend

```bash
npm run dev:full
```

Default URLs:

- Frontend: http://localhost:3000
- API: http://localhost:4000

## Environment Variables

Use the following values in local development unless you have custom ports.

### Frontend (Vite)

- VITE_API_BASE_URL

Example:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (Express)

- JWT_SECRET: token signing secret
- CORS_ORIGIN: comma-separated allowed origins
- SQLITE_DB_PATH: SQLite file path

Example:

```env
JWT_SECRET=replace-with-a-strong-local-secret
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
SQLITE_DB_PATH=./data/app.db
ENABLE_DEMO_SEED=false
```

## Available Scripts

- npm run dev: starts frontend (Vite)
- npm run server: starts backend API
- npm run dev:full: runs backend + frontend together
- npm run build: production frontend build

## API Summary

Auth routes:

- POST /auth/signup
- POST /auth/login
- GET /auth/me

Project routes (Bearer token required):

- GET /projects
- POST /projects
- PUT /projects/:id
- DELETE /projects/:id

Health routes:

- GET /
- GET /health

## Deployment (Fastest Stable Path)

Recommended for quickest reliable production rollout:

1. Deploy frontend to Vercel.
2. Deploy backend to Render or Railway as a separate service.
3. Use persistent storage for SQLite on backend host.
4. Set VITE_API_BASE_URL on Vercel to backend URL.
5. Set CORS_ORIGIN on backend to your Vercel domain.

### Vercel (Frontend)

- Build Command: npm run build
- Output Directory: build
- Env: VITE_API_BASE_URL=https://your-api-domain

### Backend Host (Render/Railway)

- Start Command: npm run server
- Env:
    - JWT_SECRET=<strong-random-secret>
    - CORS_ORIGIN=https://your-vercel-domain
    - SQLITE_DB_PATH=/persistent-disk/app.db
    - ENABLE_DEMO_SEED=false

## Notes

- The backend uses Node builtin node:sqlite, which currently shows an experimental warning in Node 22, but works correctly for this project.
- Local backend env is loaded from `.env` via the `npm run server` script.
- Demo seed user creation is disabled by default. Set `ENABLE_DEMO_SEED=true` only for local demos.

## Roadmap Ideas

- Move to managed Postgres for multi-instance production scaling
- Add automated tests for auth and project endpoints
- Add role-based collaboration and team workspaces

## License

Internal / private project by default. Add a LICENSE file before public/open-source distribution.
