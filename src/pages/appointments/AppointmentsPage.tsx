import React, { useEffect, useState } from 'react';
import { Appointment, appointmentService } from '../../services/appointmentService';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllAppointments();
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de récupérer la liste des rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'planifié':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'terminé':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'annulé':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} retry={fetchAppointments} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Rendez-vous
        </h1>
        <button className="bg-senpacc-green hover:bg-senpacc-green-dark text-white px-4 py-2 rounded-lg transition-colors">
          Nouveau Rendez-vous
        </button>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {appointment.patient?.nom} {appointment.patient?.prenom}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(appointment.date).toLocaleDateString()} à {appointment.heure}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Motif : {appointment.motif}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-senpacc-green hover:text-senpacc-green-dark transition-colors">
                  Confirmer
                </button>
                <button className="text-senpacc-blue hover:text-senpacc-blue-dark transition-colors">
                  Modifier
                </button>
                <button className="text-red-500 hover:text-red-600 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage; 