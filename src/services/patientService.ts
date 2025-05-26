import api from './api';

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  adresse: string;
  antecedents: string[];
}

export const patientService = {
  getAllPatients: () => api.get<Patient[]>('/patients'),
  getPatientById: (id: string) => api.get<Patient>(`/patients/${id}`),
  createPatient: (patient: Omit<Patient, 'id'>) => api.post<Patient>('/patients', patient),
  updatePatient: (id: string, patient: Partial<Patient>) => api.put<Patient>(`/patients/${id}`, patient),
  deletePatient: (id: string) => api.delete(`/patients/${id}`),
  searchPatients: (query: string) => api.get<Patient[]>(`/patients/search?q=${query}`),
}; 