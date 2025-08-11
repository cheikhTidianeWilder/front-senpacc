// import React, { useEffect, useState } from 'react';
// import PatientInformation from './PatientInformation';
// import RelevesPatients from './RelevesPatients';
// import HospitalisationPatients from './HospitalisationPatients';
// import MedicalNavigationMenu from './MedicalNavigationMenu';
// import ConsultationPatient from './ConsultationPatient';

// function PatientPage() {
//     const [patient, setPatient] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchPatientInfo() {
//             try {
//                 const sessionRes = await fetch('http://localhost:3000/api/urologie/session/get', {
//                     method: 'GET',
//                     credentials: 'include',
//                 });

//                 const sessionData = await sessionRes.json();

//                 if (!sessionRes.ok || !sessionData.success) {
//                     throw new Error(sessionData.msg || 'Session invalide');
//                 }

//                 const patientId = sessionData.patient_id;

//                 const res = await fetch('http://localhost:3000/api/urologie/consultations/consulterPatientL', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     credentials: 'include',
//                     body: JSON.stringify({ id: patientId })
//                 });

//                 const result = await res.json();

//                 if (!res.ok || !result.success) {
//                     throw new Error(result.message || 'Erreur de récupération patient');
//                 }

//                 const fullPatient = {
//                     ...result.patient,
//                     derniere_consultation: result.derniereConsultation || 'Aucune'
//                 };

//                 setPatient(fullPatient);

//             } catch (error) {
//                 console.error('Erreur de chargement des infos patient:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchPatientInfo();
//     }, []);

//     if (loading) return <p className="text-center mt-4">Chargement des données patients</p>;

//     return (
//         <div className="container mx-auto mt-0 p-2">
//             {patient ? (
//                 <>
//                     <div className="mb-16">
//                         <MedicalNavigationMenu patient={patient} />
//                     </div>
//                     <PatientInformation patient={patient} />
//                     <RelevesPatients patientId={patient.id} />
//                     <HospitalisationPatients patientId={patient.id} />
//                     <ConsultationPatient patientId={patient.id} />
//                 </>
//             ) : (
//                 <p className="text-center text-red-600 mt-4">Aucun patient sélectionné.</p>
//             )}
//         </div>
//     );
// }

// export default PatientPage;


import React, { useEffect, useState } from 'react';
import PatientInformation from './PatientInformation';
import RelevesPatients from './RelevesPatients';
import HospitalisationPatients from './HospitalisationPatients';
import MedicalNavigationMenu from './MedicalNavigationMenu';
import ConsultationPatient from './ConsultationPatient';
import AntecedentPatients from './AntecedentPatients';
import OrdonnancePatients from './OrdonnancePatients';
import RendezVousPatients from './RendezVousPatients';
import ConsultationPatientRecherche from './ConsultationPatientRecherche';
import ParacliniquePatients from './paracliniquePatients';



function PatientPage() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('patient-info'); // Onglet par défaut

    useEffect(() => {
        async function fetchPatientInfo() {
            try {
                const sessionRes = await fetch('http://localhost:3000/api/urologie/session/get', {
                    method: 'GET',
                    credentials: 'include',
                });

                const sessionData = await sessionRes.json();

                if (!sessionRes.ok || !sessionData.success) {
                    throw new Error(sessionData.msg || 'Session invalide');
                }

                const patientId = sessionData.patient_id;

                const res = await fetch('http://localhost:3000/api/urologie/consultations/consulterPatientL', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: patientId })
                });

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.message || 'Erreur de récupération patient');
                }

                const fullPatient = {
                    ...result.patient,
                    derniere_consultation: result.derniereConsultation || 'Aucune'
                };

                setPatient(fullPatient);
            } catch (error) {
                console.error('Erreur de chargement des infos patient:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPatientInfo();
    }, []);

    // Fonction pour gérer la navigation et changer d'onglet
    const handleNavigate = (sectionId) => {
        setActiveTab(sectionId);

        // Faire défiler vers la section après un petit délai pour permettre le rendu
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    if (loading) return <p className="text-center mt-4">Chargement des données patients</p>;

    return (
        <div className="container mx-auto mt-0 p-2">
            {patient ? (
                <>
                    <div className="mb-16">
                        <MedicalNavigationMenu
                            patient={patient}
                            onNavigate={handleNavigate}
                            activeTab={activeTab}
                        />
                    </div>

                    {/* Informations Patient - toujours visible */}
                    <div id="patient-info">
                        <PatientInformation patient={patient} />
                    </div>

                    {/* Relevés - visible seulement si onglet actif */}
                    {activeTab === 'releves' && (
                        <div id="releves">
                            <RelevesPatients patientId={patient.id} />
                        </div>
                    )}
                    {/* Hospitalisations - visible seulement si onglet actif */}
                    {activeTab === 'hospitalisations' && (
                        <div id="hospitalisations">
                            <HospitalisationPatients patientId={patient.id} />
                        </div>
                    )}

                    {/* Consultations - visible seulement si onglet actif */}
                    {activeTab === 'consultations' && (
                        <div id="consultations">
                            <ConsultationPatient patientId={patient.id} />
                        </div>
                    )}
                    {/* antecedents - visible seulement si onglet actif */}
                    {activeTab === 'antecedents' && (
                        <div id="antecedents">
                            <AntecedentPatients patientId={patient.id} />
                        </div>
                    )}
                    {activeTab === 'ordonnance' && (
                        <div id="ordonnance">
                            <OrdonnancePatients patientId={patient.id} />
                        </div>
                    )}
                    {activeTab === 'RDV' && (
                        <div id="RDV">
                            <RendezVousPatients patientId={patient.id} />
                        </div>
                    )}
                     {activeTab === 'para' && (
                        <div id="para">
                            <ParacliniquePatients patientId={patient.id} />
                        </div>
                    )}
                </>
            ) : (
                // <p className="text-center text-red-600 mt-4">Aucun patient sélectionné.</p>

                <div>
                    <ConsultationPatientRecherche/>
                </div>)}
        </div>
    );
}

export default PatientPage;