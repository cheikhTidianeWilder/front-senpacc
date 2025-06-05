import { Routes, Route } from 'react-router-dom';
import PatientsPage from '../../pages/Urologie/patients/PatientsPage';
import Accueil from '../../pages/Urologie/Accueil';
import UrologieLayout from '../../layouts/UrologieLayout';

const UrologieRoutes = () => {
    return (
        <Routes>
            <Route path="/urologie" element={<UrologieLayout />}>
                <Route index element={<Accueil />} />
                <Route path="/urologie/patients" element={<PatientsPage />} />
            </Route>
        </Routes>
    );
};
export default UrologieRoutes;
