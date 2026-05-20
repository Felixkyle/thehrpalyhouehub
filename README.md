# thehrplayhouseplay

A web app with a separate frontend and backend.

## Structure

```
thehrplayhouseplay/
├── frontend/   # Next.js + TypeScript + Tailwind CSS
├── backend/    # Node.js + Express + TypeScript
└── api-spec/   # API contract between frontend and backend (read before building endpoints)
```

## API contract

The [`api-spec/`](./api-spec/README.md) folder defines every endpoint the frontend expects from the backend — one markdown file per page, plus shared conventions and data models. **Backend work should start here.**

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

## Health check

With the backend running: <http://localhost:4000/api/health>
