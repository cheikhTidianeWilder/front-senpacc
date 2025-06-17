import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UrologieRoutes from "./routes/spécialité/UrologieRoutes";
// import Login from "./pages/Urologie/Authentification/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/Urologie/Authentification/Login";

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
