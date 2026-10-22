import { Router } from 'express';
import { query } from '../db/client.js';
import { cached } from '../services/cache.js';
import type { DashboardSummary, RiskLevel } from '../types.js';

const router = Router();
const risk = (temperature: number): RiskLevel => temperature >= 43 ? 'Critical' : temperature >= 39 ? 'High' : temperature >= 36 ? 'Moderate' : 'Low';

router.get('/', async (_req, res) => {
  const result = await cached<DashboardSummary>('urban-heat:dashboard', 60, async () => {
    const [districtRows, stationRows, initiativeRows, trendRows] = await Promise.all([
      query<{id:number;name:string;temperature:string;green_cover:string;population:number;map_x:string;map_y:string}>(`
        SELECT d.id,d.name,d.population,d.map_x,d.map_y,
          (SELECT surface_temperature FROM heat_readings h WHERE h.district_id=d.id ORDER BY recorded_at DESC LIMIT 1) temperature,
          (SELECT cover_percent FROM green_cover g WHERE g.district_id=d.id ORDER BY measured_at DESC LIMIT 1) green_cover
        FROM districts d ORDER BY d.id`),
      query<{active:string}>('SELECT COUNT(*) active FROM weather_stations WHERE status=$1',['Online']),
      query<{active:string}>('SELECT COUNT(*) active FROM cooling_initiatives WHERE status<>$1',['Completed']),
      query<{label:string;temperature:string;baseline:string}>(`
        SELECT TO_CHAR(recorded_at,'Dy') label, ROUND(AVG(air_temperature),1) temperature,
          ROUND(AVG(air_temperature)-2.4,1) baseline FROM heat_readings
        WHERE recorded_at >= NOW()-INTERVAL '8 days' GROUP BY DATE(recorded_at), TO_CHAR(recorded_at,'Dy') ORDER BY DATE(recorded_at)`)
    ]);
    const districts = districtRows.rows.map((row) => ({ id: row.id, name: row.name, temperature: Number(row.temperature), greenCover: Number(row.green_cover), risk: risk(Number(row.temperature)), x: Number(row.map_x), y: Number(row.map_y) }));
    const totalPopulation = districtRows.rows.reduce((sum,row) => sum + row.population,0);
    const atRisk = districtRows.rows.filter((row)=>Number(row.temperature)>=39).reduce((sum,row)=>sum+row.population,0);
    return {
      averageTemperature: Number((districts.reduce((sum,d)=>sum+d.temperature,0)/districts.length).toFixed(1)),
      hotspotCount: districts.filter((d)=>d.risk==='High'||d.risk==='Critical').length,
      greenCoverPercent: Number((districts.reduce((sum,d)=>sum+d.greenCover,0)/districts.length).toFixed(1)),
      activeStations: Number(stationRows.rows[0]?.active ?? 0), activeInitiatives: Number(initiativeRows.rows[0]?.active ?? 0),
      populationAtRisk: Math.round((atRisk/totalPopulation)*100), districts,
      trend: trendRows.rows.map((r)=>({ label:r.label, temperature:Number(r.temperature), baseline:Number(r.baseline) }))
    };
  });
  res.json(result);
});

export default router;
