# ThermaCity — Urban Heat Monitoring Platform

A full-stack urban climate intelligence platform for monitoring heat hotspots, green cover, weather stations, and cooling initiatives.

## Stack

- React 19, TypeScript, Vite, Recharts
- Node.js, Express 5, REST API
- PostgreSQL 16 and Redis 7
- Docker Compose, Nginx

## Quick start with Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`. The API runs at `http://localhost:4000`, with a health check at `/health`.

## Local development

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The dashboard uses realistic fallback data when the API is unavailable, so the interface remains previewable during frontend development.

## Interactive workflows

- Global search and actionable notification centre
- Clickable heat map, risk filters, and CSV export
- Green-cover survey form and district detail views
- Weather-station registration and status controls
- Cooling-initiative creation and project details
- Report creation, scheduling, and file downloads

New stations and initiatives created in frontend-only mode are stored in the browser. With Docker running, the dashboard also reads from the PostgreSQL-backed REST API.

## REST endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health |
| GET | `/api/dashboard` | Aggregated city overview |
| GET | `/api/districts` | District master data |
| GET | `/api/stations` | Weather-station network |
| GET | `/api/initiatives` | Cooling initiatives |
| POST | `/api/initiatives` | Create an initiative |
| PATCH | `/api/initiatives/:id/progress` | Update progress |

## Project structure

```text
apps/web       React dashboard
apps/api       Express REST API
infra/postgres Database schema and seed data
```

This baseline is structured for later additions such as authentication, GIS tile layers, live sensor ingestion, notifications, and audit logs.
