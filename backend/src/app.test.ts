import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from './app.js';

describe('API health', () => {
  it('reports an operational service', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'urban-heat-api' });
  });

  it('returns a JSON 404 response', async () => {
    const response = await request(app).get('/missing');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Resource not found');
  });
});
