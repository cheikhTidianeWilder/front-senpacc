import api from './api';
import { Patient } from './patientService';

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  date: string;
  heure: string;
  motif: string;
  status: 'planifié' | 'terminé' | 'annulé';
  notes?: string;
}

export const appointmentService = {
  getAllAppointments: () => api.get<Appointment[]>('/appointments'),
  getAppointmentById: (id: string) => api.get<Appointment>(`/appointments/${id}`),
  createAppointment: (appointment: Omit<Appointment, 'id'>) => 
    api.post<Appointment>('/appointments', appointment),
  updateAppointment: (id: string, appointment: Partial<Appointment>) => 
    api.put<Appointment>(`/appointments/${id}`, appointment),
  deleteAppointment: (id: string) => api.delete(`/appointments/${id}`),
  getPatientAppointments: (patientId: string) => 
    api.get<Appointment[]>(`/appointments/patient/${patientId}`),
  getTodayAppointments: () => 
    api.get<Appointment[]>('/appointments/today'),
}; 