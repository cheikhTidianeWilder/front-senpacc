// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Info, Folder, FileText, TestTube, File,
//   Calendar, Clock, Map
// } from 'lucide-react';

// function MedicalNavigationMenu() {
//   const [activeTab, setActiveTab] = useState('infos');
//   const navigate = useNavigate();

//   const menuItems = [
//     { name: 'Information', icon: Info, path: 'infos' },
//     { name: 'Dossier', icon: Folder, path: 'listePatients' },
//     { name: 'Ordonnance', icon: FileText, path: 'ordonnance' },
//     { name: 'Certificats', icon: File, path: 'certificats' },
//     { name: 'Rendez-Vous', icon: Calendar, path: 'rendez-vous' },
//     { name: 'Antécédents', icon: Clock, path: 'antecedents' },
//   ];

//   const handleNavigation = (path) => {
//     setActiveTab(path);
//     navigate(`/urologie/${path}`);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-400 via-blue-300 to-green-300 px-4 py-2 shadow-md overflow-x-auto">
//       <div className="flex space-x-2 whitespace-nowrap">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.name}
//               onClick={() => handleNavigation(item.path)}
//               className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition ${
//                 activeTab === item.path
//                   ? 'bg-white text-blue-700 font-semibold shadow-sm'
//                   : 'text-white hover:bg-white hover:text-blue-600'
//               }`}
//             >
//               <Icon size={16} />
//               <span>{item.name}</span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

// export default MedicalNavigationMenu;


import React from 'react';

function MedicalNavigationMenu({ patient, onNavigate, activeTab }) {
    const menuItems = [
        { id: 'patient-info', label: 'Information', icon: '👤' },
        { id: 'releves', label: 'Relevés', icon: '📋' },
        { id: 'consultations', label: 'Consultations', icon: '🩺' },
        { id: 'hospitalisations', label: 'Hospitalisations', icon: '🏥' },
        { id: 'antecedents', label: 'antecedents', icon: '📋' },
        { id: 'ordonnance', label: 'ordonnances', icon: '🏥' },
        { id: 'RDV', label: 'rendezvous', icon: '🏥' },
        { id: 'para', label: 'para', icon: '🏥' },




    ];

    return (
        <div className="medical-navigation-menu">
            <nav>
                <ul style={{
                    display: 'flex',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#f8f9fa'
                }}>
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    padding: '12px 20px',
                                    border: 'none',
                                    background: activeTab === item.id ? '#007bff' : 'transparent',
                                    color: activeTab === item.id ? 'white' : '#333',
                                    cursor: 'pointer',
                                    borderRadius: '4px 4px 0 0',
                                    marginRight: '5px',
                                    fontSize: '14px',
                                    fontWeight: activeTab === item.id ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== item.id) {
                                        e.target.style.backgroundColor = '#e9ecef';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== item.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {item.icon} {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default MedicalNavigationMenu;