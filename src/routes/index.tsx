// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import AppointmentsPage from '../pages/Cardiologie/appointments/AppointmentsPage';
// import ConsultationsPage from '../pages/Cardiologie/consultations/ConsultationsPage';
// import ECGPage from '../pages/Cardiologie/ecg/ECGPage';
// import StatisticsPage from '../pages/Cardiologie/statistics/StatisticsPage';
// import Login from '../pages/Login';
// import Accueil from '../pages/Cardiologie/Accueil';

// // Import des autres pages (à créer plus tard)
// const Settings = () => <div>Page Paramètres</div>;

// const AppRoutes: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/log" replace />} />
//       <Route path="/log" element={<Login />} />
//       <Route path="/dashboard" element={<Accueil />} />
//       <Route path="/appointments" element={<AppointmentsPage />} />
//       <Route path="/consultations" element={<ConsultationsPage />} />
//       <Route path="/ecg" element={<ECGPage />} />
//       <Route path="/statistics" element={<StatisticsPage />} />
//       <Route path="/settings" element={<Settings />} />
//     </Routes>
//   );
// };

// export default AppRoutes; 

// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/Urologie/Authentification/Login';
// // Importation des routes de spécialités
// import UrologieRoutes from './spécialité/UrologieRoutes';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const AppRoutes = () => {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Navigate to="/logindex" replace />} />
//         <Route path="/logindex" element={<Login />} />
//       </Routes>
//       {/* Ajout des sous-routes spécialisées */}
//       <UrologieRoutes />
//     </>
//   );
// };

// export default AppRoutes;
