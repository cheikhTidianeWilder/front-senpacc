import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import MedicalNavigationMenu from './MedicalNavigationMenu';

function PatientLayout() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientInfo() {
      try {
        const sessionRes = await fetch('http://localhost:3000/api/urologie/session/get', {
          method: 'GET',
          credentials: 'include',
        });
        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData.success) throw new Error(sessionData.msg);

        const patientId = sessionData.patient_id;
        const res = await fetch('http://localhost:3000/api/urologie/consultations/consulterPatientL', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: patientId })
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);

        setPatient({
          ...result.patient,
          derniere_consultation: result.derniereConsultation || 'Aucune'
        });

      } catch (err) {
        console.error("Erreur chargement patient:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientInfo();
  }, []);

  if (loading) return <p className="text-center mt-6">Chargement...</p>;

  if (!patient) return <p className="text-center text-red-500">Aucun patient trouvé</p>;

  return (
    <div className="container mx-auto mt-6">
      <MedicalNavigationMenu patient={patient} />
      <div className="mt-4 px-4">
        <Outlet context={patient} />
      </div>
    </div>
  );
}

export default PatientLayout;
