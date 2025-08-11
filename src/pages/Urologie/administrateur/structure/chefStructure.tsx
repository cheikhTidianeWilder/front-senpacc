import React, { useState, useEffect } from 'react';
import {
  FaUserMd,
  FaHospital,
  FaUserTie,
  FaShieldAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaLock,
  FaExclamationTriangle,
  FaLightbulb,
  FaCrown,
  FaStethoscope,
  FaBuilding
} from 'react-icons/fa';

// Interface pour typer les données des utilisateurs
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

// Interface pour les services
interface Service {
  id: number;
  nom: string;
  description?: string;
}

// Interface pour les structures
interface Structure {
  id: number;
  nom: string;
  adresse?: string;
  type?: string;
}

// Interface pour les chefs de service
interface ChefService {
  id: number;
  user_id: number;
  structure_id: number;
  service_id: number;
  profil: string;
  isChef: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
  user: User;
  service: Service;
  structure: Structure;
}

// Interface pour les statistiques
interface Stats {
  totalChefs: number;
  chefsParStructure: { [key: string]: number };
  chefsParService: { [key: string]: number };
  chefsAdmins: number;
  chefsHommes: number;
  chefsFemmes: number;
}

// Interface pour les infos du médecin connecté
interface MedecinInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role:  string;
  service?: string;
  service_id?: number;
  structure?: string;
  structure_id?: number;
  specialite?: string;
  isChef?: boolean;
  isAdmin?: boolean;
}

const ExplorationChefsServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [chefsServices, setChefsServices] = useState<ChefService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [medecinInfo, setMedecinInfo] = useState<MedecinInfo | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [filterStructure, setFilterStructure] = useState('');
  const [filterService, setFilterService] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalChefs: 0,
    chefsParStructure: {},
    chefsParService: {},
    chefsAdmins: 0,
    chefsHommes: 0,
    chefsFemmes: 0
  });

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:3000/api/urologie/structures';
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

          console.log('Permissions validées pour la gestion des chefs de services');
          
        } else {
          console.warn('Format de données inattendu:', data);
          setAccessDenied(true);
        }
        
      } else if (response.status === 401) {
        console.warn('Token expiré ou invalide');
        clearAuthData();
        setAccessDenied(true);
        
      } else {
        console.error('Erreur API:', response.status);
        setAccessDenied(true);
      }

    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
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
                     userInfo.role?.toLowerCase().includes('medecin') ||
                     userInfo.role === 'ADMIN';
    
    if (!isMedecin) {
      console.log('Accès refusé: Utilisateur n\'est pas médecin');
      return false;
    }

    // Vérifier si c'est un admin ou chef de service (accès élargi)
    const hasAdminAccess = userInfo.isAdmin || userInfo.isChef || userInfo.role === 'ADMIN';

    if (hasAdminAccess) {
      console.log('Accès autorisé:', {
        service: userInfo.service,
        isAdmin: userInfo.isAdmin,
        isChef: userInfo.isChef,
        role: userInfo.role
      });
      return true;
    }

    console.log('Accès refusé: Permissions insuffisantes pour voir les chefs de services', {
      service: userInfo.service,
      isAdmin: userInfo.isAdmin,
      isChef: userInfo.isChef,
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

  // Fonction pour récupérer les chefs de services depuis le backend
  const fetchChefsServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      // Vérifier d'abord les permissions avant de charger les chefs
      if (!medecinInfo) {
        console.log('Informations médecin non disponibles, vérification en cours...');
        await fetchMedecinInfo();
        return;
      }

      console.log('🔍 Chargement des chefs de services...');

      // Essayer plusieurs endpoints possibles
      const possibleEndpoints = [
        `${API_BASE_URL}/chefs/all`,
        // `${API_BASE_URL}/chefs`,
        // `http://localhost:3000/api/medecins/chefs`
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
          console.log(`Erreur avec ${endpoint}:`, fetchError);
          continue;
        }
      }

      if (!response || !response.ok) {
        if (response?.status === 401) {
          console.warn('Token expiré');
          clearAuthData();
          throw new Error('Token expiré ou invalide. Veuillez vous reconnecter.');
        }
        if (response?.status === 403) {
          console.warn('Permissions insuffisantes');
          setAccessDenied(true);
          setLoading(false);
          return;
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
      console.log('📋 Data received from', successfulEndpoint, ':', data);

      // Vérifier si les données sont dans le bon format
      let chefsArray: ChefService[] = [];

      if (Array.isArray(data)) {
        chefsArray = data;
      } else if (data.chefs && Array.isArray(data.chefs)) {
        chefsArray = data.chefs;
      } else if (data.data && Array.isArray(data.data)) {
        chefsArray = data.data;
      } else if (data.result && Array.isArray(data.result)) {
        chefsArray = data.result;
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

      setChefsServices(chefsArray);
      calculateStats(chefsArray);
      console.log(`✅ ${chefsArray.length} chefs de services chargés avec succès depuis ${successfulEndpoint}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des chefs de services';
      
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
      
      console.error('🚨 Erreur lors du fetch des chefs de services:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (chefsData: ChefService[]) => {
    const newStats: Stats = {
      totalChefs: chefsData.length,
      chefsParStructure: {},
      chefsParService: {},
      chefsAdmins: 0,
      chefsHommes: 0,
      chefsFemmes: 0
    };

    chefsData.forEach(chef => {
      // Compter par sexe
      if (chef.user?.sexe === 'Homme') {
        newStats.chefsHommes++;
      } else if (chef.user?.sexe === 'Femme') {
        newStats.chefsFemmes++;
      }

      // Compter les admins
      if (chef.isAdmin) {
        newStats.chefsAdmins++;
      }

      // Compter par structure
      const structureName = chef.structure?.nom || 'Structure inconnue';
      newStats.chefsParStructure[structureName] = (newStats.chefsParStructure[structureName] || 0) + 1;

      // Compter par service
      const serviceName = chef.service?.nom || 'Service inconnu';
      newStats.chefsParService[serviceName] = (newStats.chefsParService[serviceName] || 0) + 1;
    });

    setStats(newStats);
    console.log('📊 Statistiques calculées:', newStats);
  };

  // Fonction pour promouvoir/révoquer un chef
  const toggleChefStatus = async (medecinId: number, isCurrentlyChef: boolean) => {
    const action = isCurrentlyChef ? 'revoquer' : 'promouvoir';
    const confirmMessage = isCurrentlyChef 
      ? 'Êtes-vous sûr de vouloir révoquer le statut de chef de ce médecin ?' 
      : 'Êtes-vous sûr de vouloir promouvoir ce médecin comme chef de service ?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const endpoint = `${API_BASE_URL}/medecin/${medecinId}/${action}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expiré ou invalide. Veuillez vous reconnecter.');
        }
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas les permissions pour cette action.');
        }
        throw new Error(`Erreur lors de l'action: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${action} réussi:`, result);

      // Actualiser la liste après modification
      await fetchChefsServices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification';
      setError(errorMessage);

      // Si l'erreur est liée à l'authentification
      if (errorMessage.includes('Token')) {
        clearAuthData();
      }

      console.error('🚨 Erreur lors de l\'action:', err);
    }
  };

  // Effet pour charger les infos médecin et vérifier les permissions au montage
  useEffect(() => {
    fetchMedecinInfo();
  }, []);

  // Effet pour charger les chefs une fois les permissions validées
  useEffect(() => {
    if (medecinInfo && !accessDenied && !loadingAuth) {
      fetchChefsServices();
    }
  }, [medecinInfo, accessDenied, loadingAuth]);

  // Fonction StatCard
  const StatCard = ({ icon: Icon, bgColor, title, count, subtitle }: {
    icon: React.ComponentType<any>;
    bgColor: string;
    title: string;
    count: number;
    subtitle?: string;
  }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`${bgColor} h-16 flex items-center justify-center relative`}>
          <Icon className="text-white text-2xl" />
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{count}</div>
          <div className="text-sm text-gray-600 uppercase">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
      </div>
    );
  };

  // Fonction handleAction
  const handleAction = async (action: string, chef: ChefService) => {
    switch (action) {
      case 'view':
        console.log('Voir détails du chef:', chef);
        // Implémenter la vue détaillée
        break;
      case 'edit':
        console.log('Modifier le chef:', chef);
        // Implémenter la modification
        break;
      case 'toggle_chef':
        await toggleChefStatus(chef.id, chef.isChef);
        break;
      default:
        console.log(`Action ${action} pour le chef:`, chef);
    }
  };

  // Filtrer les chefs selon les critères de recherche
  const filteredChefs = chefsServices.filter(chef => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      chef.user?.nom?.toLowerCase().includes(searchLower) ||
      chef.user?.prenom?.toLowerCase().includes(searchLower) ||
      chef.user?.email?.toLowerCase().includes(searchLower) ||
      chef.service?.nom?.toLowerCase().includes(searchLower) ||
      chef.structure?.nom?.toLowerCase().includes(searchLower) ||
      chef.profil?.toLowerCase().includes(searchLower)
    );

    const matchesStructure = !filterStructure || chef.structure?.nom === filterStructure;
    const matchesService = !filterService || chef.service?.nom === filterService;

    return matchesSearch && matchesStructure && matchesService;
  });

  // Obtenir les listes uniques pour les filtres
  const uniqueStructures = [...new Set(chefsServices.map(chef => chef.structure?.nom).filter(Boolean))];
  const uniqueServices = [...new Set(chefsServices.map(chef => chef.service?.nom).filter(Boolean))];

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
              Vous n'avez pas les permissions nécessaires pour accéder à la liste des chefs de services.
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
                <li>Administrateur médical</li>
                <li>Chef de service</li>
                <li>Directeur médical</li>
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
            <p className="mt-1">Code d'erreur: CHEFS_SERVICES_ACCESS_DENIED</p>
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
        <p className="text-gray-500">Validation de votre accès à la gestion des chefs de services</p>
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
                Gestion des Chefs de Services
              </h1>
              {medecinInfo && (
                <p className="text-sm text-gray-600 mt-1">
                  Connecté en tant que: <strong>Dr. {medecinInfo.prenom} {medecinInfo.nom}</strong>
                  {medecinInfo.service && ` • ${medecinInfo.service}`}
                  {medecinInfo.isAdmin && <span className="text-green-600 font-medium"> • Administrateur</span>}
                  {medecinInfo.isChef && <span className="text-blue-600 font-medium"> • Chef de Service</span>}
                </p>
              )}
            </div>
            <button
              onClick={fetchChefsServices}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : null}
              Actualiser
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaCrown}
            bgColor="bg-gradient-to-br from-yellow-500 to-yellow-600"
            title="Total Chefs"
            count={stats.totalChefs}
          />
          <StatCard
            icon={FaUsers}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            title="Hommes"
            count={stats.chefsHommes}
            subtitle="Chefs masculins"
          />
          <StatCard
            icon={FaUsers}
            bgColor="bg-gradient-to-br from-pink-500 to-pink-600"
            title="Femmes"
            count={stats.chefsFemmes}
            subtitle="Chefs féminins"
          />
          <StatCard
            icon={FaShieldAlt}
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
            title="Admins"
            count={stats.chefsAdmins}
            subtitle="Avec droits admin"
          />
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, prénom, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Structure</label>
              <select
                value={filterStructure}
                onChange={(e) => setFilterStructure(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les structures</option>
                {uniqueStructures.map(structure => (
                  <option key={structure} value={structure}>{structure}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les services</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Éléments par page</label>
              <select
                value={elementsPerPage}
                onChange={(e) => setElementsPerPage(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {filteredChefs.length} chef(s) trouvé(s) sur {chefsServices.length} total
          </div>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
            <span className="text-gray-600">Chargement des chefs de services...</span>
          </div>
        )}

        {/* Tableau des chefs de services */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom Complet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Structure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChefs.slice(0, elementsPerPage).map((chef) => (
                    <tr key={chef.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {chef.user?.photo ? (
                            <img
                              src={chef.user.photo}
                              alt={`${chef.user.prenom} ${chef.user.nom}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm">
                              {chef.user?.prenom?.charAt(0)}{chef.user?.nom?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">
                          Dr. {chef.user?.prenom || 'N/A'} {chef.user?.nom || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">{chef.user?.role}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{chef.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chef.user?.sexe === 'Homme' ? 'bg-blue-100 text-blue-800' :
                          chef.user?.sexe === 'Femme' ? 'bg-pink-100 text-pink-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {chef.user?.sexe || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaStethoscope className="text-green-500 mr-2" />
                          {chef.service?.nom || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaBuilding className="text-blue-500 mr-2" />
                          {chef.structure?.nom || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {chef.profil || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FaCrown className="text-yellow-500 mr-2" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              chef.isChef ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {chef.isChef ? 'Chef de Service' : 'Médecin'}
                            </span>
                          </div>
                          {chef.isAdmin && (
                            <div className="flex items-center">
                              <FaShieldAlt className="text-green-500 mr-2" />
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Administrateur
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('view', chef)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <FaLightbulb className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleAction('edit', chef)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          {/* Bouton pour promouvoir/révoquer le statut de chef */}
                          {medecinInfo?.isAdmin && (
                            <button
                              onClick={() => handleAction('toggle_chef', chef)}
                              className={`p-2 rounded-lg transition-colors ${
                                chef.isChef 
                                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                              title={chef.isChef ? 'Révoquer le statut de chef' : 'Promouvoir comme chef'}
                            >
                              <FaCrown className="text-sm" />
                            </button>
                          )}
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
        {!loading && filteredChefs.length === 0 && chefsServices.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
                <FaSearch className="h-8 w-8 text-orange-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              
              <p className="text-gray-600 mb-6">
                Aucun chef de service ne correspond à vos critères de recherche.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="text-sm text-yellow-800">
                  <p><strong>Filtres actifs :</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                    {searchTerm && <li>Recherche : "{searchTerm}"</li>}
                    {filterStructure && <li>Structure : {filterStructure}</li>}
                    {filterService && <li>Service : {filterService}</li>}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStructure('');
                    setFilterService('');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Effacer tous les filtres
                </button>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStructure('');
                    setFilterService('');
                    fetchChefsServices();
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Voir tous les chefs
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Total de {chefsServices.length} chef(s) de service(s) enregistré(s)</p>
              </div>
            </div>
          </div>
        )}

        {/* Message si aucun chef dans la base */}
        {!loading && chefsServices.length === 0 && !error && (
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl shadow-lg border border-blue-100 p-8">
            <div className="text-center">
              {/* Icône principale avec animation */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaCrown className="h-10 w-10 text-white animate-pulse" />
              </div>
              
              {/* Titre avec dégradé */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
                Aucun chef de service enregistré
              </h3>
              
              {/* Description */}
              <p className="text-gray-700 mb-8 text-lg">
                Il n'y a actuellement aucun médecin désigné comme chef de service dans le système.
              </p>

              {/* Informations du médecin - Version colorée */}
              {medecinInfo && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 mb-8 max-w-md mx-auto shadow-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-emerald-500 rounded-full p-2 mr-3">
                      <FaUserMd className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-emerald-800 text-lg">Utilisateur actuel</span>
                  </div>
                  <div className="text-emerald-700 space-y-1">
                    <p className="text-lg font-semibold text-emerald-900">
                      Dr. {medecinInfo.prenom} {medecinInfo.nom}
                    </p>
                    <p className="flex items-center justify-center">
                      <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                        Rôle: {medecinInfo.role}
                      </span>
                    </p>
                    {medecinInfo.service && (
                      <p className="flex items-center justify-center">
                        <span className="bg-teal-200 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                          Service: {medecinInfo.service}
                        </span>
                      </p>
                    )}
                    {medecinInfo.isAdmin && (
                      <p className="flex items-center justify-center">
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          Administrateur
                        </span>
                      </p>
                    )}
                    {medecinInfo.isChef && (
                      <p className="flex items-center justify-center">
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                          Chef de Service
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons d'action colorés */}
              <div className="space-y-4 max-w-sm mx-auto">
                {medecinInfo?.isAdmin && (
                  <button
                    onClick={() => {
                      // Rediriger vers la page de gestion des médecins
                      window.location.href = '/admin/medecins';
                    }}
                    className="group w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                      <FaCrown className="h-5 w-5" />
                    </div>
                    Nommer des chefs de service
                  </button>
                )}
                
                <button
                  onClick={fetchChefsServices}
                  className="group w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  <div className="bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                    {loading ? (
                      <FaSpinner className="animate-spin h-4 w-4" />
                    ) : (
                      <FaSearch className="h-4 w-4" />
                    )}
                  </div>
                  Actualiser la recherche
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
                      <p className="font-semibold text-sm">Information</p>
                      <p className="text-sm">Les chefs de service peuvent être nommés via le module d'administration.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg p-4 max-w-lg mx-auto">
                  <div className="flex items-start">
                    <div className="bg-blue-400 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-blue-800">
                      <p className="font-semibold text-sm">Automatique</p>
                      <p className="text-sm">Les nouveaux chefs nommés apparaîtront automatiquement dans cette liste.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Décoration supplémentaire */}
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Affichage des statistiques détaillées */}
        {!loading && chefsServices.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Statistiques par structure */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaBuilding className="text-blue-500 mr-2" />
                Chefs par Structure
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.chefsParStructure).map(([structure, count]) => (
                  <div key={structure} className="flex justify-between items-center">
                    <span className="text-gray-700">{structure}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques par service */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaStethoscope className="text-green-500 mr-2" />
                Chefs par Service
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.chefsParService).map(([service, count]) => (
                  <div key={service} className="flex justify-between items-center">
                    <span className="text-gray-700">{service}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationChefsServices;