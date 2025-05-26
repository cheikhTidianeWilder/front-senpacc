import api from './api';
import { Patient } from './patientService';

export interface Consultation {
  id: string;
  patientId: string;
  patient?: Patient;
  date: string;
  motif: string;
  symptomes: string[];
  diagnostic: string;
  prescription: string;
  notes: string;
  tensionArterielle?: string;
  frequenceCardiaque?: number;
  poids?: number;
}

export const consultationService = {
  getAllConsultations: () => api.get<Consultation[]>('/consultations'),
  getConsultationById: (id: string) => api.get<Consultation>(`/consultations/${id}`),
  createConsultation: (consultation: Omit<Consultation, 'id'>) => 
    api.post<Consultation>('/consultations', consultation),
  updateConsultation: (id: string, consultation: Partial<Consultation>) => 
    api.put<Consultation>(`/consultations/${id}`, consultation),
  deleteConsultation: (id: string) => api.delete(`/consultations/${id}`),
  getPatientConsultations: (patientId: string) => 
    api.get<Consultation[]>(`/consultations/patient/${patientId}`),
  getRecentConsultations: () => 
    api.get<Consultation[]>('/consultations/recent'),
}; 