// import React, { useState, useEffect } from 'react';
// import {
//   BellIcon,
//   ChevronDownIcon,
//   UserCircleIcon,
//   CogIcon,
//   ArrowRightOnRectangleIcon,
//   Bars3Icon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';
// import { Menu, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// interface NavbarProps {
//   isSidebarCollapsed: boolean;
//   toggleSidebar: () => void;
// }

// interface UserInfo {
//   id: number;
//   nom: string;
//   prenom: string;
//   email: string;
//   role: string;
//   photo?: string;
//   service?: string;
//   specialite?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [notifications, setNotifications] = useState<number>(3);
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTheme, setCurrentTheme] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return parseInt(localStorage.getItem('currentTheme') || '0');
//     }
//     return 0;
//   });

//   // Définition des 3 thèmes
//   const themes = [
//     {
//       name: 'white',
//       displayName: 'Blanc',
//       icon: '⚪',
//       navbar: 'bg-gradient-to-r from-gray-100 to-white border-b border-gray-200',
//       primary: 'from-gray-100 to-white',
//       accent: '#6B7280',
//       text: 'text-gray-800',
//       subtext: 'text-gray-600',
//       border: 'border-gray-200',
//       body: 'bg-white text-gray-900'
//     },
//     {
//       name: 'black',
//       displayName: 'Noir',
//       icon: '⚫',
//       navbar: 'bg-gradient-to-r from-black to-gray-900',
//       primary: 'from-black to-gray-900',
//       accent: '#1F2937',
//       text: 'text-white',
//       subtext: 'text-gray-300',
//       border: 'border-gray-800',
//       body: 'bg-black text-white'
//     },
//     {
//       name: 'gray',
//       displayName: 'Gris',
//       icon: '🔘',
//       navbar: 'bg-gradient-to-r from-gray-600 to-gray-700',
//       primary: 'from-gray-600 to-gray-700',
//       accent: '#4B5563',
//       text: 'text-white',
//       subtext: 'text-gray-200',
//       border: 'border-gray-500',
//       body: 'bg-gray-500 text-white'
//     }
//   ];

//   const currentThemeConfig = themes[currentTheme];

//   // Fonction pour récupérer le token
//   const getAuthToken = (): string | null => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   // Fonction pour récupérer les informations du médecin connecté
//   const fetchUserInfo = async () => {
//     try {
//       setLoading(true);
//       const token = getAuthToken();
      
//       if (!token) {
//         console.warn('🔑 Aucun token d\'authentification trouvé');
//         setUserInfo(null);
//         return;
//       }

//       console.log('🔍 Récupération des infos utilisateur via /api/auth/me');
      
//       const response = await fetch('http://localhost:3000/api/auth/me', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       console.log(`📡 Réponse /api/auth/me: ${response.status}`);

//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Données reçues:', data);

//         if (data.success && data.user) {
//           // Préparer les infos utilisateur
//           const userInfoData: UserInfo = {
//             id: data.user.id,
//             nom: data.user.nom,
//             prenom: data.user.prenom,
//             email: data.user.email,
//             role: data.user.role,
//             photo: data.user.photo,
//           };

//           // Ajouter les infos médecin si disponibles
//           if (data.medecin) {
//             console.log('🩺 Infos médecin trouvées:', data.medecin);
            
//             // Ajouter service et spécialité
//             if (data.medecin.service?.nom) {
//               userInfoData.service = data.medecin.service.nom;
//             }
            
//             if (data.medecin.specialite) {
//               userInfoData.specialite = data.medecin.specialite;
//             } else if (data.medecin.service?.nom) {
//               // Utiliser le service comme spécialité si pas de spécialité définie
//               userInfoData.specialite = data.medecin.service.nom;
//             }
//           }

//           console.log('✅ UserInfo final:', userInfoData);
//           setUserInfo(userInfoData);
          
//           // Sauvegarder les données complètes en cache
//           localStorage.setItem('userInfo', JSON.stringify(data));
//           localStorage.setItem('userInfoProcessed', JSON.stringify(userInfoData));
          
//         } else {
//           console.warn('⚠️ Format de données inattendu:', data);
//           throw new Error('Format de données invalide');
//         }
        
//       } else if (response.status === 401) {
//         console.warn('⚠️ Token expiré ou invalide');
//         clearAuthData();
//         window.location.href = "/login";
//         return;
        
//       } else {
//         console.error('❌ Erreur API:', response.status);
//         const errorData = await response.json().catch(() => null);
//         console.error('Détails erreur:', errorData);
//         throw new Error(`Erreur API: ${response.status}`);
//       }

//     } catch (error) {
//       console.error('🚨 Erreur lors de la récupération des infos utilisateur:', error);
      
//       // Essayer de récupérer depuis le cache en cas d'erreur
//       try {
//         const cachedUserInfo = localStorage.getItem('userInfoProcessed');
//         if (cachedUserInfo) {
//           const cachedData = JSON.parse(cachedUserInfo);
//           console.log('📦 Infos utilisateur récupérées depuis le cache');
//           setUserInfo(cachedData);
//           return;
//         }
//       } catch (cacheError) {
//         console.error('Erreur lecture cache:', cacheError);
//       }

//       // Données de fallback si tout échoue
//       console.log('🔄 Utilisation des données de fallback');
//       setUserInfo({
//         id: 0,
//         nom: 'Utilisateur',
//         prenom: 'Inconnu', 
//         email: 'user@exemple.com',
//         role: 'Médecin',
//         service: 'Service non défini',
//         specialite: 'Spécialité non définie'
//       });
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction pour nettoyer les données d'authentification
//   const clearAuthData = () => {
//     localStorage.removeItem('token');
//     sessionStorage.removeItem('token');
//     localStorage.removeItem('userInfo');
//     localStorage.removeItem('userInfoProcessed');
//     localStorage.removeItem('refreshToken');
//     console.log('🧹 Données d\'authentification nettoyées');
//   };

//   // Fonction de déconnexion améliorée
//   const handleLogout = async () => {
//     try {
//       console.log('🚪 Début de la déconnexion...');
//       const token = getAuthToken();
      
//       if (token) {
//         console.log('🔄 Tentative déconnexion via /api/auth/logout');
        
//         try {
//           const response = await fetch('http://localhost:3000/api/auth/logout', {
//             method: 'GET', // Votre route logout est en GET
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             credentials: "include",
//           });

//           console.log(`📡 Réponse déconnexion: ${response.status}`);

//           if (response.ok) {
//             const data = await response.json();
//             console.log('✅ Déconnexion réussie:', data.message);
//           } else {
//             console.warn('⚠️ Erreur déconnexion API:', response.status);
//           }
//         } catch (err) {
//           console.warn('⚠️ Erreur déconnexion:', err);
//         }
//       }
      
//       // Nettoyer toutes les données locales
//       clearAuthData();
      
//       console.log('✅ Données locales nettoyées');
      
//       // Rediriger vers la page de connexion
//       window.location.href = "/login";
      
//     } catch (err) {
//       console.error("🚨 Erreur de déconnexion :", err);
//       // Forcer le nettoyage et la redirection même en cas d'erreur
//       clearAuthData();
//       window.location.href = "/login";
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     // Charger les informations utilisateur au montage
//     fetchUserInfo();
//   }, []);

//   useEffect(() => {
//     // Écouter les changements de token (connexion/déconnexion depuis d'autres onglets)
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'token' && !e.newValue) {
//         // Token supprimé, probablement déconnexion
//         setUserInfo(null);
//         window.location.href = "/login";
//       } else if (e.key === 'token' && e.newValue) {
//         // Nouveau token, recharger les infos utilisateur
//         fetchUserInfo();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   useEffect(() => {
//     // Gestion du thème
//     document.body.className = document.body.className
//       .replace(/bg-\S+/g, '')
//       .replace(/text-\S+/g, '')
//       .replace(/theme-\S+/g, '');

//     document.body.classList.add('transition-all', 'duration-500');

//     const style = document.createElement('style');
//     style.id = 'dynamic-theme-style';

//     const oldStyle = document.getElementById('dynamic-theme-style');
//     if (oldStyle) oldStyle.remove();

//     switch (currentTheme) {
//       case 0:
//         document.body.classList.add('bg-white', 'text-gray-900', 'theme-white');
//         style.textContent = `
//           :root {
//             --primary-color: #F3F4F6;
//             --secondary-color: #FFFFFF;
//             --accent-color: #6B7280;
//           }
//           .theme-white * {
//             transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
//           }
//         `;
//         break;
//       case 1:
//         document.body.classList.add('bg-black', 'text-white', 'theme-black');
//         style.textContent = `
//           :root {
//             --primary-color: #000000;
//             --secondary-color: #111827;
//             --accent-color: #1F2937;
//           }
//           .theme-black * {
//             transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
//           }
//         `;
//         break;
//       case 2:
//         document.body.classList.add('bg-gray-500', 'text-white', 'theme-gray');
//         style.textContent = `
//           :root {
//             --primary-color: #6B7280;
//             --secondary-color: #4B5563;
//             --accent-color: #4B5563;
//           }
//           .theme-gray * {
//             transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
//           }
//         `;
//         break;
//     }

//     document.head.appendChild(style);
//     localStorage.setItem('currentTheme', currentTheme.toString());
//   }, [currentTheme]);

//   const toggleTheme = () => {
//     setCurrentTheme(prev => {
//       const newTheme = (prev + 1) % 3;
//       window.dispatchEvent(new Event('themeChanged'));
//       return newTheme;
//     });
//   };

//   // Formatage du nom complet avec titre
//   const getFullName = (): string => {
//     if (!userInfo) return 'Chargement...';
//     const titre = userInfo.role?.toLowerCase().includes('medecin') || userInfo.role?.toLowerCase().includes('docteur') ? 'Dr.' : '';
//     return `${titre} ${userInfo.prenom} ${userInfo.nom}`.trim();
//   };

//   // Formatage du rôle avec spécialité
//   const getRoleDisplay = (): string => {
//     if (!userInfo) return 'Chargement...';
    
//     let display = userInfo.role;
    
//     if (userInfo.specialite) {
//       display += ` - ${userInfo.specialite}`;
//     } else if (userInfo.service) {
//       display += ` - ${userInfo.service}`;
//     }
    
//     return display;
//   };

//   // Générer les initiales pour l'avatar
//   const getInitials = (): string => {
//     if (!userInfo) return '?';
//     const firstInitial = userInfo.prenom?.[0]?.toUpperCase() || '';
//     const lastInitial = userInfo.nom?.[0]?.toUpperCase() || '';
//     return `${firstInitial}${lastInitial}`;
//   };

//   return (
//     <nav
//       className={`fixed top-0 right-0 z-30 transition-all duration-500 shadow-lg ${currentThemeConfig.navbar} ${isSidebarCollapsed
//           ? 'left-20 w-[calc(100%-5rem)]'
//           : 'left-64 w-[calc(100%-16rem)]'
//         }`}
//     >
//       <div className="w-full px-4">
//         <div className="flex justify-between h-16 items-center">
//           {/* Partie gauche avec bouton toggle */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={toggleSidebar}
//               className={`p-2 rounded-lg transition-all duration-200 ${
//                 currentTheme === 0 
//                   ? 'hover:bg-gray-200/50 text-gray-700' 
//                   : currentTheme === 1 
//                     ? 'hover:bg-gray-800/50 text-gray-300' 
//                     : 'hover:bg-gray-600/50 text-gray-200'
//               }`}
//               aria-label="Toggle sidebar"
//             >
//               {isSidebarCollapsed ? (
//                 <Bars3Icon className="h-6 w-6" />
//               ) : (
//                 <XMarkIcon className="h-6 w-6" />
//               )}
//             </button>

//             <div className="flex items-center space-x-3">
//               <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
//                 currentTheme === 0 ? 'bg-gray-200/50' :
//                 currentTheme === 1 ? 'bg-gray-800/50' : 'bg-gray-600/50'
//               }`}>
//                 <span className="text-sm font-bold">
//                   {currentThemeConfig.icon}
//                 </span>
//               </div>
//               <div>
//                 <h1 className={`text-xl font-bold transition-colors duration-300 ${
//                   currentTheme === 0 ? 'text-gray-800' : 'text-white'
//                 }`}>
//                   SEN-PACC
//                 </h1>
//                 <p className={`text-sm transition-colors duration-300 ${currentThemeConfig.subtext}`}>
//                   {new Date().toLocaleDateString('fr-FR', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })} • Thème {currentThemeConfig.displayName}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             {/* Switch de thème */}
//             <div className="relative">
//               <button
//                 onClick={toggleTheme}
//                 className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm border-2 group ${
//                   currentTheme === 0 ? 'text-gray-700 hover:text-gray-900 bg-gray-200/20 border-gray-400/30 hover:border-gray-500/50' :
//                   currentTheme === 1 ? 'text-gray-300 hover:text-white bg-gray-800/20 border-gray-600/30 hover:border-gray-500/50' :
//                   'text-gray-200 hover:text-white bg-gray-600/20 border-gray-400/30 hover:border-gray-300/50'
//                 }`}
//                 title={`Thème actuel: ${currentThemeConfig.displayName}`}
//               >
//                 <span className="text-base transform group-hover:scale-110 transition-transform duration-300">
//                   {currentThemeConfig.icon}
//                 </span>
//               </button>
//             </div>

//             {/* Notifications */}
//             <div className="relative">
//               <button className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
//                 currentTheme === 0 ? 'hover:bg-gray-200/20 text-gray-700 hover:text-gray-900' :
//                 currentTheme === 1 ? 'hover:bg-gray-800/20 text-gray-300 hover:text-white' :
//                 'hover:bg-gray-600/20 text-gray-200 hover:text-white'
//               }`}>
//                 <BellIcon className="h-5 w-5" />
//                 {notifications > 0 && (
//                   <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white rounded-full border-2 shadow-lg animate-pulse ${
//                     currentTheme === 0 ? 'bg-red-500 border-gray-200' :
//                     currentTheme === 1 ? 'bg-red-500 border-black' :
//                     'bg-red-600 border-gray-400'
//                   }`}>
//                     {notifications}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Séparateur */}
//             <div className={`h-6 w-px transition-colors duration-300 ${
//               currentTheme === 0 ? 'bg-gray-300' :
//               currentTheme === 1 ? 'bg-gray-600' : 'bg-gray-400'
//             }`}></div>

//             {/* Menu utilisateur */}
//             <Menu as="div" className="relative">
//               <Menu.Button className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm group ${
//                 currentTheme === 0 ? 'hover:bg-gray-200/20' :
//                 currentTheme === 1 ? 'hover:bg-gray-800/20' :
//                 'hover:bg-gray-600/20'
//               }`}>
//                 <div className="relative">
//                   {userInfo?.photo ? (
//                     <img
//                       className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 object-cover ${
//                         currentTheme === 0 ? 'ring-gray-400/50 group-hover:ring-gray-500' :
//                         currentTheme === 1 ? 'ring-gray-600 group-hover:ring-gray-500' :
//                         'ring-gray-400/50 group-hover:ring-gray-300'
//                       }`}
//                       src={userInfo.photo}
//                       alt="Profile"
//                       onError={(e) => {
//                         // Fallback en cas d'erreur de chargement de l'image
//                         e.currentTarget.style.display = 'none';
//                       }}
//                     />
//                   ) : (
//                     <div className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 flex items-center justify-center text-sm font-bold ${
//                       currentTheme === 0 ? 'ring-gray-400/50 group-hover:ring-gray-500 bg-gray-200 text-gray-700' :
//                       currentTheme === 1 ? 'ring-gray-600 group-hover:ring-gray-500 bg-gray-700 text-gray-300' :
//                       'ring-gray-400/50 group-hover:ring-gray-300 bg-gray-600 text-gray-200'
//                     }`}>
//                       {getInitials()}
//                     </div>
//                   )}
//                   <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${
//                     currentTheme === 0 ? 'bg-green-500 border-gray-200' :
//                     currentTheme === 1 ? 'bg-green-400 border-black' :
//                     'bg-green-500 border-gray-300'
//                   }`}></div>
//                 </div>
                
//                 {!loading && (
//                   <div className="hidden md:flex md:flex-col md:items-start">
//                     <span className={`text-sm font-semibold transition-colors duration-300 ${
//                       currentTheme === 0 ? 'text-gray-800' : 'text-white'
//                     }`}>
//                       {getFullName()}
//                     </span>
//                     <span className={`text-xs transition-colors duration-300 ${currentThemeConfig.subtext}`}>
//                       {getRoleDisplay()}
//                     </span>
//                   </div>
//                 )}

//                 {loading && (
//                   <div className="hidden md:flex md:flex-col md:items-start">
//                     <div className={`h-4 w-24 rounded animate-pulse ${
//                       currentTheme === 0 ? 'bg-gray-300' :
//                       currentTheme === 1 ? 'bg-gray-600' :
//                       'bg-gray-500'
//                     }`}></div>
//                     <div className={`h-3 w-16 rounded animate-pulse mt-1 ${
//                       currentTheme === 0 ? 'bg-gray-200' :
//                       currentTheme === 1 ? 'bg-gray-700' :
//                       'bg-gray-600'
//                     }`}></div>
//                   </div>
//                 )}
                
//                 <ChevronDownIcon className={`h-4 w-4 transition-colors duration-200 ${
//                   currentTheme === 0 ? 'text-gray-600 group-hover:text-gray-800' :
//                   currentTheme === 1 ? 'text-gray-400 group-hover:text-gray-300' :
//                   'text-gray-300 group-hover:text-white'
//                 }`} />
//               </Menu.Button>

//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-200"
//                 enterFrom="transform opacity-0 scale-95 translate-y-1"
//                 enterTo="transform opacity-100 scale-100 translate-y-0"
//                 leave="transition ease-in duration-150"
//                 leaveFrom="transform opacity-100 scale-100 translate-y-0"
//                 leaveTo="transform opacity-0 scale-95 translate-y-1"
//               >
//                 <Menu.Items className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl shadow-2xl ring-1 focus:outline-none overflow-hidden backdrop-blur-lg transition-all duration-300 ${
//                   currentTheme === 0 ? 'bg-white ring-gray-200' :
//                   currentTheme === 1 ? 'bg-gray-900 ring-gray-700' :
//                   'bg-gray-700 ring-gray-500'
//                 }`}>
//                   {/* En-tête du menu */}
//                   <div className={`px-4 py-3 ${currentThemeConfig.navbar}`}>
//                     <div className="flex items-center space-x-3">
//                       {userInfo?.photo ? (
//                         <img
//                           className={`h-10 w-10 rounded-full ring-2 object-cover ${
//                             currentTheme === 0 ? 'ring-gray-400/50' :
//                             currentTheme === 1 ? 'ring-gray-600' :
//                             'ring-gray-400/50'
//                           }`}
//                           src={userInfo.photo}
//                           alt="Profile"
//                           onError={(e) => {
//                             e.currentTarget.style.display = 'none';
//                           }}
//                         />
//                       ) : (
//                         <div className={`h-10 w-10 rounded-full ring-2 flex items-center justify-center text-lg font-bold ${
//                           currentTheme === 0 ? 'ring-gray-400/50 bg-gray-200 text-gray-700' :
//                           currentTheme === 1 ? 'ring-gray-600 bg-gray-700 text-gray-300' :
//                           'ring-gray-400/50 bg-gray-600 text-gray-200'
//                         }`}>
//                           {getInitials()}
//                         </div>
//                       )}
//                       <div>
//                         <p className={`text-sm font-semibold transition-colors duration-300 ${
//                           currentTheme === 0 ? 'text-gray-800' : 'text-white'
//                         }`}>
//                           {getFullName()}
//                         </p>
//                         <p className={`text-xs ${currentThemeConfig.subtext}`}>
//                           {userInfo?.email || 'email@exemple.com'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="py-2">
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="/profile"
//                           className={`${
//                             active
//                               ? currentTheme === 0
//                                 ? 'bg-gray-100 text-gray-800 border-r-4 border-gray-500'
//                                 : currentTheme === 1
//                                   ? 'bg-gray-800 text-white border-r-4 border-gray-600'
//                                   : 'bg-gray-600 text-white border-r-4 border-gray-400'
//                               : currentTheme === 0
//                                 ? 'text-gray-700 hover:text-gray-900'
//                                 : currentTheme === 1
//                                   ? 'text-gray-300 hover:text-white'
//                                   : 'text-gray-200 hover:text-white'
//                           } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
//                         >
//                           <UserCircleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
//                           <div>
//                             <p>Mon Profil</p>
//                             <p className={`text-xs ${
//                               currentTheme === 0 ? 'text-gray-500' :
//                               currentTheme === 1 ? 'text-gray-400' :
//                               'text-gray-300'
//                             }`}>Gérer les informations personnelles</p>
//                           </div>
//                         </a>
//                       )}
//                     </Menu.Item>

//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="/settings"
//                           className={`${
//                             active
//                               ? currentTheme === 0
//                                 ? 'bg-gray-100 text-gray-800 border-r-4 border-gray-500'
//                                 : currentTheme === 1
//                                   ? 'bg-gray-800 text-white border-r-4 border-gray-600'
//                                   : 'bg-gray-600 text-white border-r-4 border-gray-400'
//                               : currentTheme === 0
//                                 ? 'text-gray-700 hover:text-gray-900'
//                                 : currentTheme === 1
//                                   ? 'text-gray-300 hover:text-white'
//                                   : 'text-gray-200 hover:text-white'
//                           } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
//                         >
//                           <CogIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
//                           <div>
//                             <p>Paramètres</p>
//                             <p className={`text-xs ${
//                               currentTheme === 0 ? 'text-gray-500' :
//                               currentTheme === 1 ? 'text-gray-400' :
//                               'text-gray-300'
//                             }`}>Préférences et configuration</p>
//                           </div>
//                         </a>
//                       )}
//                     </Menu.Item>

//                     <div className={`border-t my-2 ${
//                       currentTheme === 0 ? 'border-gray-200' :
//                       currentTheme === 1 ? 'border-gray-700' :
//                       'border-gray-500'
//                     }`}></div>

//                     <Menu.Item>
//                       {({ active }) => (
//                         <button
//                           onClick={handleLogout}
//                           className={`${
//                             active
//                               ? 'bg-red-50 text-red-600 border-r-4 border-red-500'
//                               : currentTheme === 0
//                                 ? 'text-gray-700 hover:text-red-600'
//                                 : currentTheme === 1
//                                   ? 'text-gray-300 hover:text-red-400'
//                                   : 'text-gray-200 hover:text-red-400'
//                           } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group w-full`}
//                         >
//                           <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
//                           <div className="text-left">
//                             <p>Déconnexion</p>
//                             <p className={`text-xs ${
//                               currentTheme === 0 ? 'text-gray-500' :
//                               currentTheme === 1 ? 'text-gray-400' :
//                               'text-gray-300'
//                             }`}>Se déconnecter en toute sécurité</p>
//                           </div>
//                         </button>
//                       )}
//                     </Menu.Item>
//                   </div>
//                 </Menu.Items>
//               </Transition>
//             </Menu>
//           </div>
//         </div>
//       </div>
      
//       <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${
//         currentTheme === 0 ? 'bg-gradient-to-r from-transparent via-gray-300 to-transparent' :
//         currentTheme === 1 ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' :
//         'bg-gradient-to-r from-transparent via-gray-500 to-transparent'
//       }`}></div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface NavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  photo?: string;
  service?: string;
  specialite?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0); // TOUJOURS démarrer en blanc
  const [currentTime, setCurrentTime] = useState(new Date());

  // Définition des 2 thèmes uniquement
  const themes = [
    {
      name: 'white',
      displayName: 'Clair',
      icon: <SunIcon className="h-5 w-5" />,
      navbar: 'bg-gradient-to-r from-gray-50 to-white border-b border-gray-200',
      primary: 'from-gray-50 to-white',
      accent: '#6B7280',
      text: 'text-gray-800',
      subtext: 'text-gray-600',
      border: 'border-gray-200',
      body: 'bg-white text-gray-900'
    },
    {
      name: 'black',
      displayName: 'Sombre',
      icon: <MoonIcon className="h-5 w-5" />,
      navbar: 'bg-gradient-to-r from-gray-900 to-black border-b border-gray-800',
      primary: 'from-gray-900 to-black',
      accent: '#1F2937',
      text: 'text-white',
      subtext: 'text-gray-300',
      border: 'border-gray-800',
      body: 'bg-gray-900 text-white'
    }
  ];

  const currentThemeConfig = themes[currentTheme];

  // Fonction pour récupérer le token
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fonction pour récupérer les informations du médecin connecté
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('🔑 Aucun token d\'authentification trouvé');
        setUserInfo(null);
        return;
      }

      console.log('🔍 Récupération des infos utilisateur via /api/auth/me');
      
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
        console.log('✅ Données reçues:', data);

        if (data.success && data.user) {
          // Préparer les infos utilisateur
          const userInfoData: UserInfo = {
            id: data.user.id,
            nom: data.user.nom,
            prenom: data.user.prenom,
            email: data.user.email,
            role: data.user.role,
            photo: data.user.photo,
          };

          // Ajouter les infos médecin si disponibles
          if (data.medecin) {
            console.log('🩺 Infos médecin trouvées:', data.medecin);
            
            if (data.medecin.service?.nom) {
              userInfoData.service = data.medecin.service.nom;
            }
            
            if (data.medecin.specialite) {
              userInfoData.specialite = data.medecin.specialite;
            } else if (data.medecin.service?.nom) {
              userInfoData.specialite = data.medecin.service.nom;
            }
          }

          console.log('✅ UserInfo final:', userInfoData);
          setUserInfo(userInfoData);
          
          localStorage.setItem('userInfo', JSON.stringify(data));
          localStorage.setItem('userInfoProcessed', JSON.stringify(userInfoData));
          
        } else {
          console.warn('⚠️ Format de données inattendu:', data);
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
      console.error('🚨 Erreur lors de la récupération des infos utilisateur:', error);
      
      try {
        const cachedUserInfo = localStorage.getItem('userInfoProcessed');
        if (cachedUserInfo) {
          const cachedData = JSON.parse(cachedUserInfo);
          console.log('📦 Infos utilisateur récupérées depuis le cache');
          setUserInfo(cachedData);
          return;
        }
      } catch (cacheError) {
        console.error('Erreur lecture cache:', cacheError);
      }

      console.log('🔄 Utilisation des données de fallback');
      setUserInfo({
        id: 0,
        nom: 'Utilisateur',
        prenom: 'Inconnu', 
        email: 'user@exemple.com',
        role: 'Médecin',
        service: 'Service non défini',
        specialite: 'Spécialité non définie'
      });
      
    } finally {
      setLoading(false);
    }
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
      
      clearAuthData();
      console.log('✅ Données locales nettoyées');
      window.location.href = "/login";
      
    } catch (err) {
      console.error("🚨 Erreur de déconnexion :", err);
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

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // FORCER le thème blanc au démarrage
  useEffect(() => {
    // Effacer tout thème précédent et forcer le blanc
    localStorage.setItem('currentTheme', '0');
    setCurrentTheme(0);
  }, []); // S'exécute une seule fois au montage

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        setUserInfo(null);
        window.location.href = "/login";
      } else if (e.key === 'token' && e.newValue) {
        fetchUserInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // FORCER le thème blanc au démarrage
    localStorage.setItem('currentTheme', '0');
    
    // Application du thème UNIQUEMENT sur la navbar - JAMAIS le sidebar
    const style = document.createElement('style');
    style.id = 'dynamic-theme-style';

    const oldStyle = document.getElementById('dynamic-theme-style');
    if (oldStyle) oldStyle.remove();

    if (currentTheme === 0) {
      // Thème blanc - NAVBAR SEULEMENT
      style.textContent = `
        :root {
          --navbar-bg: #FFFFFF;
          --navbar-text: #111827;
          --navbar-text-secondary: #6B7280;
          --navbar-border: #E5E7EB;
          --navbar-hover: #F3F4F6;
        }
        
        /* APPLICATION STRICTE - NAVBAR UNIQUEMENT */
        nav[class*="fixed"][class*="top-0"] {
          background-color: var(--navbar-bg) !important;
          border-bottom-color: var(--navbar-border) !important;
          color: var(--navbar-text) !important;
        }
        
        nav[class*="fixed"][class*="top-0"] * {
          color: var(--navbar-text) !important;
          transition: all 0.3s ease !important;
        }
        
        nav[class*="fixed"][class*="top-0"] button:hover {
          background-color: var(--navbar-hover) !important;
        }
        
        nav[class*="fixed"][class*="top-0"] .text-gray-600 {
          color: var(--navbar-text-secondary) !important;
        }
      `;
    } else {
      // Thème noir - NAVBAR SEULEMENT  
      style.textContent = `
        :root {
          --navbar-bg: #111827;
          --navbar-text: #F9FAFB;
          --navbar-text-secondary: #D1D5DB;
          --navbar-border: #374151;
          --navbar-hover: #1F2937;
        }
        
        /* APPLICATION STRICTE - NAVBAR UNIQUEMENT */
        nav[class*="fixed"][class*="top-0"] {
          background-color: var(--navbar-bg) !important;
          border-bottom-color: var(--navbar-border) !important;
          color: var(--navbar-text) !important;
        }
        
        nav[class*="fixed"][class*="top-0"] * {
          color: var(--navbar-text) !important;
          transition: all 0.3s ease !important;
        }
        
        nav[class*="fixed"][class*="top-0"] button:hover {
          background-color: var(--navbar-hover) !important;
        }
        
        nav[class*="fixed"][class*="top-0"] .text-gray-300 {
          color: var(--navbar-text-secondary) !important;
        }
      `;
    }

    document.head.appendChild(style);
    localStorage.setItem('currentTheme', currentTheme.toString());
    
    // Émettre un événement pour synchroniser avec d'autres composants
    window.dispatchEvent(new CustomEvent('themeSync', { detail: { theme: currentTheme } }));
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => {
      const newTheme = prev === 0 ? 1 : 0; // Basculer entre 0 et 1
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
      return newTheme;
    });
  };

  // Formatage du nom complet avec titre
  const getFullName = (): string => {
    if (!userInfo) return 'Chargement...';
    const titre = userInfo.role?.toLowerCase().includes('medecin') || userInfo.role?.toLowerCase().includes('docteur') ? 'Dr.' : '';
    return `${titre} ${userInfo.prenom} ${userInfo.nom}`.trim();
  };

  // Formatage du rôle avec spécialité
  const getRoleDisplay = (): string => {
    if (!userInfo) return 'Chargement...';
    
    let display = userInfo.role;
    
    if (userInfo.specialite) {
      display += ` - ${userInfo.specialite}`;
    } else if (userInfo.service) {
      display += ` - ${userInfo.service}`;
    }
    
    return display;
  };

  // Générer les initiales pour l'avatar
  const getInitials = (): string => {
    if (!userInfo) return '?';
    const firstInitial = userInfo.prenom?.[0]?.toUpperCase() || '';
    const lastInitial = userInfo.nom?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-30 transition-all duration-300 shadow-lg backdrop-blur-sm border-b ${
        isSidebarCollapsed
          ? 'left-20 w-[calc(100%-5rem)]'
          : 'left-64 w-[calc(100%-16rem)]'
        }`}
      style={{
        backgroundColor: 'var(--navbar-bg)',
        borderBottomColor: 'var(--navbar-border)',
        color: 'var(--navbar-text)'
      }}
    >
      <div className="w-full px-4">
        <div className="flex justify-between h-16 items-center relative">
          {/* Partie gauche avec bouton toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentTheme === 0 
                  ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' 
                  : 'hover:bg-gray-800 text-gray-300 hover:text-white'
              }`}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <Bars3Icon className="h-6 w-6" />
              ) : (
                <XMarkIcon className="h-6 w-6" />
              )}
            </button>

            {/* Partie droite */}
          <div className="flex items-center justify-end space-x-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                currentTheme === 0 ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'
              }`}>
                <span className="text-sm font-bold">🏥</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  currentTheme === 0 ? 'text-gray-800' : 'text-white'
                }`}>
                  SEN-PACC
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  currentTheme === 0 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Switch de thème */}
            <div className="relative">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 group ${
                  currentTheme === 0 
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title={`Basculer vers le thème ${currentTheme === 0 ? 'sombre' : 'clair'}`}
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {currentThemeConfig.icon}
                </div>
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className={`p-2 rounded-lg transition-all duration-200 ${
                currentTheme === 0 
                  ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' 
                  : 'hover:bg-gray-800 text-gray-300 hover:text-white'
              }`}>
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Séparateur */}
            <div className={`h-6 w-px transition-colors duration-300 ${
              currentTheme === 0 ? 'bg-gray-300' : 'bg-gray-600'
            }`}></div>

            {/* Menu utilisateur */}
            <Menu as="div" className="relative">
              <Menu.Button className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 group ${
                currentTheme === 0 
                  ? 'hover:bg-gray-100' 
                  : 'hover:bg-gray-800'
              }`}>
                <div className="relative">
                  {userInfo?.photo ? (
                    <img
                      className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 object-cover ${
                        currentTheme === 0 
                          ? 'ring-gray-300 group-hover:ring-gray-400' 
                          : 'ring-gray-600 group-hover:ring-gray-500'
                      }`}
                      src={userInfo.photo}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 flex items-center justify-center text-sm font-bold ${
                      currentTheme === 0 
                        ? 'ring-gray-300 group-hover:ring-gray-400 bg-gray-200 text-gray-700' 
                        : 'ring-gray-600 group-hover:ring-gray-500 bg-gray-700 text-gray-300'
                    }`}>
                      {getInitials()}
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 bg-green-500 ${
                    currentTheme === 0 ? 'border-white' : 'border-gray-900'
                  }`}></div>
                </div>
                
                {!loading && (
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                      currentTheme === 0 ? 'text-gray-800' : 'text-white'
                    }`}>
                      {getFullName()}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      currentTheme === 0 ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {getRoleDisplay()}
                    </span>
                  </div>
                )}

                {loading && (
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <div className={`h-4 w-24 rounded animate-pulse ${
                      currentTheme === 0 ? 'bg-gray-300' : 'bg-gray-600'
                    }`}></div>
                    <div className={`h-3 w-16 rounded animate-pulse mt-1 ${
                      currentTheme === 0 ? 'bg-gray-200' : 'bg-gray-700'
                    }`}></div>
                  </div>
                )}
                
                <ChevronDownIcon className={`h-4 w-4 transition-colors duration-200 ${
                  currentTheme === 0 
                    ? 'text-gray-600 group-hover:text-gray-800' 
                    : 'text-gray-400 group-hover:text-gray-300'
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
                <Menu.Items className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl shadow-2xl ring-1 focus:outline-none overflow-hidden backdrop-blur-lg transition-all duration-300 ${
                  currentTheme === 0 
                    ? 'bg-white/95 ring-gray-200' 
                    : 'bg-gray-900/95 ring-gray-700'
                }`}>
                  {/* En-tête du menu */}
                  <div className={`px-4 py-3 ${
                    currentTheme === 0 
                      ? 'bg-gray-50/50 border-b border-gray-200' 
                      : 'bg-gray-800/50 border-b border-gray-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {userInfo?.photo ? (
                        <img
                          className={`h-10 w-10 rounded-full ring-2 object-cover ${
                            currentTheme === 0 ? 'ring-gray-300' : 'ring-gray-600'
                          }`}
                          src={userInfo.photo}
                          alt="Profile"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full ring-2 flex items-center justify-center text-lg font-bold ${
                          currentTheme === 0 
                            ? 'ring-gray-300 bg-gray-200 text-gray-700' 
                            : 'ring-gray-600 bg-gray-700 text-gray-300'
                        }`}>
                          {getInitials()}
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          currentTheme === 0 ? 'text-gray-800' : 'text-white'
                        }`}>
                          {getFullName()}
                        </p>
                        <p className={`text-xs ${
                          currentTheme === 0 ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {userInfo?.email || 'email@exemple.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${
                            active
                              ? currentTheme === 0
                                ? 'bg-gray-100 text-gray-800 border-r-4 border-blue-500'
                                : 'bg-gray-800 text-white border-r-4 border-blue-500'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-gray-900'
                                : 'text-gray-300 hover:text-white'
                          } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <UserCircleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Mon Profil</p>
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' : 'text-gray-400'
                            }`}>Gérer les informations personnelles</p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={`${
                            active
                              ? currentTheme === 0
                                ? 'bg-gray-100 text-gray-800 border-r-4 border-blue-500'
                                : 'bg-gray-800 text-white border-r-4 border-blue-500'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-gray-900'
                                : 'text-gray-300 hover:text-white'
                          } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <CogIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Paramètres</p>
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' : 'text-gray-400'
                            }`}>Préférences et configuration</p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>

                    <div className={`border-t my-2 ${
                      currentTheme === 0 ? 'border-gray-200' : 'border-gray-700'
                    }`}></div>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active
                              ? 'bg-red-50 text-red-600 border-r-4 border-red-500'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-red-600'
                                : 'text-gray-300 hover:text-red-400'
                          } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group w-full`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div className="text-left">
                            <p>Déconnexion</p>
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' : 'text-gray-400'
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
    </nav>
  );
};

export default Navbar;