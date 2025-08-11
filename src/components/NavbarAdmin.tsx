import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface AdminNavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface AdminInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  photo?: string;
  service?: string;
  specialite?: string;
  isAdmin?: boolean;
  isChef?: boolean;
  structure?: string;
  permissions?: string[];
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<number>(12);
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentTheme') || '0');
    }
    return 0;
  });

  // Thèmes spécialisés pour l'administrateur
  const adminThemes = [
    {
      name: 'professional',
      displayName: 'Professionnel',
      icon: '💼',
      navbar: 'bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100 border-b border-blue-200/50',
      primary: 'from-slate-100 to-blue-50',
      accent: '#3B82F6',
      text: 'text-slate-800',
      subtext: 'text-slate-600',
      border: 'border-blue-200',
      body: 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900'
    },
    {
      name: 'admin_dark',
      displayName: 'Admin Sombre',
      icon: '🛡️',
      navbar: 'bg-gradient-to-r from-gray-900 via-slate-900 to-blue-900 border-b border-blue-800/50',
      primary: 'from-gray-900 to-slate-900',
      accent: '#1E40AF',
      text: 'text-white',
      subtext: 'text-slate-300',
      border: 'border-slate-700',
      body: 'bg-gradient-to-br from-gray-900 to-slate-900 text-white'
    },
    {
      name: 'executive',
      displayName: 'Exécutif',
      icon: '⚡',
      navbar: 'bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-b border-emerald-200/50',
      primary: 'from-emerald-50 to-purple-50',
      accent: '#059669',
      text: 'text-gray-800',
      subtext: 'text-gray-600',
      border: 'border-emerald-200',
      body: 'bg-gradient-to-br from-emerald-50 to-purple-50 text-gray-900'
    }
  ];

  const currentThemeConfig = adminThemes[currentTheme];

  // Fonction pour récupérer le token
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fonction pour récupérer les informations de l'administrateur
  const fetchAdminInfo = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        console.warn('🔑 Aucun token d\'authentification trouvé');
        setAdminInfo(null);
        return;
      }

      console.log('🛡️ Récupération des infos administrateur via /api/auth/me');

      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📡 Réponse /api/auth/me: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données administrateur reçues:', data);

        if (data.success && data.user) {
          const adminInfoData: AdminInfo = {
            id: data.user.id,
            nom: data.user.nom,
            prenom: data.user.prenom,
            email: data.user.email,
            role: data.user.role,
            photo: data.user.photo,
          };

          // Ajouter les infos médecin/admin si disponibles
          if (data.medecin) {
            console.log('🩺 Infos médecin trouvées:', data.medecin);
            
            if (data.medecin.service?.nom) {
              adminInfoData.service = data.medecin.service.nom;
            }
            
            if (data.medecin.specialite) {
              adminInfoData.specialite = data.medecin.specialite;
            } else if (data.medecin.service?.nom) {
              adminInfoData.specialite = data.medecin.service.nom;
            }
            
            adminInfoData.structure = data.medecin.structure?.nom;
            adminInfoData.isChef = data.medecin.isChef;
            adminInfoData.isAdmin = data.medecin.isAdmin;
            adminInfoData.permissions = data.medecin.permissions || [];
          }

          console.log('✅ AdminInfo final:', adminInfoData);
          setAdminInfo(adminInfoData);

          localStorage.setItem('adminInfo', JSON.stringify(data));
          localStorage.setItem('adminInfoProcessed', JSON.stringify(adminInfoData));

        } else {
          throw new Error('Format de données invalide');
        }

      } else if (response.status === 401) {
        console.warn('⚠️ Token expiré ou invalide');
        clearAuthData();
        window.location.href = "/login";
        return;
        
      } else {
        console.error('❌ Erreur API:', response.status);
        const errorData = await response.json().catch(() => null);
        console.error('Détails erreur:', errorData);
        throw new Error(`Erreur API: ${response.status}`);
      }

    } catch (error) {
      console.error('🚨 Erreur lors de la récupération des infos admin:', error);
      
      // Essayer de récupérer depuis le cache en cas d'erreur
      try {
        const cachedAdminInfo = localStorage.getItem('adminInfoProcessed');
        if (cachedAdminInfo) {
          const cachedData = JSON.parse(cachedAdminInfo);
          console.log('📦 Infos administrateur récupérées depuis le cache');
          setAdminInfo(cachedData);
          return;
        }
      } catch (cacheError) {
        console.error('Erreur lecture cache:', cacheError);
      }

      // Fallback avec données d'exemple
      console.log('🔄 Utilisation des données de fallback');
      setAdminInfo({
        id: 1,
        nom: 'Kane',
        prenom: 'Mouhamed',
        email: 'admin@senpacc.sn',
        role: 'Administrateur',
        service: 'Urologie',
        specialite: 'Administration Médicale',
        structure: 'SENPACC',
        isAdmin: true,
        isChef: true,
        permissions: ['qr_management', 'user_management', 'system_admin']
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour nettoyer les données d'authentification
  const clearAuthData = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminInfoProcessed');
    localStorage.removeItem('refreshToken');
    console.log('🧹 Données d\'authentification nettoyées');
  };

  // Fonction de déconnexion améliorée
  const handleLogout = async () => {
    try {
      console.log('🚪 Début de la déconnexion...');
      const token = getAuthToken();
      
      if (token) {
        console.log('🔄 Tentative déconnexion via /api/auth/logout');
        
        try {
          const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: "include",
          });

          console.log(`📡 Réponse déconnexion: ${response.status}`);

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Déconnexion réussie:', data.message);
          } else {
            console.warn('⚠️ Erreur déconnexion API:', response.status);
          }
        } catch (err) {
          console.warn('⚠️ Erreur déconnexion:', err);
        }
      }
      
      // Nettoyer toutes les données locales
      clearAuthData();
      
      console.log('✅ Données locales nettoyées');
      
      // Rediriger vers la page de connexion
      window.location.href = "/login";
      
    } catch (err) {
      console.error("🚨 Erreur de déconnexion :", err);
      // Forcer le nettoyage et la redirection même en cas d'erreur
      clearAuthData();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Charger les informations administrateur au montage
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    // Écouter les changements de token (connexion/déconnexion depuis d'autres onglets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        // Token supprimé, probablement déconnexion
        setAdminInfo(null);
        window.location.href = "/login";
      } else if (e.key === 'token' && e.newValue) {
        // Nouveau token, recharger les infos utilisateur
        fetchAdminInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Gestion du thème
    document.body.className = document.body.className
      .replace(/bg-\S+/g, '')
      .replace(/text-\S+/g, '')
      .replace(/theme-\S+/g, '');

    document.body.classList.add('transition-all', 'duration-500');

    const style = document.createElement('style');
    style.id = 'dynamic-admin-theme-style';

    const oldStyle = document.getElementById('dynamic-admin-theme-style');
    if (oldStyle) oldStyle.remove();

    const themeClasses = currentThemeConfig.body.split(' ');
    themeClasses.forEach(cls => document.body.classList.add(cls));

    style.textContent = `
      :root {
        --primary-color: ${currentThemeConfig.accent};
        --secondary-color: ${currentThemeConfig.primary};
        --accent-color: ${currentThemeConfig.accent};
      }
      .admin-theme * {
        transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
      }
    `;

    document.head.appendChild(style);
    localStorage.setItem('currentTheme', currentTheme.toString());
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => {
      const newTheme = (prev + 1) % 3;
      window.dispatchEvent(new Event('themeChanged'));
      return newTheme;
    });
  };

  // Formatage du nom complet avec titre
  const getFullName = (): string => {
    if (!adminInfo) return 'Chargement...';
    const prefix = adminInfo.isAdmin ? 'Admin.' : adminInfo.role?.toLowerCase().includes('medecin') ? 'Dr.' : '';
    return `${prefix} ${adminInfo.prenom} ${adminInfo.nom}`.trim();
  };

  // Formatage du rôle avec spécialité
  const getRoleDisplay = (): string => {
    if (!adminInfo) return 'Chargement...';

    let display = adminInfo.role;
    if (adminInfo.isAdmin) display = 'Administrateur Principal';
    if (adminInfo.isChef) display += ' • Chef de Service';
    if (adminInfo.specialite) display += ` • ${adminInfo.specialite}`;

    return display;
  };

  // Générer les initiales pour l'avatar
  const getInitials = (): string => {
    if (!adminInfo) return 'A';
    const firstInitial = adminInfo.prenom?.[0]?.toUpperCase() || '';
    const lastInitial = adminInfo.nom?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-30 transition-all duration-500 shadow-lg backdrop-blur-md ${currentThemeConfig.navbar} ${isSidebarCollapsed
          ? 'left-20 w-[calc(100%-5rem)]'
          : 'left-64 w-[calc(100%-16rem)]'
        }`}
    >
      <div className="w-full px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Partie gauche avec bouton toggle et identification */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-all duration-200 ${currentTheme === 0
                  ? 'hover:bg-blue-100/50 text-slate-700'
                  : currentTheme === 1
                    ? 'hover:bg-slate-800/50 text-slate-300'
                    : 'hover:bg-emerald-100/50 text-gray-700'
                }`}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <Bars3Icon className="h-6 w-6" />
              ) : (
                <XMarkIcon className="h-6 w-6" />
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-300 ${currentTheme === 0 ? 'bg-blue-100/50' :
                  currentTheme === 1 ? 'bg-slate-800/50' : 'bg-emerald-100/50'
                }`}>
                <span className="text-sm font-bold">
                  {currentThemeConfig.icon}
                </span>
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${currentThemeConfig.text}`}>
                  SEN-PACC
                </h1>
                <p className={`text-sm transition-colors duration-300 ${currentThemeConfig.subtext}`}>
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • Thème {currentThemeConfig.displayName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Switch de thème admin */}
            <div className="relative">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm border-2 group ${currentTheme === 0 ? 'text-blue-700 hover:text-blue-900 bg-blue-100/50 border-blue-300/50 hover:border-blue-400/70' :
                    currentTheme === 1 ? 'text-slate-300 hover:text-white bg-slate-800/50 border-slate-600/50 hover:border-slate-500/70' :
                      'text-emerald-700 hover:text-emerald-900 bg-emerald-100/50 border-emerald-300/50 hover:border-emerald-400/70'
                  }`}
                title={`Thème: ${currentThemeConfig.displayName}`}
              >
                <span className="text-base transform group-hover:scale-110 transition-transform duration-300">
                  {currentThemeConfig.icon}
                </span>
              </button>
            </div>

            {/* Notifications administrateur */}
            <div className="relative">
              <button
                className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${currentTheme === 0 ? 'hover:bg-blue-100/50 text-slate-700 hover:text-blue-700' :
                    currentTheme === 1 ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white' :
                      'hover:bg-emerald-100/50 text-gray-700 hover:text-emerald-700'
                  }`}
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Séparateur */}
            <div className={`h-6 w-px transition-colors duration-300 ${currentTheme === 0 ? 'bg-blue-200' :
                currentTheme === 1 ? 'bg-slate-700' : 'bg-emerald-200'
              }`}></div>

            {/* Menu utilisateur administrateur */}
            <Menu as="div" className="relative">
              <Menu.Button className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm group ${currentTheme === 0 ? 'hover:bg-blue-50/50' :
                  currentTheme === 1 ? 'hover:bg-slate-800/50' :
                    'hover:bg-emerald-50/50'
                }`}>
                <div className="relative">
                  {adminInfo?.photo ? (
                    <img
                      className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 object-cover ${currentTheme === 0 ? 'ring-blue-300 group-hover:ring-blue-400' :
                          currentTheme === 1 ? 'ring-slate-600 group-hover:ring-slate-500' :
                            'ring-emerald-300 group-hover:ring-emerald-400'
                        }`}
                      src={adminInfo.photo}
                      alt="Admin Profile"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 flex items-center justify-center text-sm font-bold ${currentTheme === 0 ? 'ring-blue-300 group-hover:ring-blue-400 bg-blue-100 text-blue-700' :
                        currentTheme === 1 ? 'ring-slate-600 group-hover:ring-slate-500 bg-slate-700 text-slate-300' :
                          'ring-emerald-300 group-hover:ring-emerald-400 bg-emerald-100 text-emerald-700'
                      }`}>
                      {getInitials()}
                    </div>
                  )}

                  {/* Badge admin */}
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 flex items-center justify-center ${currentTheme === 0 ? 'bg-blue-500 border-white' :
                      currentTheme === 1 ? 'bg-blue-600 border-slate-900' :
                        'bg-emerald-500 border-white'
                    }`}>
                    <ShieldCheckIcon className="h-2 w-2 text-white" />
                  </div>
                </div>

                {!loading && (
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${currentThemeConfig.text}`}>
                      {getFullName()}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${currentThemeConfig.subtext}`}>
                      {getRoleDisplay()}
                    </span>
                  </div>
                )}

                {loading && (
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <div className={`h-4 w-24 rounded animate-pulse ${currentTheme === 0 ? 'bg-blue-300' :
                        currentTheme === 1 ? 'bg-slate-600' :
                          'bg-emerald-300'
                      }`}></div>
                    <div className={`h-3 w-16 rounded animate-pulse mt-1 ${currentTheme === 0 ? 'bg-blue-200' :
                        currentTheme === 1 ? 'bg-slate-700' :
                          'bg-emerald-200'
                      }`}></div>
                  </div>
                )}

                <ChevronDownIcon className={`h-4 w-4 transition-all duration-200 ${currentTheme === 0 ? 'text-blue-600 group-hover:text-blue-800' :
                    currentTheme === 1 ? 'text-slate-400 group-hover:text-slate-300' :
                      'text-emerald-600 group-hover:text-emerald-800'
                  }`} />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 translate-y-1"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 translate-y-1"
              >
                <Menu.Items className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl shadow-2xl ring-1 focus:outline-none overflow-hidden backdrop-blur-lg transition-all duration-300 ${currentTheme === 0 ? 'bg-white/95 ring-blue-200' :
                    currentTheme === 1 ? 'bg-slate-900/95 ring-slate-700' :
                      'bg-white/95 ring-emerald-200'
                  }`}>

                  {/* En-tête admin */}
                  <div className={`px-4 py-3 border-b ${currentThemeConfig.border}`}>
                    <div className="flex items-center space-x-3">
                      {adminInfo?.photo ? (
                        <img
                          className={`h-10 w-10 rounded-full ring-2 object-cover ${currentTheme === 0 ? 'ring-blue-300' :
                              currentTheme === 1 ? 'ring-slate-600' :
                                'ring-emerald-300'
                            }`}
                          src={adminInfo.photo}
                          alt="Admin Profile"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full ring-2 flex items-center justify-center text-lg font-bold ${currentTheme === 0 ? 'ring-blue-300 bg-blue-100 text-blue-700' :
                            currentTheme === 1 ? 'ring-slate-600 bg-slate-700 text-slate-300' :
                              'ring-emerald-300 bg-emerald-100 text-emerald-700'
                          }`}>
                          {getInitials()}
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-semibold transition-colors duration-300 ${currentThemeConfig.text}`}>
                          {getFullName()}
                        </p>
                        <p className={`text-xs ${currentThemeConfig.subtext}`}>
                          {adminInfo?.email || 'admin@senpacc.sn'}
                        </p>
                        {adminInfo?.isAdmin && (
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${currentTheme === 0 ? 'bg-blue-100 text-blue-700' :
                              currentTheme === 1 ? 'bg-blue-900 text-blue-300' :
                                'bg-emerald-100 text-emerald-700'
                            }`}>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Administrateur
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/admin/profile"
                          className={`${active
                              ? currentTheme === 0
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                                : currentTheme === 1
                                  ? 'bg-slate-800 text-white border-r-4 border-blue-500'
                                  : 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500'
                              : currentThemeConfig.text
                            } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <UserCircleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Mon Profil</p>
                            <p className={`text-xs ${currentThemeConfig.subtext}`}>
                              Gérer les informations personnelles
                            </p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/admin/settings"
                          className={`${active
                              ? currentTheme === 0
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                                : currentTheme === 1
                                  ? 'bg-slate-800 text-white border-r-4 border-blue-500'
                                  : 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500'
                              : currentThemeConfig.text
                            } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <CogIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Paramètres</p>
                            <p className={`text-xs ${currentThemeConfig.subtext}`}>
                              Configuration et préférences
                            </p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>

                    <div className={`border-t my-2 ${currentThemeConfig.border}`}></div>

                    {/* Déconnexion */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active
                              ? 'bg-red-50 text-red-600 border-r-4 border-red-500'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-red-600'
                                : currentTheme === 1
                                  ? 'text-gray-300 hover:text-red-400'
                                  : 'text-gray-200 hover:text-red-400'
                            } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group w-full`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div className="text-left">
                            <p>Déconnexion</p>
                            <p className={`text-xs ${currentTheme === 0 ? 'text-gray-500' :
                                currentTheme === 1 ? 'text-gray-400' :
                                  'text-gray-300'
                              }`}>Se déconnecter en toute sécurité</p>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      
      {/* Ligne de séparation subtile */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${currentTheme === 0 ? 'bg-gradient-to-r from-transparent via-blue-300 to-transparent' :
          currentTheme === 1 ? 'bg-gradient-to-r from-transparent via-slate-700 to-transparent' :
            'bg-gradient-to-r from-transparent via-emerald-300 to-transparent'
        }`}></div>
    </nav>
  );
};

export default AdminNavbar;