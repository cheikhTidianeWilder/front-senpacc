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
  FaSpinner,
  FaLock,
  FaUserMd,
  FaShieldAlt
} from 'react-icons/fa';

// Interface pour typer les données des patients
interface User {
  id: number;
  prenom: string;
  nom: string;
  sexe: 'Homme' | 'Femme';
  adresse: string;
  tel: string;
  date_nai: Date;
  email?: string;
  photo?: string;
  role?: string;
  statut?: string;
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
  user: User;
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

// Interface pour les infos du médecin connecté
interface MedecinInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  service?: string;
  service_id?: number;
  structure?: string;
  structure_id?: number;
  specialite?: string;
  isChef?: boolean;
  isAdmin?: boolean;
}

const ExplorationPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [medecinInfo, setMedecinInfo] = useState<MedecinInfo | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
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
  const API_BASE_URL = 'http://localhost:3000/api/urologie/patients/all';
  const AUTH_API_URL = 'http://localhost:3000/api/auth';

  // Fonction pour récupérer le token depuis le localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fonction pour vérifier les informations du médecin connecté
  const fetchMedecinInfo = async () => {
    try {
      setLoadingAuth(true);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('🔑 Aucun token d\'authentification trouvé');
        setAccessDenied(true);
        return;
      }

      console.log('🔍 Vérification des permissions du médecin...');
      
      const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📡 Réponse auth/me: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données médecin reçues:', data);

        if (data.success && data.user) {
          const userInfo: MedecinInfo = {
            id: data.user.id,
            nom: data.user.nom,
            prenom: data.user.prenom,
            email: data.user.email,
            role: data.user.role,
          };

          // Ajouter les infos médecin si disponibles
          if (data.medecin) {
            userInfo.service = data.medecin.service?.nom;
            userInfo.service_id = data.medecin.service?.id;
            userInfo.structure = data.medecin.structure?.nom;
            userInfo.structure_id = data.medecin.structure?.id;
            userInfo.specialite = data.medecin.specialite;
            userInfo.isChef = data.medecin.isChef;
            userInfo.isAdmin = data.medecin.isAdmin;
          }

          setMedecinInfo(userInfo);

          // Vérifier les permissions d'accès
          const hasAccess = checkAccessPermissions(userInfo);
          
          if (!hasAccess) {
            console.warn('⚠️ Accès refusé - Permissions insuffisantes');
            setAccessDenied(true);
            return;
          }

          console.log('✅ Permissions validées pour le service d\'urologie');
          
        } else {
          console.warn('⚠️ Format de données inattendu:', data);
          setAccessDenied(true);
        }
        
      } else if (response.status === 401) {
        console.warn('⚠️ Token expiré ou invalide');
        clearAuthData();
        setAccessDenied(true);
        
      } else {
        console.error('❌ Erreur API:', response.status);
        setAccessDenied(true);
      }

    } catch (error) {
      console.error('🚨 Erreur lors de la vérification des permissions:', error);
      setAccessDenied(true);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Fonction pour vérifier les permissions d'accès
  const checkAccessPermissions = (userInfo: MedecinInfo): boolean => {
    console.log('🔐 Vérification des permissions pour:', userInfo);

    // Vérifier si l'utilisateur est un médecin
    const isMedecin = userInfo.role === 'Medecin' || 
                     userInfo.role === 'Urologue' || 
                     userInfo.role?.toLowerCase().includes('medecin');
    
    if (!isMedecin) {
      console.log('❌ Accès refusé: Utilisateur n\'est pas médecin');
      return false;
    }

    // Vérifier si le médecin appartient au service d'urologie
    const isUrologueService = userInfo.service?.toLowerCase().includes('urologie') ||
                             userInfo.specialite?.toLowerCase().includes('urologie') ||
                             userInfo.role === 'Urologue';

    // Vérifier si c'est un admin ou chef de service (accès élargi)
    const hasAdminAccess = userInfo.isAdmin || userInfo.isChef;

    if (isUrologueService || hasAdminAccess) {
      console.log('✅ Accès autorisé:', {
        service: userInfo.service,
        specialite: userInfo.specialite,
        isAdmin: userInfo.isAdmin,
        isChef: userInfo.isChef
      });
      return true;
    }

    console.log('❌ Accès refusé: Médecin non autorisé pour l\'urologie', {
      service: userInfo.service,
      specialite: userInfo.specialite,
      role: userInfo.role
    });
    return false;
  };

  // Fonction pour nettoyer les données d'authentification
  const clearAuthData = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userInfoProcessed');
    localStorage.removeItem('refreshToken');
    console.log('🧹 Données d\'authentification nettoyées');
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

      // Vérifier d'abord les permissions avant de charger les patients
      if (!medecinInfo) {
        console.log('⚠️ Informations médecin non disponibles, vérification en cours...');
        await fetchMedecinInfo();
        return;
      }

      console.log('🔍 Chargement des patients du service d\'urologie...');

      // Essayer plusieurs endpoints possibles
      const possibleEndpoints = [
        `http://localhost:3000/api/urologie/patients/all`
      ];

      let response = null;
      let successfulEndpoint = '';

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔄 Tentative avec l'endpoint: ${endpoint}`);

          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log(`📡 Response status pour ${endpoint}: ${response.status}`);

          if (response.ok) {
            successfulEndpoint = endpoint;
            console.log(`✅ Endpoint fonctionnel trouvé: ${endpoint}`);
            break;
          } else if (response.status === 403) {
            // Accès refusé - permissions insuffisantes
            console.warn('🚫 Accès refusé par le serveur');
            setAccessDenied(true);
            setLoading(false);
            return;
          }
        } catch (fetchError) {
          console.log(`❌ Erreur avec ${endpoint}:`, fetchError);
          continue;
        }
      }

      if (!response || !response.ok) {
        if (response?.status === 401) {
          console.warn('⚠️ Token expiré');
          clearAuthData();
          throw new Error('Token expiré ou invalide. Veuillez vous reconnecter.');
        }
        if (response?.status === 403) {
          console.warn('🚫 Permissions insuffisantes');
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        // if (response?.status === 404) {
        //   throw new Error('Aucun endpoint valide trouvé. Vérifiez la configuration de votre API.');
        // }
        if (response?.status === 500) {
          throw new Error('Erreur serveur. Contactez l\'administrateur.');
        }
        throw new Error(`Tous les endpoints ont échoué. Dernier statut: ${response?.status || 'Réseau'}`);
      }

      const data = await response.json();
      console.log('📋 Data received from', successfulEndpoint, ':', data);

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
      } else if (data.error && (data.error.includes('permission') || data.error.includes('autorisé'))) {
        // Vérifier si l'erreur indique un problème de permissions
        console.warn('🚫 Erreur de permissions détectée:', data.error);
        setAccessDenied(true);
        setLoading(false);
        return;
      } else {
        console.error('❌ Format de données inattendu:', data);
        throw new Error('Format de données inattendu reçu du serveur');
      }

      setPatients(patientsArray);
      calculateStats(patientsArray);
      console.log(`✅ ${patientsArray.length} patients chargés avec succès depuis ${successfulEndpoint}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des patients';
      
      // Vérifier si l'erreur indique un problème d'autorisation
      if (errorMessage.includes('permission') || 
          errorMessage.includes('autorisé') || 
          errorMessage.includes('accès refusé') ||
          errorMessage.includes('Forbidden')) {
        console.warn('🚫 Erreur de permissions:', errorMessage);
        setAccessDenied(true);
      } else {
        setError(errorMessage);
        
        // Si l'erreur est liée à l'authentification, nettoyer le token
        if (errorMessage.includes('Token') || errorMessage.includes('401')) {
          clearAuthData();
        }
      }
      
      console.error('🚨 Erreur lors du fetch des patients:', err);
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
      if (patient.user?.sexe === 'Homme') {
        newStats.homme++;
      } else if (patient.user?.sexe === 'Femme') {
        newStats.femme++;
      }

      // Compter par groupe sanguin
      if (patient.sang && newStats.hasOwnProperty(patient.sang)) {
        newStats[patient.sang as keyof Stats]++;
      }
    });

    setStats(newStats);
    console.log('📊 Statistiques calculées:', newStats);
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
        // `${API_BASE_URL}/patients/${patientId}`,
        `http://localhost:3000/api/urologie/patients/${patientId}/delete`
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
          } else if (response.status === 403) {
            throw new Error('Vous n\'avez pas les permissions pour supprimer ce patient.');
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
        if (response?.status === 403) {
          throw new Error('Vous n\'avez pas les permissions pour supprimer ce patient.');
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
        clearAuthData();
      }

      console.error('🚨 Erreur lors de la suppression:', err);
    }
  };

  // Effet pour charger les infos médecin et vérifier les permissions au montage
  useEffect(() => {
    fetchMedecinInfo();
  }, []);

  // Effet pour charger les patients une fois les permissions validées
  useEffect(() => {
    if (medecinInfo && !accessDenied && !loadingAuth) {
      fetchPatients();
    }
  }, [medecinInfo, accessDenied, loadingAuth]);

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
const handleAction = async (action: string, patient: Patient) => {
  switch (action) {
    case 'view':
      try {
        // Envoyer l'ID du patient à stocker en session backend
        const response = await fetch(`http://localhost:3000/api/urologie/session/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 🔐 Important pour transmettre les cookies de session
          body: JSON.stringify({ id: patient.id }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.msg || 'Erreur lors de la mise en session');
        }

        console.log('✅ Patient stocké en session');

        // Redirection vers la page d'informations
        window.location.href = 'infos';
      } catch (error) {
        console.error('❌ Erreur session patient:', error);
        alert("Erreur lors de la sélection du patient.");
      }
      break;

    case 'edit':
      console.log('Modifier le patient:', patient);
      window.location.href = `/patients/${patient.id}/edit`;
      break;

    case 'delete':
      await deletePatient(patient.id);
      break;

    default:
      console.log(`Action ${action} pour le patient:`, patient);
  }
};



  // Filtrer les patients selon le terme de recherche
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.user?.nom?.toLowerCase().includes(searchLower) ||
      patient.user?.prenom?.toLowerCase().includes(searchLower) ||
      patient.user?.adresse?.toLowerCase().includes(searchLower) ||
      patient.user?.tel?.toLowerCase().includes(searchLower) ||
      patient.CNI?.toLowerCase().includes(searchLower) ||
      patient.profession?.toLowerCase().includes(searchLower) ||
      patient.allergie?.toLowerCase().includes(searchLower) ||
      patient.cartePatient?.toLowerCase().includes(searchLower)
    );
  });

  // Composant pour l'affichage de l'accès refusé
  const AccessDeniedComponent = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <FaLock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à la liste des patients du service d'urologie.
            </p>
          </div>
          
          {/* Informations sur le médecin connecté */}
          {medecinInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <FaUserMd className="text-blue-600 mr-2 h-5 w-5" />
                <span className="font-medium text-blue-900">Médecin connecté</span>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Dr. {medecinInfo.prenom} {medecinInfo.nom}</strong></p>
                <p>Rôle: {medecinInfo.role}</p>
                {medecinInfo.service && <p>Service: {medecinInfo.service}</p>}
                {medecinInfo.specialite && <p>Spécialité: {medecinInfo.specialite}</p>}
                {medecinInfo.structure && <p>Structure: {medecinInfo.structure}</p>}
              </div>
            </div>
          )}
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <FaShieldAlt className="text-red-500 mr-2 h-4 w-4" />
              <span className="font-medium text-red-800">Permissions requises</span>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <p>Pour accéder à ces données, vous devez être :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Médecin du service d'urologie</li>
                <li>Urologue spécialisé</li>
                <li>Chef de service (toute spécialité)</li>
                <li>Administrateur médical</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setAccessDenied(false);
                setMedecinInfo(null);
                fetchMedecinInfo();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Revérifier les permissions
            </button>
            
            <button
              onClick={() => {
                clearAuthData();
                window.location.href = '/login';
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Se reconnecter
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Retour
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur système.</p>
            <p className="mt-1">Code d'erreur: UROLOGIE_ACCESS_DENIED</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant de chargement initial
  const LoadingComponent = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Vérification des permissions...</h2>
        <p className="text-gray-500">Validation de votre accès au service d'urologie</p>
      </div>
    </div>
  );

  // Affichage de chargement initial
  if (loadingAuth) {
    return <LoadingComponent />;
  }

  // Si l'accès est refusé, afficher le composant approprié
  if (accessDenied) {
    return <AccessDeniedComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec infos médecin */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Exploration Patients
              </h1>
              {/* {medecinInfo && (
                <p className="text-sm text-gray-600 mt-1">
                  Connecté en tant que: <strong>Dr. {medecinInfo.prenom} {medecinInfo.nom}</strong>
                  {medecinInfo.service && ` • ${medecinInfo.service}`}
                  {medecinInfo.specialite && ` • ${medecinInfo.specialite}`}
                </p>
              )} */}
            </div>
            {/* <button
              onClick={fetchPatients}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : null}
              Actualiser
            </button> */}
          </div>
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
            <span className="text-gray-600">Chargement des patients...</span>
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
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carte Patient</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNI</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profession</th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe Sanguin</th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgence</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.slice(0, elementsPerPage).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.prenom || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.nom || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.user?.sexe === 'Homme' ? 'bg-blue-100 text-blue-800' :
                          patient.user?.sexe === 'Femme' ? 'bg-pink-100 text-pink-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.user?.sexe || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.adresse || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.user?.tel || 'N/A'}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">{patient.cartePatient || 'N/A'}</td> */}
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.CNI || 'N/A'}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">{patient.profession || 'N/A'}</td> */}
                      {/* <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.sang?.includes('O') ? 'bg-red-100 text-red-800' :
                          patient.sang?.includes('A') ? 'bg-blue-100 text-blue-800' :
                          patient.sang?.includes('B') ? 'bg-orange-100 text-orange-800' :
                          patient.sang?.includes('AB') ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.sang || 'N/A'}
                        </span>
                      </td> */}
                      {/* <td className="px-6 py-4 text-sm text-gray-900">{patient.tel_a_prevenir || 'N/A'}</td> */}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('view', patient)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="Consulter"
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

        {/* Message si aucun résultat de recherche */}
        {!loading && filteredPatients.length === 0 && patients.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
                <FaSearch className="h-8 w-8 text-orange-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              
              <p className="text-gray-600 mb-6">
                Aucun patient ne correspond à votre recherche "{searchTerm}"
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-yellow-800">
                  <p><strong>Suggestion :</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                    <li>Vérifiez l'orthographe des termes de recherche</li>
                    <li>Utilisez des termes plus généraux</li>
                    <li>Recherchez par nom, prénom, adresse ou téléphone</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Effacer la recherche
                </button>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchPatients();
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Voir tous les patients
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Total de {patients.length} patient(s) dans le service d'urologie</p>
              </div>
            </div>
          </div>
        )}

        {/* Message si aucun patient dans la base */}
        {!loading && patients.length === 0 && !error && (
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl shadow-lg border border-blue-100 p-8">
            <div className="text-center">
              {/* Icône principale avec animation */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaUser className="h-10 w-10 text-white animate-pulse" />
              </div>
              
              {/* Titre avec dégradé */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Aucun patient enregistré
              </h3>
              
              {/* Description */}
              <p className="text-gray-700 mb-8 text-lg">
                Vous n'avez pas encore inscrit de patient dans le service d'urologie.
              </p>

              {/* Informations du médecin - Version colorée */}
              {medecinInfo && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 mb-8 max-w-md mx-auto shadow-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-emerald-500 rounded-full p-2 mr-3">
                      <FaUserMd className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-emerald-800 text-lg">Service actuel</span>
                  </div>
                  <div className="text-emerald-700 space-y-1">
                    <p className="text-lg font-semibold text-emerald-900">
                      Dr. {medecinInfo.prenom} {medecinInfo.nom}
                    </p>
                    {medecinInfo.service && (
                      <p className="flex items-center justify-center">
                        <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                          Service: {medecinInfo.service}
                        </span>
                      </p>
                    )}
                    {medecinInfo.specialite && (
                      <p className="flex items-center justify-center">
                        <span className="bg-teal-200 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                          Spécialité: {medecinInfo.specialite}
                        </span>
                      </p>
                    )}
                    {medecinInfo.structure && (
                      <p className="flex items-center justify-center">
                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          Structure: {medecinInfo.structure}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons d'action colorés */}
              <div className="space-y-4 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    // Rediriger vers la page d'ajout de patient
                    window.location.href = '/urologie/insPatient';
                  }}
                  className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                    <FaUser className="h-5 w-5" />
                  </div>
                  Inscrire un nouveau patient
                </button>
              </div>

              {/* Messages d'information avec couleurs */}
              <div className="mt-8 space-y-3">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-4 max-w-lg mx-auto">
                  <div className="flex items-start">
                    <div className="bg-amber-400 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-amber-800">
                      <p className="font-semibold text-sm">Pour commencer</p>
                      <p className="text-sm">Inscrivez votre premier patient dans le service d'urologie.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-4 max-w-lg mx-auto">
                  <div className="flex items-start">
                    <div className="bg-green-400 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-green-800">
                      <p className="font-semibold text-sm">Automatique</p>
                      <p className="text-sm">Les patients inscrits apparaîtront automatiquement dans cette liste.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Décoration supplémentaire */}
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationPatients;