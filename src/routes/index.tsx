import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PatientsPage from '../pages/patients/PatientsPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import ConsultationsPage from '../pages/consultations/ConsultationsPage';
import ECGPage from '../pages/ecg/ECGPage';
import StatisticsPage from '../pages/statistics/StatisticsPage';

// Import des autres pages (à créer plus tard)
const Settings = () => <div>Page Paramètres</div>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/consultations" element={<ConsultationsPage />} />
      <Route path="/ecg" element={<ECGPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes; 