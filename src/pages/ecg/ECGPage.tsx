import React, { useEffect, useState } from 'react';
import { ECG, ecgService } from '../../services/ecgService';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';

const ECGPage: React.FC = () => {
  const [ecgs, setEcgs] = useState<ECG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchECGs = async () => {
    try {
      setLoading(true);
      const response = await ecgService.getAllECGs();
      setEcgs(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des ECG');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchECGs();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} retry={fetchECGs} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Électrocardiogrammes (ECG)
        </h1>
        <button className="bg-senpacc-green hover:bg-senpacc-green-dark text-white px-4 py-2 rounded-lg transition-colors">
          Nouvel ECG
        </button>
      </div>

      <div className="grid gap-6">
        {ecgs.map((ecg) => (
          <Card key={ecg.id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {ecg.patient?.nom} {ecg.patient?.prenom}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date : {new Date(ecg.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {ecg.fichierUrl && (
                    <button className="text-senpacc-green hover:text-senpacc-green-dark transition-colors">
                      Voir ECG
                    </button>
                  )}
                  <button className="text-senpacc-blue hover:text-senpacc-blue-dark transition-colors">
                    Modifier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Fréquence cardiaque</p>
                  <p className="text-gray-600 dark:text-gray-400">{ecg.frequenceCardiaque} bpm</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Rythme</p>
                  <p className="text-gray-600 dark:text-gray-400">{ecg.rythme}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Interprétation</p>
                  <p className="text-gray-600 dark:text-gray-400">{ecg.interpretation}</p>
                </div>
                {ecg.anomalies.length > 0 && (
                  <div className="col-span-2">
                    <p className="font-medium text-gray-700 dark:text-gray-300">Anomalies détectées</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ecg.anomalies.map((anomalie, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        >
                          {anomalie}
                        </span>
                      ))}
                    </div>
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

export default ECGPage; 