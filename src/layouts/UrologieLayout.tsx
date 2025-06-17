// src/layouts/UrologieLayout.tsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const UrologieLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentTheme') || '0');
    }
    return 0;
  });

  const themes = [
    {
      name: 'white',
      displayName: 'Blanc',
      mainBg: 'bg-gray-50',
      contentBg: 'bg-white',
      text: 'text-gray-900',
      cardBg: 'bg-white',
      borderColor: 'border-gray-200',
    },
    {
      name: 'black',
      displayName: 'Noir',
      mainBg: 'bg-gray-900',
      contentBg: 'bg-black',
      text: 'text-white',
      cardBg: 'bg-gray-800',
      borderColor: 'border-gray-700',
    },
    {
      name: 'gray',
      displayName: 'Gris',
      mainBg: 'bg-gray-600',
      contentBg: 'bg-gray-700',
      text: 'text-white',
      cardBg: 'bg-gray-700',
      borderColor: 'border-gray-500',
    }
  ];

  const currentThemeConfig = themes[currentTheme];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Écouter les changements de thème depuis le Navbar
  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = parseInt(localStorage.getItem('currentTheme') || '0');
      setCurrentTheme(newTheme);
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Écouter un événement personnalisé pour les changements dans la même fenêtre
    window.addEventListener('themeChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleStorageChange);
    };
  }, []);

  return (
    <div className={`flex h-screen transition-all duration-500 ${currentThemeConfig.mainBg} ${currentThemeConfig.text}`}>
      {/* Sidebar sans setIsCollapsed */}
      <Sidebar isCollapsed={isCollapsed} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar avec la fonction toggleSidebar */}
        <Navbar 
          isSidebarCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar}
        />

        {/* Main content avec les bonnes marges et le thème appliqué */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        } mt-16`}>
          <div className={`min-h-full p-6 ${currentThemeConfig.mainBg}`}>
            {/* Wrapper pour le contenu avec le fond approprié */}
            <div className={`${currentThemeConfig.contentBg} rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]`}>
              <Outlet />
            </div>
          </div>
        </main>
        
        {/* <Footer/> */}
      </div>

      {/* Style global pour les éléments enfants */}
      <style>{`
        .theme-white {
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
          --card-text: #111827;
          --card-hover: #f9fafb;
        }
        
        .theme-black {
          --card-bg: #1f2937;
          --card-border: #374151;
          --card-text: #f3f4f6;
          --card-hover: #111827;
        }
        
        .theme-gray {
          --card-bg: #4b5563;
          --card-border: #6b7280;
          --card-text: #f3f4f6;
          --card-hover: #374151;
        }
        
        /* Appliquer les styles aux cards et composants enfants */
        .card {
          background-color: var(--card-bg);
          border-color: var(--card-border);
          color: var(--card-text);
        }
        
        .card:hover {
          background-color: var(--card-hover);
        }
        
        /* Tables */
        table {
          color: inherit;
        }
        
        table thead {
          background-color: var(--card-hover);
          border-color: var(--card-border);
        }
        
        table tbody tr {
          border-color: var(--card-border);
        }
        
        table tbody tr:hover {
          background-color: var(--card-hover);
        }
        
        /* Inputs et formulaires */
        input, select, textarea {
          background-color: var(--card-bg);
          border-color: var(--card-border);
          color: var(--card-text);
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: #3b82f6;
          background-color: var(--card-bg);
        }
        
        /* Boutons */
        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-secondary {
          background-color: var(--card-hover);
          color: var(--card-text);
          border-color: var(--card-border);
        }
      `}</style>
    </div>
  );
};

export default UrologieLayout;