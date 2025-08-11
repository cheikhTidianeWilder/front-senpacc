// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   HomeIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   ClipboardDocumentListIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
//   HeartIcon,
// } from '@heroicons/react/24/outline';

// interface MenuItem {
//   name: string;
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//   path: string;
// }

// interface SidebarProps {
//   isCollapsed: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
//   const location = useLocation();

//   const menuItems: MenuItem[] = [
//     { name: 'Accueil', icon: HomeIcon, path: '/urologie' },
//     { name: 'Inscription', icon: UserGroupIcon, path: '/urologie/insPatient' },
//     { name: 'Patients', icon: ClipboardDocumentListIcon, path: '/urologie/listePatients' },
//     { name: 'Consultations', icon: ClipboardDocumentListIcon, path: '/urologie/infos' },
//     { name: 'Hospitalisation', icon: CalendarIcon, path: '/hospitalisation' },
//     { name: 'Statistiques', icon: ChartBarIcon, path: '/statistics' },
//   ];

//   return (
//     <div className={`fixed top-0 left-0 h-screen shadow-lg z-40 bg-gradient-to-b from-[#00A48B] to-[#004D94] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
//       }`}>
//       <div className="flex flex-col h-full">
//         {/* Logo Section */}
//         <div className="flex-shrink-0 p-4 border-b border-gray-200 border-opacity-20">
//           <div className="flex items-center justify-center">
//             <div className="flex items-center space-x-2">
//               <img
//                 className={`transition-all duration-300 ${isCollapsed ? 'h-10 w-10' : 'h-10 w-auto'
//                   }`}
//                 src="/logo-sen-pacc-ts.png"
//                 alt="SENPACC Logo"
//               />
//               {!isCollapsed && (
//                 <h1 className="text-2xl font-bold">
//                   <span className="text-white">SEN</span>
//                   <span className="text-white">PACC</span>
//                 </h1>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Navigation Section avec défilement indépendant */}
//         <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
//           <nav className="px-2 py-4 space-y-2">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'
//                   } py-3 rounded-lg transition-all duration-300 no-underline group relative
//                   ${location.pathname === item.path
//                     ? 'bg-white/20 text-white font-semibold'
//                     : 'text-white/80 hover:bg-white/10 hover:text-white'
//                   }`}
//                 title={isCollapsed ? item.name : ''}
//               >
//                 <item.icon className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'
//                   }`} />
//                 {!isCollapsed && (
//                   <span className="ml-3 whitespace-nowrap">{item.name}</span>
//                 )}
//                 {/* Indicateur actif */}
//                 {location.pathname === item.path && (
//                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
//                 )}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

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
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

interface SubMenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path?: string;
  hasSubMenu?: boolean;
  subMenuItems?: SubMenuItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const menuItems: MenuItem[] = [
    { name: 'Accueil', icon: HomeIcon, path: '/urologie' },
    { name: 'Inscription', icon: UserGroupIcon, path: '/urologie/insPatient' },
    { name: 'Patients', icon: ClipboardDocumentListIcon, path: '/urologie/listePatients' },
    { name: 'Consultations', icon: ClipboardDocumentListIcon, path: '/urologie/infos' },
    { 
      name: 'Secteurs / Lits', 
      icon: CalendarIcon, 
      hasSubMenu: true,
      subMenuItems: [
        { name: 'Gestion des chambres', icon: BuildingOfficeIcon, path: '/urologie/chambre' },
        { name: 'Gestion des lits', icon: CubeIcon, path: '/urologie/lit' }
      ]
    },
    { name: 'Statistiques', icon: ChartBarIcon, path: '/urologie/stats' },
  ];

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubMenuActive = (item: MenuItem) => {
    if (!item.subMenuItems) return false;
    return item.subMenuItems.some(subItem => isPathActive(subItem.path));
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedMenus.includes(item.name);
    const hasActiveSubItem = isSubMenuActive(item);

    if (item.hasSubMenu) {
      return (
        <div key={item.name} className="space-y-1">
          {/* Menu principal avec sous-menu */}
          <button
            onClick={() => toggleSubMenu(item.name)}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            } py-3 rounded-lg transition-all duration-300 group relative text-white border-none outline-none focus:outline-none
            ${hasActiveSubItem || isExpanded
              ? 'bg-white/20 font-semibold'
              : 'bg-transparent hover:bg-white/10'
            }`}
            style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: hasActiveSubItem || isExpanded ? 'rgba(255,255,255,0.2)' : 'transparent' }}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon className={`flex-shrink-0 transition-all duration-300 ${
              isCollapsed ? 'w-7 h-7' : 'w-6 h-6'
            }`} style={{ color: 'white' }} />
            {!isCollapsed && (
              <>
                <span className="ml-3 whitespace-nowrap flex-1 text-left" style={{ color: 'white' }}>{item.name}</span>
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" style={{ color: 'white' }} />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" style={{ color: 'white' }} />
                )}
              </>
            )}
            {/* Indicateur actif pour le menu principal */}
            {hasActiveSubItem && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
            )}
          </button>

          {/* Sous-menu */}
          {isExpanded && !isCollapsed && item.subMenuItems && (
            <div className="ml-4 space-y-1 border-l border-white/20 pl-4">
              {item.subMenuItems.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 no-underline group relative
                  ${isPathActive(subItem.path)
                    ? 'bg-white/30 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <subItem.icon className="w-5 h-5 flex-shrink-0 text-white" />
                  <span className="ml-3 whitespace-nowrap text-sm text-white">{subItem.name}</span>
                  {/* Indicateur actif pour les sous-éléments */}
                  {isPathActive(subItem.path) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Tooltip pour mode collapsed */}
          {isCollapsed && (
            <div className="absolute left-20 top-0 invisible group-hover:visible bg-gray-800 text-white p-2 rounded-md shadow-lg z-50 whitespace-nowrap">
              <div className="font-semibold text-white">{item.name}</div>
              {item.subMenuItems && (
                <div className="mt-1 space-y-1">
                  {item.subMenuItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className="block text-sm hover:text-blue-300 no-underline text-white"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Menu normal sans sous-menu
    return (
      <Link
        key={item.name}
        to={item.path!}
        className={`flex items-center ${
          isCollapsed ? 'justify-center px-2' : 'px-4'
        } py-3 rounded-lg transition-all duration-300 no-underline group relative
        ${isPathActive(item.path!)
          ? 'bg-white/20 text-white font-semibold'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
        title={isCollapsed ? item.name : ''}
      >
        <item.icon className={`flex-shrink-0 transition-all duration-300 text-white ${
          isCollapsed ? 'w-7 h-7' : 'w-6 h-6'
        }`} />
        {!isCollapsed && (
          <span className="ml-3 whitespace-nowrap text-white">{item.name}</span>
        )}
        {/* Indicateur actif */}
        {isPathActive(item.path!) && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
        )}
      </Link>
    );
  };

  return (
    <div className={`fixed top-0 left-0 h-screen shadow-lg z-40 bg-gradient-to-b from-[#00A48B] to-[#004D94] transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 border-opacity-20">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img
                className={`transition-all duration-300 ${
                  isCollapsed ? 'h-10 w-10' : 'h-10 w-auto'
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
            {menuItems.map(renderMenuItem)}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;