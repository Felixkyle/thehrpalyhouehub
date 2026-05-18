# thehrplayhouseplay

A web app with a separate frontend and backend.

## Structure

```
thehrplayhouseplay/
├── frontend/   # Next.js + TypeScript + Tailwind CSS
└── backend/    # Node.js + Express + TypeScript
```

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
