import React from 'react';
import Card from '../../components/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Accueil: React.FC = () => {
  // Options communes pour les graphiques - taille réduite
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
        },
      },
    },
  };

  // Données pour le graphique linéaire - Activité du service
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Consultations',
        data: [120, 135, 148, 142, 156, 163],
        borderColor: document.documentElement.classList.contains('dark') ? '#00c4bc' : '#00A19C',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(0, 196, 188, 0.2)' : 'rgba(0, 161, 156, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Interventions',
        data: [45, 52, 38, 61, 48, 55],
        borderColor: document.documentElement.classList.contains('dark') ? '#1e88e5' : '#1565C0',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(30, 136, 229, 0.2)' : 'rgba(21, 101, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Hospitalisations',
        data: [28, 34, 25, 42, 31, 38],
        borderColor: document.documentElement.classList.contains('dark') ? '#ff6b35' : '#FF5722',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 87, 34, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Données pour le graphique en barres - Répartition hebdomadaire
  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
    datasets: [
      {
        label: 'Patients consultés',
        data: [25, 32, 28, 35, 22],
        backgroundColor: document.documentElement.classList.contains('dark') ? '#00c4bc' : 'rgba(0, 161, 156, 0.8)',
      },
    ],
  };

  // Données pour le graphique en donut - Pathologies principales
  const doughnutData = {
    labels: ['Cancer prostate', 'Lithiase urinaire', 'Infections urinaires', 'Incontinence', 'Autres'],
    datasets: [
      {
        data: [35, 25, 15, 12, 13],
        backgroundColor: [
          document.documentElement.classList.contains('dark') ? '#00c4bc' : 'rgba(0, 161, 156, 0.8)',
          document.documentElement.classList.contains('dark') ? '#1e88e5' : 'rgba(21, 101, 192, 0.8)',
          document.documentElement.classList.contains('dark') ? '#ff6b35' : 'rgba(255, 87, 34, 0.8)',
          document.documentElement.classList.contains('dark') ? '#00a3a3' : 'rgba(0, 161, 156, 0.6)',
          document.documentElement.classList.contains('dark') ? '#1976d2' : 'rgba(21, 101, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-4 ml-8">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-senpacc-green dark:text-senpacc-green-dark">163</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Patients ce mois</div>
        </Card>
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">55</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Interventions</div>
        </Card>
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-senpacc-green dark:text-senpacc-green-dark">38</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hospitalisations</div>
        </Card>
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-senpacc-blue dark:text-senpacc-blue-dark">18</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Patients en cours</div>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card title="Évolution de l'activité du service">
          <div className="h-60">
            <Line options={commonOptions} data={lineData} />
          </div>
        </Card>
        <Card title="Répartition hebdomadaire des consultations">
          <div className="h-60">
            <Bar options={commonOptions} data={barData} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card title="Répartition des pathologies">
          <div className="h-60">
            <Doughnut 
              options={{
                ...commonOptions,
                cutout: '70%',
              }} 
              data={doughnutData}
            />
          </div>
        </Card>
        <Card title="Prochaines interventions">
          <div className="space-y-3">
            {[
              { patient: 'Patient A.B.', intervention: 'Prostatectomie', heure: '08:30' },
              { patient: 'Patient C.D.', intervention: 'Lithotritie', heure: '10:15' },
              { patient: 'Patient E.F.', intervention: 'Cystoscopie', heure: '14:00' },
              { patient: 'Patient G.H.', intervention: 'Résection transurétrale', heure: '16:30' },
            ].map((rdv, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{rdv.patient}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{rdv.intervention}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{rdv.heure}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Accueil;



// import React, { useState } from 'react';
// import {
//   Home,
//   Users,
//   Calendar,
//   FileText,
//   BookOpen,
//   Building2,
//   ChevronDown,
//   ChevronRight,
//   Heart,
//   Activity,
//   Menu,
//   X,
//   BarChart3,
//   Settings
// } from 'lucide-react';

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
//   const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
//   const [activeItem, setActiveItem] = useState('accueil');

//   const toggleMenu = (menuId: string) => {
//     setExpandedMenus(prev => 
//       prev.includes(menuId) 
//         ? prev.filter(id => id !== menuId)
//         : [...prev, menuId]
//     );
//   };

//   const menuItems = [
//     {
//       id: 'accueil',
//       label: 'Accueil',
//       icon: Home,
//       href: '/urologie',
//       badge: 'Info'
//     },
//     {
//       id: 'patients',
//       label: 'Patients',
//       icon: Users,
//       href: '/urologie/listePatients'
//     },
//     {
//       id: 'consultation',
//       label: 'Consultation',
//       icon: FileText,
//       href: '/consultations'
//     },
//     {
//       id: 'registre',
//       label: 'Registre',
//       icon: BookOpen,
//       href: '/registre'
//     },
//     {
//       id: 'hospitalisation',
//       label: 'Hospitalisation',
//       icon: Building2,
//       href: '/hospitalisation',
//       hasSubmenu: true,
//       subItems: [
//         { id: 'admissions', label: 'Admissions', href: '/hospitalisation/admissions' },
//         { id: 'chambres', label: 'Chambres', href: '/hospitalisation/chambres' },
//         { id: 'sortie', label: 'Sortie', href: '/hospitalisation/sortie' }
//       ]
//     },
//     {
//       id: 'agenda',
//       label: 'Agenda',
//       icon: Calendar,
//       href: '/appointments'
//     },
//     {
//       id: 'ecg',
//       label: 'ECG',
//       icon: Heart,
//       href: '/ecg'
//     },
//     {
//       id: 'statistiques',
//       label: 'Statistiques',
//       icon: BarChart3,
//       href: '/statistics'
//     },
//     {
//       id: 'parametres',
//       label: 'Paramètres',
//       icon: Settings,
//       href: '/settings'
//     }
//   ];

//   return (
//     <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-2xl transition-all duration-300 ease-in-out z-40 ${
//       isCollapsed ? 'w-20' : 'w-64'
//     }`}>
      
//       {/* Header avec toggle intégré */}
//       <div className="flex items-center justify-between p-4 border-b border-blue-400/30">
//         <div className="flex items-center space-x-3">
//           <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
//             <Heart className="h-6 w-6 text-white" />
//           </div>
//           {!isCollapsed && (
//             <div>
//               <h1 className="text-lg font-bold">Doctor's Help</h1>
//               <p className="text-xs text-blue-100">SENPACC - Urologie</p>
//             </div>
//           )}
//         </div>
        
//         <button
//           onClick={onToggle}
//           className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
//         >
//           {isCollapsed ? (
//             <Menu className="h-4 w-4" />
//           ) : (
//             <X className="h-4 w-4" />
//           )}
//         </button>
//       </div>

//       {/* Section badge "DOCTOR'S HELP" comme dans l'image */}
//       {!isCollapsed && (
//         <div className="px-4 py-3 bg-blue-600/50">
//           <div className="bg-blue-700/30 rounded-lg px-3 py-2 border border-blue-400/20">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-bold text-blue-100 tracking-wider">DOCTOR'S HELP</span>
//               <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">SEN-PACC</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 py-4">
//         <div className="px-3">
//           <ul className="space-y-1">
//             {menuItems.map((item) => (
//               <li key={item.id}>
//                 <div>
//                   <button
//                     onClick={() => {
//                       setActiveItem(item.id);
//                       if (item.hasSubmenu) {
//                         toggleMenu(item.id);
//                       }
//                     }}
//                     className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${
//                       activeItem === item.id
//                         ? 'bg-white/20 text-white shadow-lg border-l-4 border-white ml-1'
//                         : 'text-blue-100 hover:bg-white/10 hover:text-white'
//                     }`}
//                     title={isCollapsed ? item.label : undefined}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <item.icon className={`h-5 w-5 ${
//                         activeItem === item.id ? 'text-white' : 'text-blue-200'
//                       } group-hover:text-white transition-colors`} />
//                       {!isCollapsed && (
//                         <div className="flex items-center justify-between w-full">
//                           <span className="font-medium">{item.label}</span>
//                           {item.badge && (
//                             <span className="bg-white/20 text-xs px-2 py-1 rounded text-blue-100">
//                               {item.badge}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
                    
//                     {!isCollapsed && item.hasSubmenu && (
//                       <div className={`transition-transform duration-200 ${
//                         expandedMenus.includes(item.id) ? 'rotate-90' : ''
//                       }`}>
//                         <ChevronRight className="h-4 w-4" />
//                       </div>
//                     )}
//                   </button>
                  
//                   {/* Sous-menu */}
//                   {!isCollapsed && item.hasSubmenu && expandedMenus.includes(item.id) && (
//                     <ul className="mt-2 ml-6 space-y-1">
//                       {item.subItems?.map((subItem) => (
//                         <li key={subItem.id}>
//                           <button
//                             onClick={() => setActiveItem(subItem.id)}
//                             className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
//                               activeItem === subItem.id
//                                 ? 'bg-white/15 text-white'
//                                 : 'text-blue-200 hover:bg-white/10 hover:text-white'
//                             }`}
//                           >
//                             <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-3" />
//                             {subItem.label}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </nav>

//       {/* Section stats en bas - comme dans l'image */}
//       {!isCollapsed && (
//         <div className="p-4 border-t border-blue-400/30">
//           <div className="space-y-3">
//             {/* Première stat */}
//             <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="text-lg font-bold text-white">250</span>
//                   <p className="text-xs text-blue-200">Patients totaux</p>
//                 </div>
//                 <div className="bg-white/20 p-2 rounded-lg">
//                   <Users className="h-4 w-4 text-white" />
//                 </div>
//               </div>
//             </div>
            
//             {/* Deuxième stat */}
//             <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="text-lg font-bold text-white">24</span>
//                   <p className="text-xs text-blue-200">Aujourd'hui</p>
//                 </div>
//                 <div className="bg-white/20 p-2 rounded-lg">
//                   <Activity className="h-4 w-4 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Indicateur d'état collapsed */}
//       {isCollapsed && (
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//           <div className="flex flex-col space-y-2 items-center">
//             <div className="w-8 h-1 bg-white/40 rounded-full" />
//             <div className="w-6 h-1 bg-white/60 rounded-full" />
//             <div className="w-4 h-1 bg-white/80 rounded-full" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Page d'accueil intégrée avec le nouveau sidebar
// const AccueilPage = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   // Données pour les graphiques (simplifiées pour la démo)
//   const statsCards = [
//     { value: '163', label: 'Patients ce mois', color: 'text-emerald-600' },
//     { value: '55', label: 'Interventions', color: 'text-blue-600' },
//     { value: '38', label: 'Hospitalisations', color: 'text-emerald-600' },
//     { value: '18', label: 'Patients en cours', color: 'text-blue-600' }
//   ];

//   const interventions = [
//     { patient: 'Patient A.B.', intervention: 'Prostatectomie', heure: '08:30' },
//     { patient: 'Patient C.D.', intervention: 'Lithotritie', heure: '10:15' },
//     { patient: 'Patient E.F.', intervention: 'Cystoscopie', heure: '14:00' },
//     { patient: 'Patient G.H.', intervention: 'Résection transurétrale', heure: '16:30' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar 
//         isCollapsed={isSidebarCollapsed}
//         onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//       />
      
//       {/* Contenu principal */}
//       <div className={`transition-all duration-300 ${
//         isSidebarCollapsed ? 'ml-20' : 'ml-64'
//       }`}>
//         <div className="p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">
//               Tableau de Bord - Service d'Urologie
//             </h1>
//             <p className="text-gray-600">
//               Bienvenue Dr. Mouhamed Kane - {new Date().toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </p>
//           </div>

//           {/* Statistiques rapides */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             {statsCards.map((stat, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <div className={`text-3xl font-bold ${stat.color} mb-2`}>
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Graphiques et contenu */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Graphique d'évolution */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Évolution de l'activité du service
//               </h3>
//               <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
//                   <p>Graphique Chart.js ici</p>
//                 </div>
//               </div>
//             </div>

//             {/* Prochaines interventions */}
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Prochaines interventions
//               </h3>
//               <div className="space-y-3">
//                 {interventions.map((rdv, index) => (
//                   <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <div>
//                       <div className="font-medium text-sm text-gray-900">{rdv.patient}</div>
//                       <div className="text-xs text-gray-600">{rdv.intervention}</div>
//                     </div>
//                     <div className="text-sm text-blue-600 font-medium">{rdv.heure}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Graphiques supplémentaires */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Répartition hebdomadaire des consultations
//               </h3>
//               <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
//                   <p>Graphique en barres ici</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Répartition des pathologies
//               </h3>
//               <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
//                   <p>Graphique donut ici</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccueilPage;