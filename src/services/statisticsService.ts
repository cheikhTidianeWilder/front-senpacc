import api from './api';

export interface StatisticsData {
  consultationsParMois: {
    mois: string;
    nombre: number;
  }[];
  patientsParJour: {
    jour: string;
    nombre: number;
  }[];
  distributionPathologies: {
    pathologie: string;
    nombre: number;
  }[];
  ecgParMois: {
    mois: string;
    nombre: number;
  }[];
  tauxSatisfaction: number;
  totalPatients: number;
  totalConsultations: number;
  totalECG: number;
}

export const statisticsService = {
  getGeneralStatistics: () => api.get<StatisticsData>('/statistics/general'),
  getConsultationStats: (debut: string, fin: string) => 
    api.get<StatisticsData>(`/statistics/consultations?debut=${debut}&fin=${fin}`),
  getPatientStats: () => api.get<StatisticsData>('/statistics/patients'),
  getECGStats: (debut: string, fin: string) => 
    api.get<StatisticsData>(`/statistics/ecg?debut=${debut}&fin=${fin}`),
  getPathologieStats: () => api.get<StatisticsData>('/statistics/pathologies'),
}; 