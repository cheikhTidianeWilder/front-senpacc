import React, { useEffect, useState } from 'react';
import { Patient, patientService } from '../../services/patientService';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients();
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de récupérer la liste des patients. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} retry={fetchPatients} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Liste des Patients
        </h1>
        <button className="bg-senpacc-green hover:bg-senpacc-green-dark text-white px-4 py-2 rounded-lg transition-colors">
          Nouveau Patient
        </button>
      </div>

      <div className="grid gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {patient.nom} {patient.prenom}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Né(e) le : {new Date(patient.dateNaissance).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tél : {patient.telephone}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-senpacc-green hover:text-senpacc-green-dark transition-colors">
                  Voir détails
                </button>
                <button className="text-senpacc-blue hover:text-senpacc-blue-dark transition-colors">
                  Modifier
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientsPage; 