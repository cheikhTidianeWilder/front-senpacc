import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaTint,
  FaInfinity,
  FaShoppingBasket,
  FaLightbulb,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';

// Interface pour typer les données des patients

interface User {
  prenom: string;
  nom: string;
  sexe: 'H' | 'F';
  adresse: string;
  telephone: string;
  date_nai:Date;
}

interface Patient {
  id: number;
  user_id: number;
  sang?: string;
  profession?: string;
  cartePatient?: string;
  allergie?: string;
  CNI?: string;
  tel_a_prevenir?: string;
  service_id: number;
  supprimer?: boolean;
  createdAt?: string;
  updatedAt?: string;

  user: User; // relation avec User
}


// Interface pour les statistiques
interface Stats {
  homme: number;
  femme: number;
  'A+': number;
  'A-': number;
  'B+': number;
  'B-': number;
  'AB+': number;
  'AB-': number;
  'O+': number;
  'O-': number;
}

const ExplorationPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    homme: 0,
    femme: 0,
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0,
    'O+': 0,
    'O-': 0
  });

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:3000/api/urologie';

  // Fonction pour récupérer le token depuis le localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fonction pour récupérer les patients depuis le backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      // Essayer plusieurs endpoints possibles
      const possibleEndpoints = [
        `${API_BASE_URL}/patients/all`,
      ];

      let response = null;
      let successfulEndpoint = '';

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Tentative avec l'endpoint: ${endpoint}`);

          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log(`Response status pour ${endpoint}:`, response.status);

          if (response.ok) {
            successfulEndpoint = endpoint;
            console.log(`✅ Endpoint fonctionnel trouvé: ${endpoint}`);
            break;
          }
        } catch (fetchError) {
          console.log(`❌ Erreur avec ${endpoint}:`, fetchError);
          continue;
        }
      }

      if (!response || !response.ok) {
        if (response?.status === 401) {
          throw new Error('Token expiré ou invalide. Veuillez vous reconnecter.');
        }
        if (response?.status === 404) {
          throw new Error('Aucun endpoint valide trouvé. Vérifiez la configuration de votre API.');
        }
        if (response?.status === 500) {
          throw new Error('Erreur serveur. Contactez l\'administrateur.');
        }
        throw new Error(`Tous les endpoints ont échoué. Dernier statut: ${response?.status || 'Réseau'}`);
      }

      const data = await response.json();
      console.log('Data received from', successfulEndpoint, ':', data);

      // Vérifier si les données sont dans le bon format
      let patientsArray: Patient[] = [];

      if (Array.isArray(data)) {
        patientsArray = data;
      } else if (data.patients && Array.isArray(data.patients)) {
        patientsArray = data.patients;
      } else if (data.data && Array.isArray(data.data)) {
        patientsArray = data.data;
      } else if (data.result && Array.isArray(data.result)) {
        patientsArray = data.result;
      } else {
        console.error('Format de données inattendu:', data);
        throw new Error('Format de données inattendu reçu du serveur');
      }

      setPatients(patientsArray);
      calculateStats(patientsArray);
      console.log(`✅ ${patientsArray.length} patients chargés avec succès depuis ${successfulEndpoint}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des patients';
      setError(errorMessage);
      console.error('Erreur lors du fetch des patients:', err);

      // Si l'erreur est liée à l'authentification, nettoyer le token
      if (errorMessage.includes('Token') || errorMessage.includes('401')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        // Optionnel: rediriger vers la page de connexion
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

 const calculateStats = (patientsData: Patient[]) => {
  const newStats: Stats = {
    homme: 0,
    femme: 0,
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0,
    'O+': 0,
    'O-': 0
  };

  patientsData.forEach(patient => {
    // Compter par sexe
    if (patient.user?.sexe === 'H') {
      newStats.homme++;
    } else if (patient.user?.sexe === 'F') {
      newStats.femme++;
    }

    // Compter par groupe sanguin
    if (patient.sang && newStats.hasOwnProperty(patient.sang)) {
      newStats[patient.sang as keyof Stats]++;
    }
  });

  setStats(newStats);
  console.log('Statistiques calculées:', newStats);
};

  // Fonction pour supprimer un patient
  const deletePatient = async (patientId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Essayer plusieurs endpoints pour la suppression
      const deleteEndpoints = [
        `${API_BASE_URL}/patients/${patientId}`,
        `${API_BASE_URL}/patient/${patientId}`,
        `http://localhost:3000/api/patients/${patientId}`
      ];

      let response = null;
      for (const endpoint of deleteEndpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            console.log(`✅ Patient supprimé via ${endpoint}`);
            break;
          }
        } catch (deleteError) {
          console.log(`❌ Erreur suppression avec ${endpoint}:`, deleteError);
          continue;
        }
      }

      if (!response || !response.ok) {
        if (response?.status === 401) {
          throw new Error('Token expiré ou invalide. Veuillez vous reconnecter.');
        }
        throw new Error(`Erreur lors de la suppression: ${response?.status || 'Réseau'}`);
      }

      // Actualiser la liste après suppression
      await fetchPatients();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);

      // Si l'erreur est liée à l'authentification
      if (errorMessage.includes('Token')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }

      console.error('Erreur lors de la suppression:', err);
    }
  };

  // Effet pour charger les patients au montage du composant
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fonction StatCard
  const StatCard = ({ icon: Icon, bgColor, title1, count1, title2, count2 }: {
    icon: React.ComponentType<any>;
    bgColor: string;
    title1: string;
    count1: number;
    title2: string;
    count2: number;
  }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`${bgColor} h-20 flex items-center justify-center relative`}>
          <Icon className="text-white text-3xl" />
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{count1}</div>
            <div className="text-sm text-gray-600 uppercase">{title1}</div>
          </div>
          <div className="text-center border-l border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{count2}</div>
            <div className="text-sm text-gray-600 uppercase">{title2}</div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction handleAction
  const handleAction = async (action: string, patient: Patient) => {
    switch (action) {
      case 'view':
        console.log('Voir détails du patient:', patient);
        // window.location.href = `/patients/${patient.id}`;
        break;
      case 'edit':
        console.log('Modifier le patient:', patient);
        // window.location.href = `/patients/${patient.id}/edit`;
        break;
      case 'delete':
        await deletePatient(patient.id);
        break;
      default:
        console.log(`Action ${action} pour le patient:`, patient);
    }
  };

  // Filtrer les patients selon le terme de recherche
  const filteredPatients = patients.filter(patient =>
    patient.CNI?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.allergie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.createdAt?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Titre */}
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-semibold text-gray-800">Exploration Patients - Service Urologie</h1> */}
          {/* <button
            onClick={fetchPatients}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            Actualiser
          </button> */}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erreur:</strong> {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Message de debug (à supprimer en production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <strong>Debug:</strong> API Base URL: {API_BASE_URL} |
            Token: {getAuthToken() ? '✓ Présent' : '✗ Manquant'} |
            Patients chargés: {patients.length}
          </div>
        )} */}

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={FaUser}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            title1="HOMME"
            count1={stats.homme}
            title2="FEMME"
            count2={stats.femme}
          />
          <StatCard
            icon={FaTint}
            bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
            title1="A+"
            count1={stats['A+']}
            title2="A-"
            count2={stats['A-']}
          />
          <StatCard
            icon={FaInfinity}
            bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
            title1="B+"
            count1={stats['B+']}
            title2="B-"
            count2={stats['B-']}
          />
          <StatCard
            icon={FaTint}
            bgColor="bg-gradient-to-br from-red-400 to-red-500"
            title1="AB+"
            count1={stats['AB+']}
            title2="AB-"
            count2={stats['AB-']}
          />
          <StatCard
            icon={FaShoppingBasket}
            bgColor="bg-gradient-to-br from-indigo-600 to-indigo-700"
            title1="O+"
            count1={stats['O+']}
            title2="O-"
            count2={stats['O-']}
          />
        </div>

        {/* Barre de recherche et contrôles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, adresse ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Éléments par page :</span>
              <select
                value={elementsPerPage}
                onChange={(e) => setElementsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {filteredPatients.length} patient(s) trouvé(s) sur {patients.length} total
          </div>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
            <span className="text-gray-600">Recherche du bon endpoint...</span>
          </div>
        )}

        {/* Tableau des patients */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carte Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profession</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe Sanguin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.slice(0, elementsPerPage).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.prenom || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.nom || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.user?.sexe === 'H' ? 'bg-blue-100 text-blue-800' :
                            patient.user?.sexe === 'F' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {patient.user?.sexe === 'H' ? 'Homme' : patient.user?.sexe === 'F' ? 'Femme' : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.adresse || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.telephone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.cartePatient || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.CNI || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.profession || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.sang?.includes('O') ? 'bg-red-100 text-red-800' :
                            patient.sang?.includes('A') ? 'bg-blue-100 text-blue-800' :
                              patient.sang?.includes('B') ? 'bg-orange-100 text-orange-800' :
                                'bg-purple-100 text-purple-800'
                          }`}>
                          {patient.sang || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.tel_a_prevenir || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('view', patient)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <FaLightbulb className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleAction('edit', patient)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleAction('delete', patient)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message si aucun résultat */}
        {!loading && filteredPatients.length === 0 && patients.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun patient trouvé pour "{searchTerm}"
          </div>
        )}

        {/* Message si aucun patient dans la base */}
        {!loading && patients.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            Aucun patient enregistré dans la base de données
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationPatients; 