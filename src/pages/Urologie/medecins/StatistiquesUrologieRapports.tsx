import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Activity,
  Calendar,
  Heart,
  Stethoscope,
  BarChart3,
  Clock,
  User,
  AlertCircle,
  Droplet,
  RefreshCw,
} from "lucide-react";

// Configuration API pour sessions
const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  STATISTICS: '/api/urologie/statistiques/statistics',
  EXPORT: '/api/urologie/statistiques/export',
  PERFORMANCE: '/api/urologie/statistiques/performance'
};

interface StatsData {
  totalPatients: number;
  totalConsultations: number;
  totalAntecedents: number;
  consultationsToday: number;
  consultationsThisMonth: number;
  patientsByService: Array<{service: string, count: number}>;
  consultationsByMonth: Array<{month: string, count: number}>;
  antecedentsByType: Array<{type: string, count: number}>;
  groupesSanguins: Array<{groupe: string, count: number}>;
  diagnosticsFrequents: Array<{diagnostic: string, count: number}>;
  recentPatients: Array<{id: number, nom: string, prenom: string, dateCreation: string}>;
  recentConsultations: Array<{id: number, patient: string, datecons: string, diagnostic: string}>;
}

const MedecinDashboard = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  // Fonction pour créer les options de fetch avec sessions
  const createFetchOptions = (method: string = 'GET', body?: any): RequestInit => {
    const options: RequestInit = {
      method,
      credentials: 'include', // IMPORTANT: Pour envoyer les cookies de session
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  };

  const fetchStatistics = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.STATISTICS}?period=${selectedPeriod}`;
      
      const response = await fetch(url, createFetchOptions());

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Erreur HTTP ${response.status}` };
        }

        // Gestion spécifique des erreurs de session
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        } else if (response.status === 400 && errorData.error === 'MEDECIN_ID_MISSING') {
          throw new Error("Session invalide. Vérifiez votre connexion médecin.");
        }

        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setStatsData(data);
      setMessage({
        type: 'success',
        text: "Statistiques mises à jour avec succès"
      });

    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Erreur lors du chargement des statistiques"
      });
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportStatistics = async () => {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.EXPORT}`;

      const response = await fetch(url, createFetchOptions('POST'));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'export');
      }

      // Vérifier si la réponse contient un blob (PDF) ou du JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/pdf')) {
        // Si c'est un PDF, le télécharger
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistiques-medecin-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage({
          type: 'success',
          text: "Statistiques exportées avec succès"
        });
      } else {
        // Si c'est du JSON (placeholder response)
        const data = await response.json();
        setMessage({
          type: 'success',
          text: data.message || "Export initié avec succès"
        });
      }

    } catch (error) {
      console.error('Erreur export:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Erreur lors de l'export des statistiques"
      });
    }
  };

  // Composant d'erreur quand les données ne sont pas disponibles
  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Données non disponibles</h2>
        <p className="text-gray-600 mb-6">
          Impossible de charger les statistiques. Vérifiez votre connexion et réessayez.
        </p>
        
        <button
          onClick={fetchStatistics}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-lg font-medium text-gray-700">Chargement des statistiques...</span>
        </div>
      </div>
    );
  }

  // Si pas de données et qu'il y a une erreur, afficher l'état d'erreur
  if (!statsData && message?.type === 'error') {
    return <ErrorState />;
  }

  // Si pas de données mais pas d'erreur (cas improbable), afficher un message générique
  if (!statsData) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord</h1>
            {/* <p className="text-gray-600">Inventaire et statistiques de votre activité médicale</p> */}
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            {/* <button
              onClick={exportStatistics}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button> */}
            {/* <button
              onClick={fetchStatistics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button> */}
          </div>
        </div>

        {/* Messages */}
        {/* {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )} */}

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalPatients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Consultations</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalConsultations}</p>
              </div>
              <Stethoscope className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Consultations Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.consultationsToday}</p>
              </div>
              <Calendar className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Antécédents</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalAntecedents}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique des consultations par mois */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Consultations par Mois</h3>
            </div>
            {statsData.consultationsByMonth.length > 0 ? (
              <div className="space-y-4">
                {statsData.consultationsByMonth.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-medium text-gray-600">{item.month}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / Math.max(...statsData.consultationsByMonth.map(m => m.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm font-bold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée de consultation disponible</p>
            )}
          </div>

          {/* Groupes sanguins */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Droplet className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">Répartition Groupes Sanguins</h3>
            </div>
            {statsData.groupesSanguins.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {statsData.groupesSanguins.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{item.groupe}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée de groupe sanguin disponible</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Antécédents par type */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-800">Antécédents par Type</h3>
            </div>
            {statsData.antecedentsByType.length > 0 ? (
              <div className="space-y-4">
                {statsData.antecedentsByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{item.type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${(item.count / Math.max(...statsData.antecedentsByType.map(a => a.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun antécédent enregistré</p>
            )}
          </div>

          {/* Diagnostics fréquents */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-800">Diagnostics Fréquents</h3>
            </div>
            {statsData.diagnosticsFrequents.length > 0 ? (
              <div className="space-y-3">
                {statsData.diagnosticsFrequents.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-gray-700">{item.diagnostic}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun diagnostic enregistré</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patients récents */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Patients Récents</h3>
            </div>
            {statsData.recentPatients.length > 0 ? (
              <div className="space-y-3">
                {statsData.recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">{patient.nom} {patient.prenom}</p>
                      <p className="text-sm text-gray-500">Créé le {new Date(patient.dateCreation).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      ID: {patient.id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun patient récent</p>
            )}
          </div>

          {/* Consultations récentes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Consultations Récentes</h3>
            </div>
            {statsData.recentConsultations.length > 0 ? (
              <div className="space-y-3">
                {statsData.recentConsultations.map((consultation, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-800">{consultation.patient}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(consultation.datecons).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{consultation.diagnostic}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune consultation récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecinDashboard;