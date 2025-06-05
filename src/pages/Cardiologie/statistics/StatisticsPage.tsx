import React, { useEffect, useState } from 'react';
import { StatisticsData, statisticsService } from '../../../services/statisticsService';
import Card from '../../../components/Card';
import ErrorMessage from '../../../components/ErrorMessage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getGeneralStatistics();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error || !stats) {
    return <ErrorMessage message={error || 'Impossible de charger les statistiques'} retry={fetchStats} />;
  }

  const consultationsData = {
    labels: stats.consultationsParMois.map(item => item.mois),
    datasets: [
      {
        label: 'Consultations par mois',
        data: stats.consultationsParMois.map(item => item.nombre),
        borderColor: 'rgb(0, 161, 156)',
        backgroundColor: 'rgba(0, 161, 156, 0.5)',
      },
    ],
  };

  const patientsData = {
    labels: stats.patientsParJour.map(item => item.jour),
    datasets: [
      {
        label: 'Patients par jour',
        data: stats.patientsParJour.map(item => item.nombre),
        backgroundColor: 'rgba(0, 161, 156, 0.8)',
      },
    ],
  };

  const pathologiesData = {
    labels: stats.distributionPathologies.map(item => item.pathologie),
    datasets: [
      {
        data: stats.distributionPathologies.map(item => item.nombre),
        backgroundColor: [
          'rgba(0, 161, 156, 0.8)',
          'rgba(21, 101, 192, 0.8)',
          'rgba(0, 161, 156, 0.6)',
          'rgba(21, 101, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Statistiques
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-green dark:text-senpacc-green-dark">
            {stats.totalPatients}
          </div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">Total Patients</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">
            {stats.totalConsultations}
          </div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">Consultations</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-green dark:text-senpacc-green-dark">
            {stats.totalECG}
          </div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">ECG réalisés</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">
            {stats.tauxSatisfaction}%
          </div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">Satisfaction</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Évolution des consultations">
          <div className="h-80">
            <Line
              data={consultationsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
        <Card title="Patients par jour">
          <div className="h-80">
            <Bar
              data={patientsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Distribution des pathologies">
          <div className="h-80">
            <Doughnut
              data={pathologiesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage; 