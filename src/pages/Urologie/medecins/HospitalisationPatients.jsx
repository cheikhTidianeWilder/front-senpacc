// import React, { useEffect, useState } from 'react';
// import { Building2, Plus, Eye, Trash2, User, FileText, Calendar, Clock, X, CheckCircle, AlertCircle, MapPin, Activity, Users, ClipboardList } from 'lucide-react';

// function HospitalisationPatients({ patientId }) {
//   const [hospitalisations, setHospitalisations] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedHospitalisation, setSelectedHospitalisation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [newHospitalisation, setNewHospitalisation] = useState({
//     motif: '',
//     dateEntree: '',
//     dateSortie: '',
//     statut: 'en cours',
//     examensclinique: '',
//     habitudeVie: '',
//     conclusionExamensclinique: '',
//     note: ''
//   });

//   // Statuts d'hospitalisation disponibles
//   const statutsHospitalisation = [
//     'en cours',
//     'terminee'
//   ];

//   useEffect(() => {
//     if (patientId) {
//       loadHospitalisations();
//     }
//   }, [patientId]);

//   const loadHospitalisations = async () => {
//     try {
//       console.log('🔄 Chargement des hospitalisations pour le patient:', patientId);

//       const response = await fetch(`http://localhost:3000/api/urologie/hospitalisations/patient/${patientId}`, {
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
//       let hospitalisationsData = [];
//       if (data.success && Array.isArray(data.hospitalisations)) {
//         hospitalisationsData = data.hospitalisations;
//       } else if (Array.isArray(data.data)) {
//         hospitalisationsData = data.data;
//       } else if (Array.isArray(data)) {
//         hospitalisationsData = data;
//       } else if (data.hospitalisations && Array.isArray(data.hospitalisations)) {
//         hospitalisationsData = data.hospitalisations;
//       } else {
//         console.log('⚠️ Structure de données non reconnue, utilisation d\'un tableau vide');
//         hospitalisationsData = [];
//       }

//       console.log('🎯 Hospitalisations finales à afficher:', hospitalisationsData);
//       setHospitalisations(hospitalisationsData);

//     } catch (error) {
//       console.error('💥 Erreur lors du chargement des hospitalisations:', error);
//       setHospitalisations([]);
//       setMessage({
//         type: 'error',
//         text: 'Erreur lors du chargement des hospitalisations'
//       });
//     }
//   };

//   const handleAddHospitalisation = async () => {
//     if (!newHospitalisation.motif || !newHospitalisation.dateEntree || !newHospitalisation.dateSortie) {
//       setMessage({
//         type: 'error',
//         text: 'Veuillez remplir tous les champs obligatoires (motif, date d\'entrée, date de sortie)'
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const hospitalisationData = {
//         patient_id: patientId,
//         date_entree: newHospitalisation.dateEntree,
//         date_sortie: newHospitalisation.dateSortie,
//         statut: newHospitalisation.statut,
//         motif: newHospitalisation.motif,
//         examensclinique: newHospitalisation.examensclinique,
//         habitudeVie: newHospitalisation.habitudeVie,
//         conclusionExamensclinique: newHospitalisation.conclusionExamensclinique,
//         note: newHospitalisation.note
//       };

//       console.log('📤 Données à envoyer:', hospitalisationData);

//       const response = await fetch('http://localhost:3000/api/urologie/hospitalisations/ajouter', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(hospitalisationData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Erreur HTTP:', response.status, errorText);
//         throw new Error(`Erreur lors de l'ajout de l'hospitalisation: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('✅ Hospitalisation ajoutée:', result);

//       setMessage({
//         type: 'success',
//         text: 'Hospitalisation ajoutée avec succès !'
//       });

//       // Recharger la liste des hospitalisations
//       await loadHospitalisations();

//       // Réinitialiser le formulaire
//       setNewHospitalisation({
//         motif: '',
//         dateEntree: '',
//         dateSortie: '',
//         statut: 'en cours',
//         examensclinique: '',
//         habitudeVie: '',
//         conclusionExamensclinique: '',
//         note: ''
//       });
//       setShowAddForm(false);
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout de l\'hospitalisation:', error);
//       setMessage({
//         type: 'error',
//         text: 'Erreur lors de l\'ajout de l\'hospitalisation. Veuillez réessayer.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteHospitalisation = async (id) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer cette hospitalisation ?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3000/api/urologie/hospitalisations/${id}/delete`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         throw new Error('Erreur lors de la suppression de l\'hospitalisation');
//       }

//       console.log('✅ Hospitalisation supprimée');

//       setMessage({
//         type: 'success',
//         text: 'Hospitalisation supprimée avec succès !'
//       });

//       // Recharger la liste après suppression
//       await loadHospitalisations();
//       setSelectedHospitalisation(null);
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'hospitalisation:', error);
//       setMessage({
//         type: 'error',
//         text: 'Erreur lors de la suppression. Veuillez réessayer.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectHospitalisation = (hospitalisation) => {
//     setSelectedHospitalisation(hospitalisation);
//   };

//   const handleInputChange = (field, value) => {
//     setNewHospitalisation(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const getStatutColor = (statut) => {
//     const colors = {
//       'en cours': 'bg-orange-100 text-orange-800',
//       'terminee': 'bg-green-100 text-green-800'
//     };
//     return colors[statut] || 'bg-gray-100 text-gray-800';
//   };

//   const getStatutIconColor = (statut) => {
//     const colors = {
//       'en cours': 'bg-orange-100',
//       'terminee': 'bg-green-100'
//     };
//     return colors[statut] || 'bg-gray-100';
//   };

//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Non définie';
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const calculerDureeHospitalisation = (dateEntree, dateSortie) => {
//     if (!dateEntree) return 'Non définie';
//     if (!dateSortie) return 'En cours';

//     try {
//       const entree = new Date(dateEntree);
//       const sortie = new Date(dateSortie);
//       const diffTime = Math.abs(sortie - entree);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
//     } catch (error) {
//       return 'Erreur de calcul';
//     }
//   };

//   // Champs du formulaire avec icônes colorées
//   const formFields = [
//     { name: "motif", label: "Motif d'hospitalisation *", icon: Building2, type: "text", color: "bg-blue-600" },
//     { name: "dateEntree", label: "Date d'entrée *", icon: Calendar, type: "date", color: "bg-green-600" },
//     { name: "dateSortie", label: "Date de sortie *", icon: Calendar, type: "date", color: "bg-red-600" },
//     { name: "statut", label: "Statut", icon: Activity, color: "bg-purple-600", select: true },
//     { name: "examensclinique", label: "Examens cliniques", icon: ClipboardList, color: "bg-indigo-600", textarea: true },
//     { name: "habitudeVie", label: "Habitudes de vie", icon: Users, color: "bg-teal-600", textarea: true },
//     { name: "conclusionExamensclinique", label: "Conclusion des examens", icon: FileText, color: "bg-orange-600", textarea: true },
//     { name: "note", label: "Notes additionnelles", icon: FileText, color: "bg-gray-600", textarea: true },
//   ];

//   if (!patientId) {
//     return (
//       <div className="flex justify-center items-center min-h-screen px-4 py-8">
//         <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
//           <div className="text-center">
//             <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Hospitalisations</h2>
//             <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses hospitalisations</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-start min-h-screen px-4 py-8">
//       <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-6xl">

//         {/* Messages d'état */}
//         {message && (
//           <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
//             message.type === 'success'
//               ? 'bg-green-100 text-green-800 border border-green-200'
//               : 'bg-red-100 text-red-800 border border-red-200'
//           }`}>
//             {message.type === 'success' ? (
//               <CheckCircle className="text-green-600 w-5 h-5" />
//             ) : (
//               <AlertCircle className="text-red-600 w-5 h-5" />
//             )}
//             <span>{message.text}</span>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Liste des hospitalisations */}
//           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//               <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                 <Building2 className="w-6 h-6" />
//                 Liste des hospitalisations
//               </h3>
//             </div>

//             <div className="p-6">
//               <div className="max-h-96 overflow-y-auto space-y-3">
//                 {console.log('🖥️ Rendu - Nombre d\'hospitalisations:', hospitalisations.length)}
//                 {console.log('🖥️ Rendu - Hospitalisations:', hospitalisations)}

//                 {hospitalisations.length === 0 ? (
//                   <div className="text-center text-gray-500 py-12">
//                     <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-lg">Aucune hospitalisation enregistrée</p>
//                     <p className="text-sm">Ajoutez une nouvelle hospitalisation pour ce patient</p>
//                   </div>
//                 ) : (
//                   hospitalisations.map((hospitalisation, index) => {
//                     console.log(`🔍 Hospitalisation ${index}:`, hospitalisation);
//                     return (
//                       <div
//                         key={hospitalisation.id || index}
//                         onClick={() => handleSelectHospitalisation(hospitalisation)}
//                         className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
//                           selectedHospitalisation?.id === hospitalisation.id
//                             ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
//                             : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={`p-2 rounded-full ${getStatutIconColor(hospitalisation.statut)}`}>
//                               <Building2 className="w-4 h-4" />
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-800">
//                                 {hospitalisation.motif}
//                               </div>
//                               <div className="text-sm text-gray-600">
//                                 Durée: {calculerDureeHospitalisation(hospitalisation.date_entree, hospitalisation.date_sortie)}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(hospitalisation.statut)}`}>
//                               {hospitalisation.statut}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                               Entrée: {formatDate(hospitalisation.date_entree)}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>

//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
//                 disabled={loading}
//               >
//                 <Plus className="w-5 h-5" />
//                 Ajouter une hospitalisation
//               </button>
//             </div>
//           </div>

//           {/* Détails de l'hospitalisation sélectionnée */}
//           <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
//               <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                 <Eye className="w-6 h-6" />
//                 Détails de l'hospitalisation
//               </h3>
//             </div>

//             {selectedHospitalisation ? (
//               <div className="p-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-full">
//                         <Building2 className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Motif</span>
//                     </div>
//                     <span className="text-gray-900 font-semibold text-right max-w-xs">{selectedHospitalisation.motif}</span>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-purple-100 rounded-full">
//                         <Activity className="w-5 h-5 text-purple-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Statut</span>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(selectedHospitalisation.statut)}`}>
//                       {selectedHospitalisation.statut}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-green-100 rounded-full">
//                         <Calendar className="w-5 h-5 text-green-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Date d'entrée</span>
//                     </div>
//                     <span className="text-gray-900 font-semibold">{formatDate(selectedHospitalisation.date_entree)}</span>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-red-100 rounded-full">
//                         <Calendar className="w-5 h-5 text-red-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Date de sortie</span>
//                     </div>
//                     <span className="text-gray-900 font-semibold">
//                       {selectedHospitalisation.date_sortie ? formatDate(selectedHospitalisation.date_sortie) : 'En cours'}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-orange-100 rounded-full">
//                         <Clock className="w-5 h-5 text-orange-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Durée</span>
//                     </div>
//                     <span className="text-gray-900 font-semibold">
//                       {calculerDureeHospitalisation(selectedHospitalisation.date_entree, selectedHospitalisation.date_sortie)}
//                     </span>
//                   </div>

//                   <div className="p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-start gap-3 mb-2">
//                       <div className="p-2 bg-indigo-100 rounded-full">
//                         <ClipboardList className="w-5 h-5 text-indigo-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Examens cliniques</span>
//                     </div>
//                     <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
//                       {selectedHospitalisation.examensclinique || 'Non renseigné'}
//                     </p>
//                   </div>

//                   <div className="p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-start gap-3 mb-2">
//                       <div className="p-2 bg-teal-100 rounded-full">
//                         <Users className="w-5 h-5 text-teal-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Habitudes de vie</span>
//                     </div>
//                     <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
//                       {selectedHospitalisation.habitudeVie || 'Non renseigné'}
//                     </p>
//                   </div>

//                   <div className="p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-start gap-3 mb-2">
//                       <div className="p-2 bg-yellow-100 rounded-full">
//                         <FileText className="w-5 h-5 text-yellow-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Conclusion des examens</span>
//                     </div>
//                     <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
//                       {selectedHospitalisation.conclusionExamensclinique || 'Non renseigné'}
//                     </p>
//                   </div>

//                   <div className="p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-start gap-3 mb-2">
//                       <div className="p-2 bg-gray-100 rounded-full">
//                         <FileText className="w-5 h-5 text-gray-600" />
//                       </div>
//                       <span className="font-medium text-gray-700">Notes</span>
//                     </div>
//                     <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
//                       {selectedHospitalisation.note || 'Aucune note'}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => handleDeleteHospitalisation(selectedHospitalisation.id)}
//                   className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
//                   title="Supprimer cette hospitalisation"
//                   disabled={loading}
//                 >
//                   <Trash2 className="w-5 h-5" />
//                   Supprimer
//                 </button>
//               </div>
//             ) : (
//               <div className="p-12 text-center text-gray-500">
//                 <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-lg">Sélectionnez une hospitalisation</p>
//                 <p className="text-sm">Cliquez sur une hospitalisation pour voir ses détails</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal d'ajout d'hospitalisation avec style moderne */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
//               <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                 <Plus className="w-6 h-6" />
//                 Nouvelle hospitalisation
//               </h3>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 {formFields.map(({ name, label, icon: Icon, type = "text", color, select, textarea }) => (
//                   <div key={name} className={`flex items-center rounded-full overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
//                     <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
//                       <Icon className="text-white w-5 h-5" />
//                     </div>
//                     {select ? (
//                       <select
//                         name={name}
//                         value={newHospitalisation[name]}
//                         onChange={(e) => handleInputChange(name, e.target.value)}
//                         className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                       >
//                         {statutsHospitalisation.map(statut => (
//                           <option key={statut} value={statut}>{statut}</option>
//                         ))}
//                       </select>
//                     ) : textarea ? (
//                       <textarea
//                         name={name}
//                         value={newHospitalisation[name]}
//                         onChange={(e) => handleInputChange(name, e.target.value)}
//                         placeholder={label.replace(' *', '')}
//                         className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500 h-20 resize-none"
//                         rows="3"
//                       />
//                     ) : (
//                       <input
//                         type={type}
//                         name={name}
//                         value={newHospitalisation[name]}
//                         onChange={(e) => handleInputChange(name, e.target.value)}
//                         placeholder={label.replace(' *', '')}
//                         className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                         required={label.includes('*')}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="flex gap-3 mt-8">
//                 <button
//                   onClick={() => {
//                     setShowAddForm(false);
//                     setNewHospitalisation({
//                       motif: '',
//                       dateEntree: '',
//                       dateSortie: '',
//                       statut: 'en cours',
//                       examensclinique: '',
//                       habitudeVie: '',
//                       conclusionExamensclinique: '',
//                       note: ''
//                     });
//                     setMessage(null);
//                   }}
//                   className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
//                   disabled={loading}
//                 >
//                   <X className="w-5 h-5" />
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleAddHospitalisation}
//                   disabled={!newHospitalisation.motif || !newHospitalisation.dateEntree || !newHospitalisation.dateSortie || loading}
//                   className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Ajout...
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5" />
//                       Ajouter
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HospitalisationPatients;


import React, { useEffect, useState } from 'react';
import { Building2, Plus, Eye, Trash2, User, FileText, Calendar, Clock, X, CheckCircle, AlertCircle, MapPin, Activity, Users, ClipboardList, Bed, Home } from 'lucide-react';

function HospitalisationPatients({ patientId }) {
  const [hospitalisations, setHospitalisations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHospitalisation, setSelectedHospitalisation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // États pour les données des sélecteurs
  const [chambres, setChambres] = useState([]);
  const [lits, setLits] = useState([]);
  const [loadingChambres, setLoadingChambres] = useState(false);
  const [loadingLits, setLoadingLits] = useState(false);

  const [newHospitalisation, setNewHospitalisation] = useState({
    motif: '',
    chambre_id: '',
    lit_id: '',
    date_entree: '',
    date_sortie: '',
    statut: 'en cours',
    examensclinique: '',
    habitudeVie: '',
    conclusionExamensclinique: '',
    note: ''
  });

  // Statuts d'hospitalisation disponibles
  const statutsHospitalisation = [
    'en cours',
    'terminee'
  ];

  useEffect(() => {
    if (patientId) {
      loadHospitalisations();
    }
  }, [patientId]);

  // Charger les chambres disponibles
  const loadChambres = async () => {
    setLoadingChambres(true);
    try {
      const response = await fetch('http://localhost:3000/api/urologie/chambres/allChSer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des chambres');
      }

      const data = await response.json();
      setChambres(data.chambres || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des chambres'
      });
    } finally {
      setLoadingChambres(false);
    }
  };

  // Charger les lits disponibles pour une chambre
  const loadLits = async (chambreId) => {
    if (!chambreId) {
      setLits([]);
      return;
    }

    setLoadingLits(true);
    try {
      const queryParams = chambreId ? `?chambre_id=${chambreId}` : '';
      const response = await fetch(`http://localhost:3000/api/urologie/lits/liste${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des lits');
      }

      const data = await response.json();
      // Filtrer uniquement les lits libres
      const litsLibres = (data.lits || data || []).filter(lit => lit.etat === 'Libre');
      setLits(litsLibres);
    } catch (error) {
      console.error('Erreur lors du chargement des lits:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des lits'
      });
    } finally {
      setLoadingLits(false);
    }
  };

  // Ouvrir le formulaire d'ajout
  const handleOpenAddForm = () => {
    setShowAddForm(true);
    loadChambres();
  };

  const loadHospitalisations = async () => {
    try {
      console.log('🔄 Chargement des hospitalisations pour le patient:', patientId);

      const response = await fetch(`http://localhost:3000/api/urologie/hospitalisations/patient/${patientId}`, {
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
      let hospitalisationsData = [];
      if (data.success && Array.isArray(data.hospitalisations)) {
        hospitalisationsData = data.hospitalisations;
      } else if (Array.isArray(data.data)) {
        hospitalisationsData = data.data;
      } else if (Array.isArray(data)) {
        hospitalisationsData = data;
      } else if (data.hospitalisations && Array.isArray(data.hospitalisations)) {
        hospitalisationsData = data.hospitalisations;
      } else {
        console.log('⚠️ Structure de données non reconnue, utilisation d\'un tableau vide');
        hospitalisationsData = [];
      }

      console.log('🎯 Hospitalisations finales à afficher:', hospitalisationsData);
      setHospitalisations(hospitalisationsData);

    } catch (error) {
      console.error('💥 Erreur lors du chargement des hospitalisations:', error);
      setHospitalisations([]);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des hospitalisations'
      });
    }
  };

  const handleAddHospitalisation = async () => {
    // Validation des champs obligatoires
    if (!newHospitalisation.motif || !newHospitalisation.chambre_id || !newHospitalisation.lit_id ||
      !newHospitalisation.date_entree || !newHospitalisation.date_sortie) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires (motif, chambre, lit, dates)'
      });
      return;
    }

    // Validation des dates
    if (new Date(newHospitalisation.date_sortie) <= new Date(newHospitalisation.date_entree)) {
      setMessage({
        type: 'error',
        text: 'La date de sortie doit être postérieure à la date d\'entrée'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const hospitalisationData = {
        patient_id: patientId,
        chambre_id: newHospitalisation.chambre_id,
        lit_id: newHospitalisation.lit_id,
        date_entree: newHospitalisation.date_entree,
        date_sortie: newHospitalisation.date_sortie,
        statut: newHospitalisation.statut,
        motif: newHospitalisation.motif,
        examensclinique: newHospitalisation.examensclinique,
        habitudeVie: newHospitalisation.habitudeVie,
        conclusionExamensclinique: newHospitalisation.conclusionExamensclinique,
        note: newHospitalisation.note
      };

      console.log('📤 Données à envoyer:', hospitalisationData);

      const response = await fetch('http://localhost:3000/api/urologie/hospitalisations/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(hospitalisationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur HTTP:', response.status, errorData);
        throw new Error(errorData.msg || `Erreur lors de l'ajout de l'hospitalisation: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Hospitalisation ajoutée:', result);

      setMessage({
        type: 'success',
        text: result.msg || 'Hospitalisation ajoutée avec succès !'
      });

      // Recharger la liste des hospitalisations
      await loadHospitalisations();

      // Réinitialiser le formulaire
      setNewHospitalisation({
        motif: '',
        chambre_id: '',
        lit_id: '',
        date_entree: '',
        date_sortie: '',
        statut: 'en cours',
        examensclinique: '',
        habitudeVie: '',
        conclusionExamensclinique: '',
        note: ''
      });
      setLits([]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'hospitalisation:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Erreur lors de l\'ajout de l\'hospitalisation. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHospitalisation = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette hospitalisation ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/hospitalisations/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'hospitalisation');
      }

      console.log('✅ Hospitalisation supprimée');

      setMessage({
        type: 'success',
        text: 'Hospitalisation supprimée avec succès !'
      });

      // Recharger la liste après suppression
      await loadHospitalisations();
      setSelectedHospitalisation(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'hospitalisation:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospitalisation = (hospitalisation) => {
    setSelectedHospitalisation(hospitalisation);
  };

  const handleInputChange = (field, value) => {
    setNewHospitalisation(prev => ({
      ...prev,
      [field]: value
    }));

    // Si la chambre change, charger les lits de cette chambre
    if (field === 'chambre_id') {
      setNewHospitalisation(prev => ({
        ...prev,
        lit_id: '' // Réinitialiser le lit sélectionné
      }));
      loadLits(value);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      'en cours': 'bg-orange-100 text-orange-800',
      'terminee': 'bg-green-100 text-green-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatutIconColor = (statut) => {
    const colors = {
      'en cours': 'bg-orange-100',
      'terminee': 'bg-green-100'
    };
    return colors[statut] || 'bg-gray-100';
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Non définie';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const calculerDureeHospitalisation = (dateEntree, dateSortie) => {
    if (!dateEntree) return 'Non définie';
    if (!dateSortie) return 'En cours';

    try {
      const entree = new Date(dateEntree);
      const sortie = new Date(dateSortie);
      const diffTime = Math.abs(sortie - entree);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } catch (error) {
      return 'Erreur de calcul';
    }
  };

  // Champs du formulaire avec icônes colorées
  const formFields = [
    { name: "motif", label: "Motif d'hospitalisation *", icon: Building2, type: "text", color: "bg-blue-600" },
    { name: "chambre_id", label: "Chambre *", icon: Home, color: "bg-purple-600", select: true, options: chambres },
    { name: "lit_id", label: "Lit *", icon: Bed, color: "bg-indigo-600", select: true, options: lits },
    { name: "date_entree", label: "Date d'entrée *", icon: Calendar, type: "date", color: "bg-green-600" },
    { name: "date_sortie", label: "Date de sortie *", icon: Calendar, type: "date", color: "bg-red-600" },
    { name: "statut", label: "Statut", icon: Activity, color: "bg-orange-600", select: true, options: statutsHospitalisation },
    { name: "examensclinique", label: "Examens cliniques", icon: ClipboardList, color: "bg-indigo-600", textarea: true },
    { name: "habitudeVie", label: "Habitudes de vie", icon: Users, color: "bg-teal-600", textarea: true },
    { name: "conclusionExamensclinique", label: "Conclusion des examens", icon: FileText, color: "bg-yellow-600", textarea: true },
    { name: "note", label: "Notes additionnelles", icon: FileText, color: "bg-gray-600", textarea: true },
  ];

  if (!patientId) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Hospitalisations</h2>
            <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses hospitalisations</p>
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
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
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
          {/* Liste des hospitalisations */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Liste des hospitalisations
              </h3>
            </div>

            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {hospitalisations.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucune hospitalisation enregistrée</p>
                    <p className="text-sm">Ajoutez une nouvelle hospitalisation pour ce patient</p>
                  </div>
                ) : (
                  hospitalisations.map((hospitalisation, index) => (
                    <div
                      key={hospitalisation.id || index}
                      onClick={() => handleSelectHospitalisation(hospitalisation)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedHospitalisation?.id === hospitalisation.id
                          ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
                          : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getStatutIconColor(hospitalisation.statut)}`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {hospitalisation.motif}
                            </div>
                            <div className="text-sm text-gray-600">
                              Durée: {calculerDureeHospitalisation(hospitalisation.date_entree, hospitalisation.date_sortie)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(hospitalisation.statut)}`}>
                            {hospitalisation.statut}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Entrée: {formatDate(hospitalisation.date_entree)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={handleOpenAddForm}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                Ajouter une hospitalisation
              </button>
            </div>
          </div>

          {/* Détails de l'hospitalisation sélectionnée */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Détails de l'hospitalisation
              </h3>
            </div>

            {selectedHospitalisation ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Motif</span>
                    </div>
                    <span className="text-gray-900 font-semibold text-right max-w-xs">{selectedHospitalisation.motif}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Activity className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Statut</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(selectedHospitalisation.statut)}`}>
                      {selectedHospitalisation.statut}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date d'entrée</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatDate(selectedHospitalisation.date_entree)}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date de sortie</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {selectedHospitalisation.date_sortie ? formatDate(selectedHospitalisation.date_sortie) : 'En cours'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Durée</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {calculerDureeHospitalisation(selectedHospitalisation.date_entree, selectedHospitalisation.date_sortie)}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <ClipboardList className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-700">Examens cliniques</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedHospitalisation.examensclinique || 'Non renseigné'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <Users className="w-5 h-5 text-teal-600" />
                      </div>
                      <span className="font-medium text-gray-700">Habitudes de vie</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedHospitalisation.habitudeVie || 'Non renseigné'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <FileText className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="font-medium text-gray-700">Conclusion des examens</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedHospitalisation.conclusionExamensclinique || 'Non renseigné'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700">Notes</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedHospitalisation.note || 'Aucune note'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteHospitalisation(selectedHospitalisation.id)}
                  className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer cette hospitalisation"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez une hospitalisation</p>
                <p className="text-sm">Cliquez sur une hospitalisation pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'hospitalisation avec style moderne */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Nouvelle hospitalisation
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {formFields.map(({ name, label, icon: Icon, type = "text", color, select, textarea, options }) => (
                  <div key={name} className={`flex items-center rounded-full overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
                    <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    {select ? (
                      <select
                        name={name}
                        value={newHospitalisation[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                        disabled={name === 'chambre_id' && loadingChambres || name === 'lit_id' && loadingLits}
                      >
                        <option value="">
                          {name === 'chambre_id'
                            ? (loadingChambres ? 'Chargement...' : 'Sélectionnez une chambre')
                            : name === 'lit_id'
                              ? (loadingLits ? 'Chargement...' : newHospitalisation.chambre_id ? 'Sélectionnez un lit' : 'Sélectionnez d\'abord une chambre')
                              : `Sélectionnez ${label.toLowerCase()}`
                          }
                        </option>
                        {options && options.map((option) => (
                          <option key={option.id || option} value={option.id || option}>
                            {option.nom || option.numero || option.nom_chambre || option.numero_lit || option}
                          </option>
                        ))}
                      </select>
                    ) : textarea ? (
                      <textarea
                        name={name}
                        value={newHospitalisation[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-300 rounded-r-full resize-none h-full"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={newHospitalisation[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-300 rounded-r-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewHospitalisation({
                      motif: '',
                      chambre_id: '',
                      lit_id: '',
                      date_entree: '',
                      date_sortie: '',
                      statut: 'en cours',
                      examensclinique: '',
                      habitudeVie: '',
                      conclusionExamensclinique: '',
                      note: ''
                    });
                    setLits([]);
                    setMessage(null);
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleAddHospitalisation}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {loading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalisationPatients;