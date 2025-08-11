// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/urologie/consultations'; // adapte selon ton backend

// export const getPatientById = async () => {
//   const idPatient = localStorage.getItem('idPatient');
//   try {
//     const response = await axios.post(`${API_URL}/consulterPatientL`, { id: idPatient });
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération du patient:', error);
//     throw error;
//   }
// };

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/urologie';

/**
 * Récupère l'ID du patient actuellement stocké en session (sur le backend)
 */
export const getPatientFromSession = async () => {
  try {
    const sessionRes = await axios.get(`${API_URL}/session/get`, { withCredentials: true });
    if (!sessionRes.data.success) throw new Error('Session invalide');

    const idPatient = sessionRes.data.patient_id;

    const patientRes = await axios.post(
      `${API_URL}/consultations/consulterPatientL`,
      { id: idPatient },
      { withCredentials: true }
    );

    if (!patientRes.data.success) throw new Error(patientRes.data.message || 'Erreur patient');

    return {
      ...patientRes.data.patient,
      derniere_consultation: patientRes.data.derniereConsultation || 'Aucune'
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du patient via session:', error);
    throw error;
  }
};
