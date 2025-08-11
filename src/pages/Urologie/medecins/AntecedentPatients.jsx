// import React, { useEffect, useState } from 'react';

// function AntecedentPatients({ patientId }) {
//   const [antecedents, setAntecedents] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedAntecedent, setSelectedAntecedent] = useState(null);
//   const [newAntecedent, setNewAntecedent] = useState({
//     pathologie: '',
//     type: '',
//     note: ''
//   });

//   // Types d'antécédents disponibles
//   const typesAntecedents = [
//     'Médical',
//     'Chirurgical',
//     'Gynécologique',
//     'Obstétrical',
//     'Familial',
//     'Allergique',
//     'Toxicologique',
//     'Professionnel'
//   ];

//   useEffect(() => {
//     if (patientId) {
//       loadAntecedents();
//     }
//   }, [patientId]);

//   const loadAntecedents = async () => {
//     try {
//       console.log('🔄 Chargement des antécédents pour le patient:', patientId);
      
//       // Utiliser l'endpoint spécifique au patient
//       const response = await fetch(`http://localhost:3000/api/urologie/antecedents/patient/${patientId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });
      
//       console.log('📡 Réponse reçue:', response.status, response.statusText);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Erreur HTTP:', response.status, errorText);
//         throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
//       }
      
//       const data = await response.json();
//       console.log('📊 Données reçues:', data);
      
//       // Gestion robuste de la structure des données
//       let antecedentsData = [];
//       if (data.status === 200 && Array.isArray(data.antecedents)) {
//         antecedentsData = data.antecedents;
//       } else if (Array.isArray(data.data)) {
//         antecedentsData = data.data;
//       } else if (Array.isArray(data)) {
//         antecedentsData = data;
//       } else if (data.antecedents && Array.isArray(data.antecedents)) {
//         antecedentsData = data.antecedents;
//       } else {
//         console.log('⚠️ Structure de données non reconnue, utilisation d\'un tableau vide');
//         antecedentsData = [];
//       }
      
//       console.log('🎯 Antécédents finaux à afficher:', antecedentsData);
//       setAntecedents(antecedentsData);
      
//     } catch (error) {
//       console.error('💥 Erreur lors du chargement des antécédents:', error);
//       setAntecedents([]);
//     }
//   };

//   const handleAddAntecedent = async () => {
//     if (newAntecedent.pathologie && newAntecedent.type) {
//       try {
//         const antecedentData = {
//           patient_id: patientId,
//           pathologie: newAntecedent.pathologie,
//           type: newAntecedent.type,
//           note: newAntecedent.note
//         };
        
//         console.log('📤 Données à envoyer:', antecedentData);
        
//         const response = await fetch('http://localhost:3000/api/urologie/antecedents/ajouter', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body: JSON.stringify(antecedentData),
//         });
        
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('❌ Erreur HTTP:', response.status, errorText);
//           throw new Error(`Erreur lors de l'ajout de l'antécédent: ${response.status} - ${errorText}`);
//         }
        
//         const result = await response.json();
//         console.log('✅ Antécédent ajouté:', result);
        
//         // Recharger la liste des antécédents
//         await loadAntecedents();
        
//         // Réinitialiser le formulaire
//         setNewAntecedent({
//           pathologie: '',
//           type: '',
//           note: ''
//         });
//         setShowAddForm(false);
//       } catch (error) {
//         console.error('Erreur lors de l\'ajout de l\'antécédent:', error);
//         alert('Erreur lors de l\'ajout de l\'antécédent. Veuillez réessayer.');
//       }
//     } else {
//       alert('Veuillez remplir tous les champs obligatoires (pathologie et type)');
//     }
//   };

//   const handleDeleteAntecedent = async (id) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer cet antécédent ?')) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3000/api/urologie/antecedents/${id}/delete`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });
      
//       if (!response.ok) {
//         throw new Error('Erreur lors de la suppression de l\'antécédent');
//       }
      
//       console.log('✅ Antécédent supprimé');
      
//       // Recharger la liste après suppression
//       await loadAntecedents();
//       setSelectedAntecedent(null);
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'antécédent:', error);
//       alert('Erreur lors de la suppression. Veuillez réessayer.');
//     }
//   };

//   const handleSelectAntecedent = (antecedent) => {
//     setSelectedAntecedent(antecedent);
//   };

//   const handleInputChange = (field, value) => {
//     setNewAntecedent(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       'Médical': 'bg-blue-100 text-blue-800',
//       'Chirurgical': 'bg-red-100 text-red-800',
//       'Gynécologique': 'bg-pink-100 text-pink-800',
//       'Obstétrical': 'bg-purple-100 text-purple-800',
//       'Familial': 'bg-green-100 text-green-800',
//       'Allergique': 'bg-orange-100 text-orange-800',
//       'Toxicologique': 'bg-yellow-100 text-yellow-800',
//       'Professionnel': 'bg-gray-100 text-gray-800'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800';
//   };

//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Non définie';
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   // Vérification de la prop patientId
//   if (!patientId) {
//     return (
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Antécédents</h2>
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <div className="text-center text-gray-500">
//             Aucun patient sélectionné
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Liste des antécédents */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
//             <h3 className="text-white text-xl font-bold">Liste des antécédents</h3>
//           </div>
          
//           <div className="p-4">
//             <div className="max-h-64 overflow-y-auto space-y-2">
//               {console.log('🖥️ Rendu - Nombre d\'antécédents:', antecedents.length)}
//               {console.log('🖥️ Rendu - Antécédents:', antecedents)}
              
//               {antecedents.length === 0 ? (
//                 <div className="text-center text-gray-500 py-8">
//                   Aucun antécédent enregistré pour ce patient
//                 </div>
//               ) : (
//                 antecedents.map((antecedent, index) => {
//                   console.log(`🔍 Antécédent ${index}:`, antecedent);
//                   return (
//                     <div
//                       key={antecedent.id || index}
//                       onClick={() => handleSelectAntecedent(antecedent)}
//                       className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                         selectedAntecedent?.id === antecedent.id
//                           ? 'bg-green-100 border-2 border-green-300'
//                           : 'bg-gray-100 hover:bg-gray-200'
//                       }`}
//                     >
//                       <div className="text-sm font-medium text-gray-800">
//                         {antecedent.pathologie}
//                       </div>
//                       <div className="flex items-center justify-between mt-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(antecedent.type)}`}>
//                           {antecedent.type}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {formatDate(antecedent.createdAt)}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
            
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="w-full mt-4 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               Ajouter un antécédent
//             </button>
//           </div>
//         </div>

//         {/* Détails de l'antécédent sélectionné */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
//             <h3 className="text-white text-xl font-bold">Détails de l'antécédent</h3>
//           </div>
          
//           {selectedAntecedent ? (
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">Pathologie</span>
//                   <span className="text-gray-900 text-right max-w-xs">{selectedAntecedent.pathologie}</span>
//                 </div>
                
//                 <hr className="border-gray-200" />
                
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium text-gray-700">Type</span>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedAntecedent.type)}`}>
//                     {selectedAntecedent.type}
//                   </span>
//                 </div>
                
//                 <hr className="border-gray-200" />
                
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium text-gray-700">Date d'ajout</span>
//                   <span className="text-gray-900">{formatDate(selectedAntecedent.createdAt)}</span>
//                 </div>
                
//                 {selectedAntecedent.updatedAt && selectedAntecedent.updatedAt !== selectedAntecedent.createdAt && (
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-gray-700">Dernière modification</span>
//                     <span className="text-gray-900">{formatDate(selectedAntecedent.updatedAt)}</span>
//                   </div>
//                 )}
                
//                 <hr className="border-gray-200" />
                
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">Notes</span>
//                   <span className="text-gray-900 text-right max-w-xs">
//                     {selectedAntecedent.note || 'Aucune note'}
//                   </span>
//                 </div>

//                 {/* Informations sur le service */}
//                 {selectedAntecedent.service && (
//                   <>
//                     <hr className="border-gray-200" />
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-700">Service</span>
//                       <span className="text-gray-900">{selectedAntecedent.service.nom}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
              
//               <button
//                 onClick={() => handleDeleteAntecedent(selectedAntecedent.id)}
//                 className="mt-6 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center w-12 h-12 ml-auto"
//                 title="Supprimer cet antécédent"
//               >
//                 ✕
//               </button>
//             </div>
//           ) : (
//             <div className="p-6 text-center text-gray-500">
//               Sélectionnez un antécédent pour voir les détails
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal d'ajout d'antécédent */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
//             <h3 className="text-lg font-bold mb-4">Ajouter un nouvel antécédent</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Pathologie *
//                 </label>
//                 <input
//                   type="text"
//                   value={newAntecedent.pathologie}
//                   onChange={(e) => handleInputChange('pathologie', e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   placeholder="Ex: Hypertension artérielle, Diabète type 2, Appendicectomie..."
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Type d'antécédent *
//                 </label>
//                 <select
//                   value={newAntecedent.type}
//                   onChange={(e) => handleInputChange('type', e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">Sélectionnez un type</option>
//                   {typesAntecedents.map(type => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes complémentaires
//                 </label>
//                 <textarea
//                   value={newAntecedent.note}
//                   onChange={(e) => handleInputChange('note', e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   rows="4"
//                   placeholder="Précisions, dates, traitements, complications, contexte familial..."
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowAddForm(false);
//                   setNewAntecedent({
//                     pathologie: '',
//                     type: '',
//                     note: ''
//                   });
//                 }}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleAddAntecedent}
//                 disabled={!newAntecedent.pathologie || !newAntecedent.type}
//                 className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//               >
//                 Ajouter
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AntecedentPatients;

import React, { useEffect, useState } from 'react';
import { Heart, Plus, Eye, Trash2, User, FileText, Calendar, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';

function AntecedentPatients({ patientId }) {
  const [antecedents, setAntecedents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAntecedent, setSelectedAntecedent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newAntecedent, setNewAntecedent] = useState({
    pathologie: '',
    type: '',
    note: ''
  });

  // Types d'antécédents disponibles
  const typesAntecedents = [
    'Médical',
    'Chirurgical',
    'Gynécologique',
    'Obstétrical',
    'Familial',
    'Allergique',
    'Toxicologique',
    'Professionnel'
  ];

  useEffect(() => {
    if (patientId) {
      loadAntecedents();
    }
  }, [patientId]);

  const loadAntecedents = async () => {
    try {
      console.log('🔄 Chargement des antécédents pour le patient:', patientId);
      
      const response = await fetch(`http://localhost:3000/api/urologie/antecedents/patient/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('📡 Réponse reçue:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📊 Données reçues:', data);
      
      // Gestion robuste de la structure des données
      let antecedentsData = [];
      if (data.status === 200 && Array.isArray(data.antecedents)) {
        antecedentsData = data.antecedents;
      } else if (Array.isArray(data.data)) {
        antecedentsData = data.data;
      } else if (Array.isArray(data)) {
        antecedentsData = data;
      } else if (data.antecedents && Array.isArray(data.antecedents)) {
        antecedentsData = data.antecedents;
      } else {
        console.log('⚠️ Structure de données non reconnue, utilisation d\'un tableau vide');
        antecedentsData = [];
      }
      
      console.log('🎯 Antécédents finaux à afficher:', antecedentsData);
      setAntecedents(antecedentsData);
      
    } catch (error) {
      console.error('💥 Erreur lors du chargement des antécédents:', error);
      setAntecedents([]);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des antécédents'
      });
    }
  };

  const handleAddAntecedent = async () => {
    if (!newAntecedent.pathologie || !newAntecedent.type) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires (pathologie et type)'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const antecedentData = {
        patient_id: patientId,
        pathologie: newAntecedent.pathologie,
        type: newAntecedent.type,
        note: newAntecedent.note
      };
      
      console.log('📤 Données à envoyer:', antecedentData);
      
      const response = await fetch('http://localhost:3000/api/urologie/antecedents/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(antecedentData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur lors de l'ajout de l'antécédent: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Antécédent ajouté:', result);
      
      setMessage({
        type: 'success',
        text: 'Antécédent ajouté avec succès !'
      });
      
      // Recharger la liste des antécédents
      await loadAntecedents();
      
      // Réinitialiser le formulaire
      setNewAntecedent({
        pathologie: '',
        type: '',
        note: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'antécédent:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'ajout de l\'antécédent. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAntecedent = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet antécédent ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/antecedents/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'antécédent');
      }
      
      console.log('✅ Antécédent supprimé');
      
      setMessage({
        type: 'success',
        text: 'Antécédent supprimé avec succès !'
      });
      
      // Recharger la liste après suppression
      await loadAntecedents();
      setSelectedAntecedent(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'antécédent:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAntecedent = (antecedent) => {
    setSelectedAntecedent(antecedent);
  };

  const handleInputChange = (field, value) => {
    setNewAntecedent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      'Médical': 'bg-blue-100 text-blue-800',
      'Chirurgical': 'bg-red-100 text-red-800',
      'Gynécologique': 'bg-pink-100 text-pink-800',
      'Obstétrical': 'bg-purple-100 text-purple-800',
      'Familial': 'bg-green-100 text-green-800',
      'Allergique': 'bg-orange-100 text-orange-800',
      'Toxicologique': 'bg-yellow-100 text-yellow-800',
      'Professionnel': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIconColor = (type) => {
    const colors = {
      'Médical': 'bg-blue-100',
      'Chirurgical': 'bg-red-100',
      'Gynécologique': 'bg-pink-100',
      'Obstétrical': 'bg-purple-100',
      'Familial': 'bg-green-100',
      'Allergique': 'bg-orange-100',
      'Toxicologique': 'bg-yellow-100',
      'Professionnel': 'bg-gray-100'
    };
    return colors[type] || 'bg-gray-100';
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Non définie';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Champs du formulaire avec icônes colorées
  const formFields = [
    { name: "pathologie", label: "Pathologie *", icon: Heart, type: "text", color: "bg-green-600" },
    { name: "type", label: "Type d'antécédent *", icon: FileText, color: "bg-blue-600", select: true },
    { name: "note", label: "Notes", icon: FileText, color: "bg-purple-600", textarea: true },
  ];

  if (!patientId) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Antécédents</h2>
            <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses antécédents</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-8">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-6xl">
        
        {/* Messages d'état */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="text-green-600 w-5 h-5" />
            ) : (
              <AlertCircle className="text-red-600 w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des antécédents */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Liste des antécédents
              </h3>
            </div>
            
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {console.log('🖥️ Rendu - Nombre d\'antécédents:', antecedents.length)}
                {console.log('🖥️ Rendu - Antécédents:', antecedents)}
                
                {antecedents.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucun antécédent enregistré</p>
                    <p className="text-sm">Ajoutez un nouvel antécédent pour ce patient</p>
                  </div>
                ) : (
                  antecedents.map((antecedent, index) => {
                    console.log(`🔍 Antécédent ${index}:`, antecedent);
                    return (
                      <div
                        key={antecedent.id || index}
                        onClick={() => handleSelectAntecedent(antecedent)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                          selectedAntecedent?.id === antecedent.id
                            ? 'bg-green-100 border-2 border-green-400 shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getTypeIconColor(antecedent.type)}`}>
                              <Heart className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {antecedent.pathologie}
                              </div>
                              <div className="text-sm text-gray-600">
                                {antecedent.note || 'Aucune note'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(antecedent.type)}`}>
                              {antecedent.type}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(antecedent.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                Ajouter un antécédent
              </button>
            </div>
          </div>

          {/* Détails de l'antécédent sélectionné */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Détails de l'antécédent
              </h3>
            </div>
            
            {selectedAntecedent ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Heart className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Pathologie</span>
                    </div>
                    <span className="text-gray-900 font-semibold text-right max-w-xs">{selectedAntecedent.pathologie}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Type</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedAntecedent.type)}`}>
                      {selectedAntecedent.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date d'ajout</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatDate(selectedAntecedent.createdAt)}</span>
                  </div>
                  
                  {selectedAntecedent.updatedAt && selectedAntecedent.updatedAt !== selectedAntecedent.createdAt && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-700">Dernière modification</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{formatDate(selectedAntecedent.updatedAt)}</span>
                    </div>
                  )}
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Notes</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedAntecedent.note || 'Aucune note'}
                    </p>
                  </div>

                  {/* Informations sur le service */}
                  {/* {selectedAntecedent.service && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-700">Service</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{selectedAntecedent.service.nom}</span>
                    </div>
                  )} */}
                </div>
                
                <button
                  onClick={() => handleDeleteAntecedent(selectedAntecedent.id)}
                  className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer cet antécédent"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez un antécédent</p>
                <p className="text-sm">Cliquez sur un antécédent pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'antécédent avec style moderne */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-lg">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Nouvel antécédent
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {formFields.map(({ name, label, icon: Icon, type = "text", color, select, textarea }) => (
                  <div key={name} className={`flex items-center rounded-full overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
                    <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    {select ? (
                      <select
                        name={name}
                        value={newAntecedent[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Sélectionnez un type</option>
                        {typesAntecedents.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    ) : textarea ? (
                      <textarea
                        name={name}
                        value={newAntecedent[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-green-500 h-20 resize-none"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={newAntecedent[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-green-500"
                        required={label.includes('*')}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAntecedent({
                      pathologie: '',
                      type: '',
                      note: ''
                    });
                    setMessage(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
                <button
                  onClick={handleAddAntecedent}
                  disabled={!newAntecedent.pathologie || !newAntecedent.type || loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AntecedentPatients;