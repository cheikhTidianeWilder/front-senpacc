import { Routes, Route } from 'react-router-dom';
import Patientall from '../../pages/Urologie/patients/listePatients';
import Accueil from '../../pages/Urologie/Accueil';
import UrologieLayout from '../../layouts/UrologieLayout';
import AddPatientForm from '../../pages/Urologie/patients/PatientFormulaire';

const UrologieRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UrologieLayout />}>
                <Route index element={<Accueil />} />
                <Route path="listePatients" element={<Patientall />} />
                <Route path="insPatient" element={<AddPatientForm />} />

            </Route>
        </Routes>
    );
};

export default UrologieRoutes;
