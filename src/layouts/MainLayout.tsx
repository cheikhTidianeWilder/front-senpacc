import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface MainLayoutProps {
    children: ReactNode;
  }
  
  const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//     // Forcer le recalcul du layout au chargement
//   useEffect(() => {
//     const forceReflow = () => {
//       window.dispatchEvent(new Event('resize'));
//     };
//     // Attendre que le DOM soit complètement chargé
//     setTimeout(forceReflow, 100);
//     setTimeout(forceReflow, 500);
//   }, []);
  
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <div className={`min-h-screen ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          <Navbar isSidebarCollapsed={isSidebarCollapsed} />
          <main 
            id="main-content"
            className="relative overflow-y-auto pt-16 bg-gray-50 dark:bg-dark min-h-screen"
          >
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  };

export default MainLayout; 