import React from 'react';
import Card from '../components/Card';
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

const Dashboard: React.FC = () => {
  // Options communes pour les graphiques
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
    },
  };

  // Données pour le graphique linéaire
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Consultations',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: document.documentElement.classList.contains('dark') ? '#00c4bc' : '#00A19C',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(0, 196, 188, 0.2)' : 'rgba(0, 161, 156, 0.5)',
        tension: 0.4,
      },
      {
        label: 'ECG réalisés',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: document.documentElement.classList.contains('dark') ? '#1e88e5' : '#1565C0',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(30, 136, 229, 0.2)' : 'rgba(21, 101, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Données pour le graphique en barres
  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    datasets: [
      {
        label: 'Patients par jour',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: document.documentElement.classList.contains('dark') ? '#00c4bc' : 'rgba(0, 161, 156, 0.8)',
      },
    ],
  };

  // Données pour le graphique en donut
  const doughnutData = {
    labels: ['Cardiopathie', 'Hypertension', 'Arythmie', 'Autres'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          document.documentElement.classList.contains('dark') ? '#00c4bc' : 'rgba(0, 161, 156, 0.8)',
          document.documentElement.classList.contains('dark') ? '#1e88e5' : 'rgba(21, 101, 192, 0.8)',
          document.documentElement.classList.contains('dark') ? '#00a3a3' : 'rgba(0, 161, 156, 0.6)',
          document.documentElement.classList.contains('dark') ? '#1976d2' : 'rgba(21, 101, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-green dark:text-senpacc-green-dark">152</div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">Patients ce mois</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">48</div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">ECG réalisés</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-green dark:text-senpacc-green-dark">89%</div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">Taux de satisfaction</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">12</div>
          <div className="text-gray-600 dark:text-gray-400 mt-2">RDV aujourd'hui</div>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Tendances mensuelles">
          <div className="h-80">
            <Line options={commonOptions} data={lineData} />
          </div>
        </Card>
        <Card title="Patients par jour">
          <div className="h-80">
            <Bar options={commonOptions} data={barData} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Distribution des pathologies">
          <div className="h-80">
            <Doughnut 
              options={{
                ...commonOptions,
                cutout: '70%',
              }} 
              data={doughnutData}
            />
          </div>
        </Card>
        <Card title="Rendez-vous à venir">
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Patient {index + 1}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Consultation de routine</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">14:30</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 