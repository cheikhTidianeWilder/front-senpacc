import React, { useState } from 'react';
import { 
  FaUser, 
  FaTint, 
  FaInfinity, 
  FaShoppingBasket,
  FaLightbulb,
  FaEdit,
  FaTrash,
  FaSearch
} from 'react-icons/fa';

const ExplorationPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementsPerPage, setElementsPerPage] = useState(10);

  // Données d'exemple des patients
  const [patients] = useState([
    {
      id: 1,
      prenom: 'samba',
      nom: 'ly',
      gpsn: 'O-',
      age: '15a, 2m, 20j',
      sexe: 'H',
      adresse: 'Diourbel',
      telephone: '750123482'
    },
    {
      id: 2,
      prenom: 'Fatima',
      nom: 'Seck',
      gpsn: 'AB+',
      age: '25a, 7m, 18j',
      sexe: 'F',
      adresse: 'Fogny',
      telephone: '763492799'
    }
  ]);

  // Statistiques des groupes sanguins et sexes
  const stats = {
    homme: 1,
    femme: 1,
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 1,
    'AB-': 0,
    'O+': 0,
    'O-': 1
  };

  // Fonction StatCard à l'intérieur du composant
  const StatCard = ({ icon: Icon, bgColor, title1, count1, title2, count2 }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`${bgColor} h-20 flex items-center justify-center relative`}>
          <Icon className="text-white text-3xl" />
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{count1}</div>
            <div className="text-sm text-gray-600 uppercase">{title1}</div>
          </div>
          <div className="text-center border-l border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{count2}</div>
            <div className="text-sm text-gray-600 uppercase">{title2}</div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction handleAction à l'intérieur du composant
  const handleAction = (action: string, patient: { id: number; prenom: string; nom: string; gpsn: string; age: string; sexe: string; adresse: string; telephone: string; }) => {
    console.log(`Action ${action} pour le patient:`, patient);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Titre */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Exploration Patients</h1>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={FaUser}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            title1="HOMME"
            count1={stats.homme}
            title2="FEMME"
            count2={stats.femme}
          />
          <StatCard
            icon={FaTint}
            bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
            title1="A+"
            count1={stats['A+']}
            title2="A-"
            count2={stats['A-']}
          />
          <StatCard
            icon={FaInfinity}
            bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
            title1="B+"
            count1={stats['B+']}
            title2="B-"
            count2={stats['B-']}
          />
          <StatCard
            icon={FaTint}
            bgColor="bg-gradient-to-br from-red-400 to-red-500"
            title1="AB+"
            count1={stats['AB+']}
            title2="AB-"
            count2={stats['AB-']}
          />
          <StatCard
            icon={FaShoppingBasket}
            bgColor="bg-gradient-to-br from-indigo-600 to-indigo-700"
            title1="O+"
            count1={stats['O+']}
            title2="O-"
            count2={stats['O-']}
          />
        </div>

        {/* Barre de recherche et contrôles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Éléments par page :</span>
              <select
                value={elementsPerPage}
                onChange={(e) => setElementsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des patients */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPSN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients
                  .filter(patient => 
                    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.adresse.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, elementsPerPage)
                  .map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.prenom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.gpsn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.sexe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.adresse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.telephone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('view', patient)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <FaLightbulb className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleAction('edit', patient)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleAction('delete', patient)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Message si aucun résultat */}
        {patients.filter(patient => 
          patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.adresse.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun patient trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationPatients;