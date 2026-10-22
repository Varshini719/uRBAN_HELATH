import type { AuthSession, DashboardData, Initiative, Station } from './types';
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) throw new Error('Unable to load city data');
  return response.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

export const api = {
  dashboard: () => request<DashboardData>('/dashboard'),
  stations: () => request<Station[]>('/stations'),
  initiatives: () => request<Initiative[]>('/initiatives'),
  login: (credentials: { email: string; password: string }) => post<AuthSession>('/auth/login', credentials),
  register: (data: { name: string; email: string; password: string; department: string; role: string; passcode?: string }) =>
    post<AuthSession>('/auth/register', data)
};
