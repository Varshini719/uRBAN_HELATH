# ThermaCity — Urban Heat Monitoring Platform

A full-stack urban climate intelligence platform for monitoring heat hotspots, green cover, weather stations, cooling initiatives, and municipal resilience planning.

---

## Project Structure

The project is arranged into separate **frontend** and **backend** folders at the repository root:

```text
.
├── frontend/                  # React 19 + TypeScript + Vite web dashboard & login
│   ├── src/
│   │   ├── components/        # HeatMap, Layout, Modal, Toast, Loading
│   │   ├── pages/             # Dashboard, Hotspots, GreenCover, Stations, Initiatives, Reports, Login
│   │   ├── context.tsx        # Auth state (user/login/logout) & toast alerts
│   │   ├── api.ts             # REST client with automatic mock fallback
│   │   ├── mockData.ts        # Seeded datasets for offline/standalone mode
│   │   └── styles.css         # ThermaCity design system & theme
│   └── package.json
│
├── backend/                   # Express 5 REST API & caching service
│   ├── src/
│   │   ├── routes/            # Dashboard, Resources (Stations/Initiatives/Districts), Auth
│   │   ├── services/          # Redis caching layer with fallback
│   │   ├── db/                # PostgreSQL client, migrations, & seeders
│   │   ├── middleware/        # Error & not-found handlers
│   │   └── app.ts             # Express server configuration
│   └── package.json
│
├── infra/                     # Infrastructure configuration
│   └── postgres/              # SQL schema (001_schema.sql) & seeds (002_seed.sql)
│
├── Dockerfile.api             # Container build for Express API
├── Dockerfile.web             # Container build for React frontend + Nginx
├── docker-compose.yml         # Multi-container orchestration (Web, API, Postgres, Redis)
├── nginx.conf                 # Nginx reverse proxy configuration
├── .env.example               # Environment variables template
└── package.json               # Root monorepo workspace configuration
```

---

## Quick Start with Docker

```bash
docker compose up --build
```

- **Frontend Dashboard & Login**: `http://localhost:8080`
- **Backend API**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

---

## Local Development (Without Docker)

### 1. Configure environment
```bash
cp .env.example .env
npm install
```

### 2. Set up database (PostgreSQL & Redis)
```bash
npm run db:migrate
npm run db:seed
```

### 3. Run both frontend and backend concurrently
```bash
npm run dev
```

> **Note:** The frontend dashboard includes realistic fallback data when the API is unreachable, so the interface can be developed and previewed independently.

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service health status |
| POST | `/api/auth/login` | Authenticate municipal user |
| GET | `/api/dashboard` | Consolidated city heat & canopy overview |
| GET | `/api/districts` | Master list of monitored wards & districts |
| GET | `/api/stations` | Weather-station sensor network status |
| GET | `/api/initiatives` | Active cooling interventions |
| POST | `/api/initiatives` | Register a new cooling initiative |
| PATCH | `/api/initiatives/:id/progress` | Update project progress |
