// import { Routes, Route } from 'react-router-dom';
// import Patientall from '../../pages/Urologie/patients/listePatients';
// import Accueil from '../../pages/Urologie/Accueil';
// import UrologieLayout from '../../layouts/UrologieLayout';
// import AddPatientForm from '../../pages/Urologie/patients/PatientFormulaire';

// const UrologieRoutes = () => {
//     return (
//         <Routes>
//             <Route path="/" element={<UrologieLayout />}>
//                 <Route index element={<Accueil />} />
//                 <Route path="listePatients" element={<Patientall />} />
//                 <Route path="insPatient" element={<AddPatientForm />} />

//             </Route>
//         </Routes>
//     );
// };

// export default UrologieRoutes;


import { Routes, Route } from 'react-router-dom';
import Patientall from '../../pages/Urologie/patients/listePatients';
import Accueil from '../../pages/Urologie/Accueil';
import UrologieLayout from '../../layouts/UrologieLayout';
import UrologieLayoutAdmins from '../../layouts/UrologieLayoutAdmin'; // Nouveau layout pour admin
import AddPatientForm from '../../pages/Urologie/patients/PatientFormulaire';
import AddMedecinForm from '../../pages/Urologie/administrateur/MedecinFormulaire';
import AddStructureForm from '../../pages/Urologie/administrateur/structure/StructureFormulaire';
import ChefStructureForm from '../../pages/Urologie/administrateur/structure/chefStructure';
import AddqrcodeForm from '../../pages/Urologie/administrateur/qrcode/qrcode';
import InformationP from '../../pages/Urologie/medecins/PatientPage';
import ChambreManagement from '../../pages/Urologie/medecins/ChambreManagement';
import LitManagement from '../../pages/Urologie/medecins/LitManagement';
import StatistiquesUrologieRapports from '../../pages/Urologie/medecins/StatistiquesUrologieRapports';




const UrologieRoutes = () => {
    // Récupère le rôle depuis localStorage (comme dans votre App.js)
    const userRole = localStorage.getItem("role");

    // Si l'utilisateur est ADMIN, utilise le layout admin
    if (userRole === 'ADMIN') {
        return (
            <Routes>
                <Route path="/" element={<UrologieLayoutAdmins />}>
                    <Route index element={<Accueil />} />
                    <Route path="listePatients" element={<Patientall />} />
                    <Route path="insPatient" element={<AddPatientForm />} />
                    <Route path="insMedecin" element={< AddMedecinForm />} />
                    <Route path="insStructure" element={< AddStructureForm />} />
                    <Route path="genenerQrcode" element={<AddqrcodeForm />} />
                    <Route path="chefStructure" element={< ChefStructureForm />} />
                </Route>
            </Routes>
        );
    }

    // Pour les urologues, utilise le layout standard
    return (
        <Routes>
            <Route path="/" element={<UrologieLayout />}>
                <Route index element={<Accueil />} />
                <Route path="listePatients" element={<Patientall />} />
                <Route path="insPatient" element={<AddPatientForm />} />
                <Route path="infos" element={<InformationP />} />
                <Route path="chambre" element={<ChambreManagement />} />
                <Route path="lit" element={<LitManagement />} />
                <Route path="stats" element={< StatistiquesUrologieRapports />} />
            </Route>
        </Routes>
    );
};

export default UrologieRoutes;