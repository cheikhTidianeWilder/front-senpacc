import React, { useState, useEffect } from 'react';
import { 
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface NavbarProps {
    isSidebarCollapsed: boolean;
  }

  const Navbar: React.FC<NavbarProps> = ({ isSidebarCollapsed }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <nav 
      className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
        isSidebarCollapsed 
          ? 'left-20 w-[calc(100%-5rem)]' 
          : 'left-64 w-[calc(100%-16rem)]'
      } ${
        isScrolled ? 'bg-white dark:bg-dark-navbar shadow-lg' : ''
      }`}
    >
      <div className="w-full px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Titre de la section */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Service de Cardiologie
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Switch de thème */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-senpacc-green-dark" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Cloche de notification */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-300 transition-colors">
                <BellIcon className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-senpacc-green dark:bg-senpacc-green-dark rounded-full">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Menu déroulant du profil */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-transparent dark:bg-transparent transition-colors">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-senpacc-green dark:ring-senpacc-green-dark"
                  src="/logo-sen-pacc-ts.png"
                  alt="Profile"
                />
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-100">Dr. Nom</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Cardiologue</span>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-dark-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${
                            active 
                              ? 'bg-gray-100 dark:bg-transparent text-senpacc-green dark:text-senpacc-green-dark' 
                              : 'text-gray-700 dark:text-gray-100'
                          } flex items-center px-4 py-2 text-sm`}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          Mon Profil
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={`${
                            active 
                              ? 'bg-gray-100 dark:bg-transparent text-senpacc-green dark:text-senpacc-green-dark' 
                              : 'text-gray-700 dark:text-gray-100'
                          } flex items-center px-4 py-2 text-sm`}
                        >
                          <CogIcon className="h-5 w-5 mr-2" />
                          Paramètres
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/logout"
                          className={`${
                            active 
                              ? 'bg-gray-100 dark:bg-transparent text-senpacc-green dark:text-senpacc-green-dark' 
                              : 'text-gray-700 dark:text-gray-100'
                          } flex items-center px-4 py-2 text-sm`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Déconnexion
                        </a>
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