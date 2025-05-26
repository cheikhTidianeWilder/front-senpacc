import api from './api';
import { Patient } from './patientService';

export interface ECG {
  id: string;
  patientId: string;
  patient?: Patient;
  date: string;
  resultat: string;
  interpretation: string;
  frequenceCardiaque: number;
  rythme: string;
  anomalies: string[];
  fichierUrl?: string;
  notes?: string;
}

export const ecgService = {
  getAllECGs: () => api.get<ECG[]>('/ecgs'),
  getECGById: (id: string) => api.get<ECG>(`/ecgs/${id}`),
  createECG: (ecg: Omit<ECG, 'id'>) => api.post<ECG>('/ecgs', ecg),
  updateECG: (id: string, ecg: Partial<ECG>) => api.put<ECG>(`/ecgs/${id}`, ecg),
  deleteECG: (id: string) => api.delete(`/ecgs/${id}`),
  getPatientECGs: (patientId: string) => api.get<ECG[]>(`/ecgs/patient/${patientId}`),
  uploadECGFile: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/ecgs/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 