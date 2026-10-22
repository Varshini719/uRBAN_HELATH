import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/client.js';
import { invalidate } from '../services/cache.js';

export const stationsRouter = Router();
stationsRouter.get('/', async (_req,res) => {
  const data = await query(`SELECT w.*,d.name district FROM weather_stations w JOIN districts d ON d.id=w.district_id ORDER BY w.name`);
  res.json(data.rows);
});

export const initiativesRouter = Router();
initiativesRouter.get('/', async (_req,res) => {
  const data = await query(`SELECT c.*,d.name district FROM cooling_initiatives c JOIN districts d ON d.id=c.district_id ORDER BY c.target_date`);
  res.json(data.rows);
});

const initiativeSchema = z.object({
  title:z.string().min(3).max(160), districtId:z.number().int().positive(), type:z.string().min(2).max(40),
  status:z.enum(['Planned','In Progress','Completed']), progress:z.number().int().min(0).max(100),
  budget:z.number().nonnegative(), startDate:z.iso.date(), targetDate:z.iso.date(), description:z.string().max(1000).default('')
});

initiativesRouter.post('/', async (req,res) => {
  const body = initiativeSchema.parse(req.body);
  const result = await query(`INSERT INTO cooling_initiatives
    (title,district_id,type,status,progress,budget,start_date,target_date,description)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [body.title,body.districtId,body.type,body.status,body.progress,body.budget,body.startDate,body.targetDate,body.description]);
  await invalidate(); res.status(201).json(result.rows[0]);
});

initiativesRouter.patch('/:id/progress', async (req,res) => {
  const { progress } = z.object({progress:z.number().int().min(0).max(100)}).parse(req.body);
  const result = await query(`UPDATE cooling_initiatives SET progress=$1,status=CASE WHEN $1=100 THEN 'Completed' ELSE status END WHERE id=$2 RETURNING *`,[progress,req.params.id]);
  if (!result.rowCount) return res.status(404).json({error:'Initiative not found'});
  await invalidate(); return res.json(result.rows[0]);
});

export const districtsRouter = Router();
districtsRouter.get('/', async (_req,res) => {
  const data = await query('SELECT * FROM districts ORDER BY name'); res.json(data.rows);
});
