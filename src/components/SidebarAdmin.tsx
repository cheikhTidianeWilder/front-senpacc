import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QrCodeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  badge?: string;
}

interface AdminSidebarProps {
  isCollapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const adminMenuItems: MenuItem[] = [
    { name: 'Dashboard', icon: HomeIcon, path: '/administrateur' },
    { name: 'QR Codes', icon: QrCodeIcon, path: '/administrateur/genenerQrcode', badge: '247' },
    { name: 'Médecins', icon: UserGroupIcon, path: '/administrateur/insMedecin', badge: '18' },
    // { name: 'Ajouter Médecin', icon: UserPlusIcon, path: '/admin/users/create' },
    { name: 'Structures', icon: BuildingOfficeIcon, path: '/administrateur/insStructure' },
    { name: 'Chef de Structure', icon: ClipboardDocumentListIcon, path: '/administrateur/chefStructure', badge: '10' },
    // { name: 'Statistiques', icon: ChartBarIcon, path: '/admin/stats' },
    // { name: 'Monitoring', icon: EyeIcon, path: '/admin/monitoring', badge: '2' },
    // { name: 'Notifications', icon: BellIcon, path: '/admin/notifications', badge: '12' },
    // { name: 'Sécurité', icon: ShieldCheckIcon, path: '/admin/security' },
    // { name: 'Maintenance', icon: ServerIcon, path: '/admin/maintenance' },
    // { name: 'Paramètres', icon: Cog6ToothIcon, path: '/admin/settings' },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen shadow-lg z-40 bg-gradient-to-b from-[#00A48B] to-[#004D94] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 border-opacity-20">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img
                className={`transition-all duration-300 ${isCollapsed ? 'h-10 w-10' : 'h-10 w-auto'}`}
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
            {adminMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-300 no-underline group relative
                  ${location.pathname === item.path
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'}`} />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
                {/* Badge pour les notifications/compteurs */}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
                {/* Badge en mode réduit */}
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {parseInt(item.badge) > 99 ? '99+' : item.badge}
                  </span>
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

export default AdminSidebar;