import React, { useEffect, useState } from 'react';
import { Consultation, consultationService } from '../../services/consultationService';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';

const ConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getAllConsultations();
      setConsultations(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} retry={fetchConsultations} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Consultations
        </h1>
        <button className="bg-senpacc-green hover:bg-senpacc-green-dark text-white px-4 py-2 rounded-lg transition-colors">
          Nouvelle Consultation
        </button>
      </div>

      <div className="grid gap-6">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {consultation.patient?.nom} {consultation.patient?.prenom}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date : {new Date(consultation.date).toLocaleDateString()}
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

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Motif</p>
                  <p className="text-gray-600 dark:text-gray-400">{consultation.motif}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Diagnostic</p>
                  <p className="text-gray-600 dark:text-gray-400">{consultation.diagnostic}</p>
                </div>
                {consultation.tensionArterielle && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Tension artérielle</p>
                    <p className="text-gray-600 dark:text-gray-400">{consultation.tensionArterielle}</p>
                  </div>
                )}
                {consultation.frequenceCardiaque && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Fréquence cardiaque</p>
                    <p className="text-gray-600 dark:text-gray-400">{consultation.frequenceCardiaque} bpm</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConsultationsPage; 