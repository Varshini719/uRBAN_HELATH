export type Risk = 'Low'|'Moderate'|'High'|'Critical';
export interface District { id:number; name:string; temperature:number; greenCover:number; risk:Risk; x:number; y:number }
export interface DashboardData { averageTemperature:number; hotspotCount:number; greenCoverPercent:number; activeStations:number; activeInitiatives:number; populationAtRisk:number; trend:{label:string;temperature:number;baseline:number}[]; districts:District[] }
export interface Station { id:string; name:string; district:string; latitude:string; longitude:string; status:'Online'|'Maintenance'|'Offline'; last_seen_at:string; installed_at:string }
export interface Initiative { id:string; title:string; district:string; type:string; status:'Planned'|'In Progress'|'Completed'; progress:number; budget:string; start_date:string; target_date:string; description:string }
export interface UserProfile { id:string; name:string; email:string; role:string; department:string; avatarInitials:string; badge?:string }
export interface AuthSession { token:string; user:UserProfile }
