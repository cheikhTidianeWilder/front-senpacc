import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface NavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void; // Nouvelle prop pour gérer le toggle
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Récupère le thème depuis localStorage ou utilise le thème par défaut
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentTheme') || '0');
    }
    return 0;
  });

  // Définition des 3 thèmes
  const themes = [
    {
      name: 'white',
      displayName: 'Blanc',
      icon: '⚪',
      navbar: 'bg-gradient-to-r from-gray-100 to-white border-b border-gray-200',
      primary: 'from-gray-100 to-white',
      accent: '#6B7280',
      text: 'text-gray-800',
      subtext: 'text-gray-600',
      border: 'border-gray-200',
      body: 'bg-white text-gray-900'
    },
    {
      name: 'black',
      displayName: 'Noir',
      icon: '⚫',
      navbar: 'bg-gradient-to-r from-black to-gray-900',
      primary: 'from-black to-gray-900',
      accent: '#1F2937',
      text: 'text-white',
      subtext: 'text-gray-300',
      border: 'border-gray-800',
      body: 'bg-black text-white'
    },
    {
      name: 'gray',
      displayName: 'Gris',
      icon: '🔘',
      navbar: 'bg-gradient-to-r from-gray-600 to-gray-700',
      primary: 'from-gray-600 to-gray-700',
      accent: '#4B5563',
      text: 'text-white',
      subtext: 'text-gray-200',
      border: 'border-gray-500',
      body: 'bg-gray-500 text-white'
    }
  ];

  const currentThemeConfig = themes[currentTheme];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Supprimer toutes les classes de thème précédentes
    document.body.className = document.body.className
      .replace(/bg-\S+/g, '')
      .replace(/text-\S+/g, '')
      .replace(/theme-\S+/g, '');

    // Appliquer le nouveau thème au body
    document.body.classList.add('transition-all', 'duration-500');

    // Ajouter un style dynamique pour les variables CSS
    const style = document.createElement('style');
    style.id = 'dynamic-theme-style';

    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('dynamic-theme-style');
    if (oldStyle) oldStyle.remove();

    // Appliquer les classes de thème au body
    switch (currentTheme) {
      case 0: // Blanc
        document.body.classList.add('bg-white', 'text-gray-900', 'theme-white');
        style.textContent = `
          :root {
            --primary-color: #F3F4F6;
            --secondary-color: #FFFFFF;
            --accent-color: #6B7280;
          }
          .theme-white * {
            transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
          }
        `;
        break;
      case 1: // Noir
        document.body.classList.add('bg-black', 'text-white', 'theme-black');
        style.textContent = `
          :root {
            --primary-color: #000000;
            --secondary-color: #111827;
            --accent-color: #1F2937;
          }
          .theme-black * {
            transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
          }
        `;
        break;
      case 2: // Gris
        document.body.classList.add('bg-gray-500', 'text-white', 'theme-gray');
        style.textContent = `
          :root {
            --primary-color: #6B7280;
            --secondary-color: #4B5563;
            --accent-color: #4B5563;
          }
          .theme-gray * {
            transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
          }
        `;
        break;
    }

    document.head.appendChild(style);

    // Sauvegarder dans localStorage
    localStorage.setItem('currentTheme', currentTheme.toString());
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => {
      const newTheme = (prev + 1) % 3;
      // Émettre un événement personnalisé pour notifier le changement de thème
      window.dispatchEvent(new Event('themeChanged'));
      return newTheme;
    });
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-30 transition-all duration-500 shadow-lg ${currentThemeConfig.navbar} ${isSidebarCollapsed
          ? 'left-20 w-[calc(100%-5rem)]'
          : 'left-64 w-[calc(100%-16rem)]'
        }`}
    >
      <div className="w-full px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Partie gauche avec bouton toggle */}
          <div className="flex items-center space-x-4">
            {/* Bouton Toggle Sidebar */}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentTheme === 0 
                  ? 'hover:bg-gray-200/50 text-gray-700' 
                  : currentTheme === 1 
                    ? 'hover:bg-gray-800/50 text-gray-300' 
                    : 'hover:bg-gray-600/50 text-gray-200'
              }`}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <Bars3Icon className="h-6 w-6" />
              ) : (
                <XMarkIcon className="h-6 w-6" />
              )}
            </button>

            {/* Titre de la section */}
            <div className="flex items-center space-x-3">
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                currentTheme === 0 ? 'bg-gray-200/50' :
                currentTheme === 1 ? 'bg-gray-800/50' : 'bg-gray-600/50'
              }`}>
                <span className="text-sm font-bold">
                  {currentThemeConfig.icon}
                </span>
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  currentTheme === 0 ? 'text-gray-800' : 'text-white'
                }`}>
                  Service
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
            {/* Switch de thème avec indicateur */}
            <div className="relative">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm border-2 group ${
                  currentTheme === 0 ? 'text-gray-700 hover:text-gray-900 bg-gray-200/20 border-gray-400/30 hover:border-gray-500/50' :
                  currentTheme === 1 ? 'text-gray-300 hover:text-white bg-gray-800/20 border-gray-600/30 hover:border-gray-500/50' :
                  'text-gray-200 hover:text-white bg-gray-600/20 border-gray-400/30 hover:border-gray-300/50'
                }`}
                aria-label="Changer de thème"
                title={`Thème actuel: ${currentThemeConfig.displayName} - Cliquer pour changer`}
              >
                <span className="text-base transform group-hover:scale-110 transition-transform duration-300">
                  {currentThemeConfig.icon}
                </span>
              </button>
              {/* Indicateur d'état avec animation */}
              <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 transition-all duration-300 animate-pulse ${
                currentTheme === 0 ? 'bg-gray-400 border-gray-200' :
                currentTheme === 1 ? 'bg-gray-600 border-black' : 'bg-gray-500 border-gray-300'
              }`}></div>
              {/* Badge avec nom du thème */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                currentTheme === 0 ? 'bg-white text-gray-800 shadow-lg' :
                currentTheme === 1 ? 'bg-black text-white border border-gray-700' : 'bg-gray-600 text-white'
              }`}>
                {currentThemeConfig.displayName}
              </div>
            </div>

            {/* Cloche de notification */}
            <div className="relative">
              <button className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
                currentTheme === 0 ? 'hover:bg-gray-200/20 text-gray-700 hover:text-gray-900' :
                currentTheme === 1 ? 'hover:bg-gray-800/20 text-gray-300 hover:text-white' :
                'hover:bg-gray-600/20 text-gray-200 hover:text-white'
              }`}>
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white rounded-full border-2 shadow-lg animate-pulse ${
                    currentTheme === 0 ? 'bg-red-500 border-gray-200' :
                    currentTheme === 1 ? 'bg-red-500 border-black' :
                    'bg-red-600 border-gray-400'
                  }`}>
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Séparateur vertical */}
            <div className={`h-6 w-px transition-colors duration-300 ${
              currentTheme === 0 ? 'bg-gray-300' :
              currentTheme === 1 ? 'bg-gray-600' : 'bg-gray-400'
            }`}></div>

            {/* Menu déroulant du profil */}
            <Menu as="div" className="relative">
              <Menu.Button className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm group ${
                currentTheme === 0 ? 'hover:bg-gray-200/20' :
                currentTheme === 1 ? 'hover:bg-gray-800/20' :
                'hover:bg-gray-600/20'
              }`}>
                <div className="relative">
                  <img
                    className={`h-8 w-8 rounded-full ring-2 transition-all duration-200 ${
                      currentTheme === 0 ? 'ring-gray-400/50 group-hover:ring-gray-500' :
                      currentTheme === 1 ? 'ring-gray-600 group-hover:ring-gray-500' :
                      'ring-gray-400/50 group-hover:ring-gray-300'
                    }`}
                    src="/logo-sen-pacc-ts.png"
                    alt="Profile"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${
                    currentTheme === 0 ? 'bg-green-500 border-gray-200' :
                    currentTheme === 1 ? 'bg-green-400 border-black' :
                    'bg-green-500 border-gray-300'
                  }`}></div>
                </div>
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    currentTheme === 0 ? 'text-gray-800' : 'text-white'
                  }`}>Dr. Mouhamed Kane</span>
                  <span className={`text-xs transition-colors duration-300 ${currentThemeConfig.subtext}`}>
                    Cardiologue Senior
                  </span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 transition-colors duration-200 ${
                  currentTheme === 0 ? 'text-gray-600 group-hover:text-gray-800' :
                  currentTheme === 1 ? 'text-gray-400 group-hover:text-gray-300' :
                  'text-gray-300 group-hover:text-white'
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
                  currentTheme === 0 ? 'bg-white ring-gray-200' :
                  currentTheme === 1 ? 'bg-gray-900 ring-gray-700' :
                  'bg-gray-700 ring-gray-500'
                }`}>
                  {/* En-tête du menu */}
                  <div className={`px-4 py-3 ${currentThemeConfig.navbar}`}>
                    <div className="flex items-center space-x-3">
                      <img
                        className={`h-10 w-10 rounded-full ring-2 ${
                          currentTheme === 0 ? 'ring-gray-400/50' :
                          currentTheme === 1 ? 'ring-gray-600' :
                          'ring-gray-400/50'
                        }`}
                        src="/logo-sen-pacc-ts.png"
                        alt="Profile"
                      />
                      <div>
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          currentTheme === 0 ? 'text-gray-800' : 'text-white'
                        }`}>Dr. Mouhamed Kane</p>
                        <p className={`text-xs ${currentThemeConfig.subtext}`}>
                          kane.mouhamed@senpacc.sn
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
                                ? 'bg-gray-100 text-gray-800 border-r-4 border-gray-500'
                                : currentTheme === 1
                                  ? 'bg-gray-800 text-white border-r-4 border-gray-600'
                                  : 'bg-gray-600 text-white border-r-4 border-gray-400'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-gray-900'
                                : currentTheme === 1
                                  ? 'text-gray-300 hover:text-white'
                                  : 'text-gray-200 hover:text-white'
                          } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <UserCircleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Mon Profil</p>
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' :
                              currentTheme === 1 ? 'text-gray-400' :
                              'text-gray-300'
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
                                ? 'bg-gray-100 text-gray-800 border-r-4 border-gray-500'
                                : currentTheme === 1
                                  ? 'bg-gray-800 text-white border-r-4 border-gray-600'
                                  : 'bg-gray-600 text-white border-r-4 border-gray-400'
                              : currentTheme === 0
                                ? 'text-gray-700 hover:text-gray-900'
                                : currentTheme === 1
                                  ? 'text-gray-300 hover:text-white'
                                  : 'text-gray-200 hover:text-white'
                          } flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group`}
                        >
                          <CogIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <p>Paramètres</p>
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' :
                              currentTheme === 1 ? 'text-gray-400' :
                              'text-gray-300'
                            }`}>Préférences et configuration</p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>

                    <div className={`border-t my-2 ${
                      currentTheme === 0 ? 'border-gray-200' :
                      currentTheme === 1 ? 'border-gray-700' :
                      'border-gray-500'
                    }`}></div>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={async () => {
                            try {
                              await fetch("http://localhost:3000/api/auth/logout", {
                                method: "GET",
                                credentials: "include", // si tu utilises les cookies
                              });
                              window.location.href = "/login"; // ou redirection vers la page d'accueil
                            } catch (err) {
                              console.error("Erreur de déconnexion :", err);
                            }
                          }}
                          className={`${
                            active
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
                            <p className={`text-xs ${
                              currentTheme === 0 ? 'text-gray-500' :
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
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${
        currentTheme === 0 ? 'bg-gradient-to-r from-transparent via-gray-300 to-transparent' :
        currentTheme === 1 ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' :
        'bg-gradient-to-r from-transparent via-gray-500 to-transparent'
      }`}></div>
    </nav>
  );
};

export default Navbar;