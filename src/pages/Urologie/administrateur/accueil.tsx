import React, { useState } from 'react';
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
import {
  QrCode,
  UserPlus,
  Users,
  Stethoscope,
  Shield,
  Activity,
  Settings,
  TrendingUp,
  Eye,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';

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

const AdminAccueil: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Options communes pour les graphiques - optimisées pour admin
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 11,
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
            size: 11,
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
            size: 11,
            weight: 'normal' as const,
          },
        },
      },
    },
  };

  // Données pour les graphiques d'administration
  const qrCodeUsageData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'QR Codes Patients',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
      {
        label: 'QR Codes Médecins',
        data: [8, 12, 10, 15, 13, 18],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const staffDistributionData = {
    labels: ['Urologues', 'Résidents', 'Infirmiers', 'Administratifs'],
    datasets: [
      {
        data: [12, 8, 25, 6],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const performanceData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
    datasets: [
      {
        label: 'Efficacité QR Codes (%)',
        data: [85, 92, 88, 95, 90],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  // Actions rapides pour l'administrateur
  const quickActions = [
    {
      title: 'Générer QR Code Patient',
      description: 'Créer un QR code pour un nouveau patient',
      icon: QrCode,
      color: 'bg-emerald-500',
      action: () => console.log('Générer QR Patient'),
      badge: 'Nouveau'
    },
    {
      title: 'Générer QR Code Médecin',
      description: 'Créer un QR code pour un médecin',
      icon: Stethoscope,
      color: 'bg-blue-500',
      action: () => console.log('Générer QR Médecin')
    },
    {
      title: 'Inscrire Médecin',
      description: 'Ajouter un nouveau médecin au service',
      icon: UserPlus,
      color: 'bg-purple-500',
      action: () => console.log('Inscrire Médecin')
    },
    {
      title: 'Gérer Permissions',
      description: 'Configurer les accès et permissions',
      icon: Shield,
      color: 'bg-orange-500',
      action: () => console.log('Gérer Permissions')
    }
  ];

  // Liste des QR codes récents
  const recentQRCodes = [
    {
      id: 'QR001',
      type: 'Patient',
      name: 'Amadou Diallo',
      generatedAt: '2024-06-24 09:30',
      status: 'Actif',
      uses: 5
    },
    {
      id: 'QR002',
      type: 'Médecin',
      name: 'Dr. Fatou Sow',
      generatedAt: '2024-06-23 14:15',
      status: 'Actif',
      uses: 12
    },
    {
      id: 'QR003',
      type: 'Patient',
      name: 'Ousmane Ba',
      generatedAt: '2024-06-23 11:20',
      status: 'Expiré',
      uses: 3
    },
    {
      id: 'QR004',
      type: 'Patient',
      name: 'Awa Ndiaye',
      generatedAt: '2024-06-22 16:45',
      status: 'Actif',
      uses: 8
    }
  ];

  // Statistiques pour l'admin
  const adminStats = [
    {
      title: 'QR Codes Générés',
      value: '247',
      change: '+15%',
      changeType: 'increase',
      icon: QrCode,
      color: 'text-emerald-600'
    },
    {
      title: 'Médecins Inscrits',
      value: '18',
      change: '+2',
      changeType: 'increase',
      icon: Stethoscope,
      color: 'text-blue-600'
    },
    {
      title: 'Patients Actifs',
      value: '163',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Taux d\'Utilisation',
      value: '92%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Administrateur */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Administration Urologie</h1>
                  <p className="text-blue-100 text-lg">Gestion des QR Codes & Personnel</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-blue-100 mb-1">Connecté en tant que</p>
                <p className="font-semibold text-lg">Administrateur Principal - Dr. Kane</p>
                <p className="text-blue-200 text-sm">Service d'Urologie • SENPACC</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
                <p className="text-blue-200">Dernière connexion: 09:45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques Administrateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  stat.color.includes('emerald') ? 'from-emerald-400 to-emerald-600' :
                  stat.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                  stat.color.includes('purple') ? 'from-purple-400 to-purple-600' :
                  'from-orange-400 to-orange-600'
                }`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Actions Rapides */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Actions Rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left"
              >
                {action.badge && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {action.badge}
                  </span>
                )}
                
                <div className={`${action.color} p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Section des graphiques et QR codes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Graphique utilisation QR Codes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-emerald-500" />
              Utilisation des QR Codes
            </h3>
            <div className="h-64">
              <Line options={commonOptions} data={qrCodeUsageData} />
            </div>
          </div>

          {/* Répartition du personnel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Répartition du Personnel
            </h3>
            <div className="h-64">
              <Doughnut 
                options={{
                  ...commonOptions,
                  cutout: '60%',
                }} 
                data={staffDistributionData}
              />
            </div>
          </div>
        </div>

        {/* QR Codes récents et Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des QR Codes récents */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-purple-500" />
                QR Codes Récents
              </h3>
              <div className="flex gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau QR
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nom</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Généré le</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Statut</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Utilisations</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentQRCodes.map((qr, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{qr.id}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          qr.type === 'Patient' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {qr.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{qr.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{qr.generatedAt}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          qr.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {qr.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{qr.uses}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="bg-blue-100 hover:bg-blue-200 p-1 rounded text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="bg-green-100 hover:bg-green-200 p-1 rounded text-green-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Performance
            </h3>
            <div className="h-48 mb-6">
              <Bar options={commonOptions} data={performanceData} />
            </div>
            
            {/* Alertes et notifications */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-3">Alertes Récentes</h4>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">QR Code expiré:</span> 3 codes patients nécessitent un renouvellement
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Nouveau médecin:</span> Dr. Sow a été ajouté avec succès
                </p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Utilisation élevée:</span> 92% d'efficacité cette semaine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccueil;