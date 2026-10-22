TRUNCATE cooling_initiatives, weather_stations, green_cover, heat_readings, districts RESTART IDENTITY CASCADE;

INSERT INTO districts (name, area_km2, population, map_x, map_y) VALUES
('Central Ward', 18.4, 284000, 49, 43), ('North Ridge', 31.8, 176000, 48, 20),
('East Industrial', 24.2, 221000, 72, 44), ('River South', 29.5, 198000, 52, 72),
('West Gardens', 26.1, 153000, 24, 48), ('Lake District', 21.7, 132000, 76, 72);

INSERT INTO heat_readings (district_id, surface_temperature, air_temperature, humidity, recorded_at)
SELECT d.id, v.surface, v.air, v.humidity, NOW() - v.age * INTERVAL '1 hour'
FROM districts d JOIN (VALUES
('Central Ward',43.8,39.2,38,1),('North Ridge',38.2,35.4,46,1),('East Industrial',45.1,40.6,33,1),
('River South',39.7,36.1,51,1),('West Gardens',34.5,32.6,58,1),('Lake District',36.8,33.9,61,1)
) AS v(name,surface,air,humidity,age) ON d.name=v.name;

INSERT INTO heat_readings (district_id, surface_temperature, air_temperature, humidity, recorded_at)
SELECT d.id, 31 + (day * .65) + d.id * .25, 29 + (day * .52) + d.id * .18, 55 - day, NOW() - (7-day) * INTERVAL '1 day'
FROM districts d CROSS JOIN generate_series(1,7) day;

INSERT INTO green_cover (district_id, cover_percent, tree_count) VALUES
(1,12.4,18200),(2,24.8,41600),(3,8.2,9700),(4,21.3,35400),(5,38.7,62100),(6,31.5,48300);

INSERT INTO weather_stations (name,district_id,latitude,longitude,status,last_seen_at,installed_at) VALUES
('Civic Centre AWS',1,13.082680,80.270718,'Online',NOW()-INTERVAL '4 minutes','2023-06-10'),
('North Ridge Observatory',2,13.134200,80.241900,'Online',NOW()-INTERVAL '8 minutes','2022-11-02'),
('Industrial Estate Sensor',3,13.090300,80.318100,'Maintenance',NOW()-INTERVAL '2 hours','2024-01-18'),
('River South Station',4,13.023900,80.260100,'Online',NOW()-INTERVAL '6 minutes','2023-09-14'),
('Botanical Garden Node',5,13.072100,80.208400,'Online',NOW()-INTERVAL '3 minutes','2024-03-08'),
('Lake District Monitor',6,13.031200,80.304000,'Offline',NOW()-INTERVAL '1 day','2022-07-21');

INSERT INTO cooling_initiatives (title,district_id,type,status,progress,budget,start_date,target_date,description) VALUES
('Cool Roofs for Public Schools',1,'Cool Roofs','In Progress',68,12500000,'2025-01-10','2025-11-30','Reflective roofing across 42 public schools.'),
('East Industrial Green Corridor',3,'Urban Forestry','In Progress',42,24800000,'2025-02-01','2026-03-31','Native tree corridor along industrial transit routes.'),
('West Gardens Pocket Parks',5,'Green Space','Completed',100,8200000,'2024-04-15','2025-02-28','Six neighborhood-scale shaded public spaces.'),
('River South Shade Network',4,'Shade Structures','Planned',12,9400000,'2025-08-01','2026-05-31','Shaded pedestrian routes near transit and markets.'),
('Lake District Mist Stations',6,'Public Cooling','Planned',5,3100000,'2025-10-01','2026-02-28','Water-efficient cooling points at high-footfall areas.');
