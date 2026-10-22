export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export interface DashboardSummary {
  averageTemperature: number;
  hotspotCount: number;
  greenCoverPercent: number;
  activeStations: number;
  activeInitiatives: number;
  populationAtRisk: number;
  trend: Array<{ label: string; temperature: number; baseline: number }>;
  districts: Array<{ id: number; name: string; temperature: number; greenCover: number; risk: RiskLevel; x: number; y: number }>;
}
