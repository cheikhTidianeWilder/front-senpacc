import React, { useState } from 'react';
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
    setIsCollapsed: (collapsed: boolean) => void;
  }

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Patients', icon: UserGroupIcon, path: '/patients' },
    { name: 'Rendez-vous', icon: CalendarIcon, path: '/appointments' },
    { name: 'Consultations', icon: ClipboardDocumentListIcon, path: '/consultations' },
    { name: 'ECG', icon: HeartIcon, path: '/ecg' },
    { name: 'Statistiques', icon: ChartBarIcon, path: '/statistics' },
    { name: 'Paramètres', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen bg-white dark:bg-dark-sidebar shadow-lg z-40">
      <div
        className={`flex flex-col h-full ${
          isCollapsed ? 'w-20' : 'w-64'
        } relative`}
      >
        {/* Bouton Toggle flottant */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-20 p-2 rounded-full bg-white dark:bg-dark-sidebar shadow-lg hover:bg-senpacc-green/10 dark:hover:bg-transparent text-gray-600 dark:text-gray-400 transition-colors z-50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>

        {/* Logo Section */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <img
                className="h-10 w-auto"
                src="/logo-sen-pacc-ts.png"
                alt="SENPACC Logo"
              />
              {!isCollapsed && (
                <h1 className="text-2xl font-bold">
                  <span className="text-senpacc-green dark:text-senpacc-green-dark">SEN</span>
                  <span className="text-senpacc-blue dark:text-senpacc-blue-dark">PACC</span>
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
                className={`flex items-center px-4 py-3 rounded-lg transition-colors 
                  ${location.pathname === item.path
                    ? 'bg-senpacc-green/10 dark:bg-senpacc-green/5 text-senpacc-green dark:text-senpacc-green-dark'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-senpacc-green/10 dark:hover:bg-transparent hover:text-senpacc-green dark:hover:text-senpacc-green-dark'
                  }`}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
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