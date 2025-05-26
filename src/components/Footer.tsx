import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logo-sen-pacc-ts.png"
              alt="SENPACC Logo"
              className="h-8 w-auto"
            />
            <span className="text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} SENPACC Cardio. Tous droits réservés.
            </span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <a
                href="/about"
                className="text-gray-500 hover:text-senpacc-green dark:text-gray-400 dark:hover:text-senpacc-green transition-colors"
              >
                À propos
              </a>
              <a
                href="/contact"
                className="text-gray-500 hover:text-senpacc-green dark:text-gray-400 dark:hover:text-senpacc-green transition-colors"
              >
                Contact
              </a>
              <a
                href="/privacy"
                className="text-gray-500 hover:text-senpacc-green dark:text-gray-400 dark:hover:text-senpacc-green transition-colors"
              >
                Confidentialité
              </a>
              <a
                href="/terms"
                className="text-gray-500 hover:text-senpacc-green dark:text-gray-400 dark:hover:text-senpacc-green transition-colors"
              >
                Conditions
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 