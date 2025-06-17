import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
}

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { name: 'Accueil', icon: HomeIcon, path: '/urologie' },
    { name: 'Inscription', icon: UserGroupIcon, path: '/urologie/insPatient' },
    { name: 'Patients', icon: ClipboardDocumentListIcon, path: '/urologie/listePatients' },
    { name: 'Consultations', icon: ClipboardDocumentListIcon, path: '/consultations' },
    { name: 'Rendez-vous', icon: CalendarIcon, path: '/appointments' },
    { name: 'ECG', icon: HeartIcon, path: '/ecg' },
    { name: 'Statistiques', icon: ChartBarIcon, path: '/statistics' },
    { name: 'Paramètres', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen shadow-lg z-40 bg-gradient-to-b from-[#00A48B] to-[#004D94] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
      }`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 border-opacity-20">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img
                className={`transition-all duration-300 ${isCollapsed ? 'h-10 w-10' : 'h-10 w-auto'
                  }`}
                src="/logo-sen-pacc-ts.png"
                alt="SENPACC Logo"
              />
              {!isCollapsed && (
                <h1 className="text-2xl font-bold">
                  <span className="text-white">SEN</span>
                  <span className="text-white">PACC</span>
                </h1>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section avec défilement indépendant */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <nav className="px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'
                  } py-3 rounded-lg transition-all duration-300 no-underline group relative
                  ${location.pathname === item.path
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'
                  }`} />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
                {/* Indicateur actif */}
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;