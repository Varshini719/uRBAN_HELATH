CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  area_km2 NUMERIC(8,2) NOT NULL,
  population INTEGER NOT NULL,
  map_x NUMERIC(5,2) NOT NULL,
  map_y NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS heat_readings (
  id BIGSERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  surface_temperature NUMERIC(5,2) NOT NULL,
  air_temperature NUMERIC(5,2) NOT NULL,
  humidity NUMERIC(5,2) NOT NULL CHECK (humidity BETWEEN 0 AND 100),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS green_cover (
  id BIGSERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  cover_percent NUMERIC(5,2) NOT NULL CHECK (cover_percent BETWEEN 0 AND 100),
  tree_count INTEGER NOT NULL DEFAULT 0,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS weather_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Online', 'Maintenance', 'Offline')),
  last_seen_at TIMESTAMPTZ,
  installed_at DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS cooling_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  type VARCHAR(40) NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('Planned', 'In Progress', 'Completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_heat_district_time ON heat_readings(district_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_green_district_date ON green_cover(district_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_station_status ON weather_stations(status);
CREATE INDEX IF NOT EXISTS idx_initiative_status ON cooling_initiatives(status);
