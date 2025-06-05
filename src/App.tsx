// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import AppRoutes from './routes';

// const App: React.FC = () => {
//   return (
//     <Router>
//       {/* <MainLayout> */}
//         <AppRoutes />
//       {/* </MainLayout> */}
//     </Router>
//   );
// };
// export default App;


// ----------------------------------------------Orignal--------------------------------------------------------
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import CardiologieRoutes from "./routes/spécialité/CardiologieRoutes";
// import GynecologieRoutes from "./routes/spécialité/GynecologieRoutes";
// import UrologieRoutes from "./routes/spécialité/UrologieRoutes";
// import Login from "./pages/Login";

// const RoutesSelector = () => {
//   const location = useLocation();
//   const path = location.pathname;

//   return (
//     <Routes>
//       {/* ✅ Redirection à la racine vers /login */}
//       {path === "/" && <Route path="/" element={<Navigate to="/login" replace />} />}

//       {/* ✅ Route pour /login */}
//       <Route path="/login" element={<Login />} />

//       {/* ✅ Spécialités */}
//       <Route path="/*" element={<SpecialityRouter />} />
//     </Routes>
//   );
// };

// // Sépare la logique de spécialités ici
// const SpecialityRouter = () => {
//   const location = useLocation();
//   const path = location.pathname;

//   if (path.startsWith("/cardiologie")) {
//     return <CardiologieRoutes />;
//   } else if (path.startsWith("/gynecologie")) {
//     return <GynecologieRoutes />;
//   } else if (path.startsWith("/urologie")) {
//     return <UrologieRoutes />;
//   } else {
//     return <div>404 - Spécialité non trouvée</div>;
//   }
// };

// function App() {
//   return (
//     <Router>
//       <RoutesSelector />
//     </Router>
//   );
// }

// export default App;

// --------------------------------------------------------------------------------------------











// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import UrologieRoutes from "./routes/spécialité/UrologieRoutes";
// import Login from "./pages/Urologie/Authentification/Login";
// import ProtectedRoute from "./routes/ProtectedRoute"; // <-- Assure-toi du bon chemin
// import 'bootstrap/dist/css/bootstrap.min.css';



// // Sélecteur principal des routes
// const RoutesSelector = () => {
//   const location = useLocation();
//   const path = location.pathname;
//   const userRole = localStorage.getItem("role");

//   const getRedirectPath = () => {
//     if (userRole === "Urologue") return "/urologie";
//     return "/login";
//   };

//   return (
//     <Routes>
//       {/* Redirection vers la bonne spécialité */}
//       {path === "/" && <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />}

//       {/* Page de login */}
//       <Route path="/login" element={<Login />} />
//       {/* Routes protégées par rôle */}
//       <Route
//         path="/urologie/*"
//         element={
//           <ProtectedRoute allowedRole="Urologue">
//             <UrologieRoutes />
//           </ProtectedRoute>
//         }
//       />
//       {/* Si aucune spécialité ne correspond */}
//       <Route path="*" element={<div>404 - Page non trouvée</div>} />
//     </Routes>
//   );
// };

// // App principale
// function App() {
//   return (
//     <Router>
//       <RoutesSelector />
//     </Router>
//   );
// }

// export default App;

// -------------------------------------------------------------------------





import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UrologieRoutes from "./routes/spécialité/UrologieRoutes";
import Login from "./pages/Urologie/Authentification/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';

// Sélecteur principal des routes
const RoutesSelector = () => {
  const userRole = localStorage.getItem("role");

  return (
    <Routes>
      {/* Page de login (route par défaut) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Si l'utilisateur est connecté avec un rôle autorisé, redirection */}
      <Route
        path="/redirect"
        element={
          userRole === "Urologue" ? (
            <Navigate to="/urologie" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Routes protégées par rôle */}
      <Route
        path="/urologie/*"
        element={
          <ProtectedRoute allowedRole="Urologue">
            <UrologieRoutes />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Routes>
  );
};
// App principale
function App() {
  return (
    <Router>
      <RoutesSelector />
    </Router>
  );
}

export default App;
