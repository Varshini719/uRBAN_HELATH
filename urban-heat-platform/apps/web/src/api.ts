import type { DashboardData, Initiative, Station } from './types';
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path:string):Promise<T>{
  const response=await fetch(`${BASE}${path}`); if(!response.ok) throw new Error('Unable to load city data'); return response.json();
}
export const api={ dashboard:()=>request<DashboardData>('/dashboard'), stations:()=>request<Station[]>('/stations'), initiatives:()=>request<Initiative[]>('/initiatives') };
