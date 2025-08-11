// import React, { useEffect, useState } from 'react';

// function ConsultationPatient({ patientId }) {
//   const [consultations, setConsultations] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedConsultation, setSelectedConsultation] = useState(null);
//   const [newConsultation, setNewConsultation] = useState({
//     // Informations consultation
//     datecons: new Date().toISOString().split('T')[0],
//     motif: '',

//     // Examens généraux / constantes
//     temperature: '',
//     taille: '',
//     poids: '',
//     IMC: '',
//     frequence: '',
//     pression: '',
//     glycemie: '',
//     saturation: '',

//     // Examens paracliniques et diagnostics
//     tdr: '',
//     autresParaclinique: '',
//     diagnostic: '',
//     o2r: '',
//     traitement: '',
//     besoinpf: '',
//     observation: '',
//     note: ''
//   });

//   useEffect(() => {
//     if (patientId) {
//     loadConsultations();
//     }
//   }, [patientId]);

//   const loadConsultations = async () => {
//     try {
//       console.log('🔄 Chargement des consultations pour le patient',patientId);
      
//       const response = await fetch(`http://localhost:3000/api/urologie/consultations/patient/${patientId}`, {
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
      
//       let consultationsData = [];
//       if (data.consultations && Array.isArray(data.consultations)) {
//         consultationsData = data.consultations;
//       } else if (Array.isArray(data)) {
//         consultationsData = data;
//       } else if (data.data && Array.isArray(data.data)) {
//         consultationsData = data.data;
//       }
      
//       console.log('🎯 Consultations finales à afficher:', consultationsData);
//       setConsultations(consultationsData);
      
//     } catch (error) {
//       console.error('💥 Erreur lors du chargement des consultations:', error);
//       setConsultations([]);
//     }
//   };

// // Correction dans la fonction handleAddConsultation
// const handleAddConsultation = async () => {
//   if (newConsultation.motif && newConsultation.diagnostic) {
//     try {
//       const consultationData = {
//         ...newConsultation,
//         // Conversion des valeurs numériques
//         temperature: newConsultation.temperature ? parseFloat(newConsultation.temperature) : null,
//         taille: newConsultation.taille ? parseFloat(newConsultation.taille) : null,
//         poids: newConsultation.poids ? parseFloat(newConsultation.poids) : null,
//         IMC: newConsultation.IMC ? parseFloat(newConsultation.IMC) : null, // Garde IMC en majuscules
//         frequence: newConsultation.frequence ? parseFloat(newConsultation.frequence) : null,
//         glycemie: newConsultation.glycemie ? parseFloat(newConsultation.glycemie) : null,
//         saturation: newConsultation.saturation ? parseFloat(newConsultation.saturation) : null,
//       };
      
//       // ✅ Correction de l'URL pour correspondre au backend
//       const response = await fetch('http://localhost:3000/api/urologie/consultations/enre', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(consultationData),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.msg || errorData.message || 'Erreur lors de l\'enregistrement');
//       }
      
//       const result = await response.json();
//       console.log('✅ Consultation enregistrée:', result);
      
//       // Affichage d'un message de succès
//       if (result.status === 200) {
//         alert('Consultation enregistrée avec succès !');
//       }
      
//       // Recharger la liste des consultations
//       await loadConsultations();
      
//       // Réinitialiser le formulaire
//       setNewConsultation({
//         datecons: new Date().toISOString().split('T')[0],
//         motif: '',
//         temperature: '',
//         taille: '',
//         poids: '',
//         IMC: '',
//         frequence: '',
//         pression: '',
//         glycemie: '',
//         saturation: '',
//         tdr: '',
//         autresParaclinique: '',
//         diagnostic: '',
//         o2r: '',
//         traitement: '',
//         besoinpf: '',
//         observation: '',
//         note: ''
//       });
//       setShowAddForm(false);
      
//     } catch (error) {
//       console.error('Erreur lors de l\'enregistrement:', error);
//       alert('Erreur lors de l\'enregistrement de la consultation: ' + error.message);
//     }
//   } else {
//     alert('Veuillez remplir au minimum le motif et le diagnostic');
//   }
// };

//   const handleDeleteConsultation = async (id) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/urologie/consultations/${id}/supprimer`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         });
        
//         if (!response.ok) {
//           throw new Error('Erreur lors de la suppression');
//         }
        
//         await loadConsultations();
//         setSelectedConsultation(null);
//       } catch (error) {
//         console.error('Erreur lors de la suppression:', error);
//         alert('Erreur lors de la suppression de la consultation');
//       }
//     }
//   };

//   const handleSelectConsultation = (consultation) => {
//     setSelectedConsultation(consultation);
//   };

//   const handleInputChange = (field, value) => {
//     setNewConsultation(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Calcul automatique de l'IMC
//   const calculateIMC = () => {
//     const taille = parseFloat(newConsultation.taille);
//     const poids = parseFloat(newConsultation.poids);
    
//     if (taille && poids && taille > 0) {
//       const tailleEnMetres = taille / 100;
//       const imc = (poids / (tailleEnMetres * tailleEnMetres)).toFixed(2);
//       setNewConsultation(prev => ({
//         ...prev,
//         IMC: imc
//       }));
//     }
//   };

//   useEffect(() => {
//     calculateIMC();
//   }, [newConsultation.taille, newConsultation.poids]);

//   const formatDate = (dateString) => {
//     try {
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
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Consultations Médicales</h2>
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
//         {/* Liste des consultations */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
//             <h3 className="text-white text-xl font-bold">Historique des consultations</h3>
//           </div>
          
//           <div className="p-4">
//             <div className="max-h-64 overflow-y-auto space-y-2">
//               {consultations.length === 0 ? (
//                 <div className="text-center text-gray-500 py-8">
//                   Aucune consultation enregistrée pour ce patient
//                 </div>
//               ) : (
//                 consultations.map((consultation, index) => (
//                   <div
//                     key={consultation.id || index}
//                     onClick={() => handleSelectConsultation(consultation)}
//                     className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                       selectedConsultation?.id === consultation.id
//                         ? 'bg-green-100 border-2 border-green-300'
//                         : 'bg-gray-100 hover:bg-gray-200'
//                     }`}
//                   >
//                     <div className="text-sm font-medium text-gray-800">
//                       {consultation.numcons || `Consultation ${index + 1}`}
//                     </div>
//                     <div className="text-xs text-gray-600 mt-1">
//                       {formatDate(consultation.datecons || consultation.createdAt)} - {consultation.motif}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
            
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="w-full mt-4 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               Nouvelle consultation
//             </button>
//           </div>
//         </div>

//         {/* Détails de la consultation sélectionnée */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
//             <h3 className="text-white text-xl font-bold">Détails de la consultation</h3>
//           </div>
          
//           {selectedConsultation ? (
//             <div className="p-6">
//               <div className="space-y-4 max-h-96 overflow-y-auto">
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">Date</span>
//                   <span className="text-gray-900 text-right max-w-xs">{formatDate(selectedConsultation.datecons)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">N° Consultation</span>
//                   <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.numcons}</span>
//                 </div>
                
//                 <hr className="border-gray-200" />
                
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">Motif</span>
//                   <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.motif}</span>
//                 </div>
                
//                 <div className="flex justify-between items-start">
//                   <span className="font-medium text-gray-700">Diagnostic</span>
//                   <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.diagnostic}</span>
//                 </div>
                
//                 <hr className="border-gray-200" />
                
//                 {/* Constantes */}
//                 <div>
//                   <span className="font-medium text-gray-700 block mb-2">Constantes</span>
//                   <div className="space-y-2">
//                     {selectedConsultation.temperature && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Température</span>
//                         <span className="text-gray-900">{selectedConsultation.temperature}°C</span>
//                       </div>
//                     )}
//                     {selectedConsultation.pression && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Pression</span>
//                         <span className="text-gray-900">{selectedConsultation.pression}</span>
//                       </div>
//                     )}
//                     {selectedConsultation.poids && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Poids</span>
//                         <span className="text-gray-900">{selectedConsultation.poids} kg</span>
//                       </div>
//                     )}
//                     {selectedConsultation.taille && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Taille</span>
//                         <span className="text-gray-900">{selectedConsultation.taille} cm</span>
//                       </div>
//                     )}
//                     {selectedConsultation.imc && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">IMC</span>
//                         <span className="text-gray-900">{selectedConsultation.imc}</span>
//                       </div>
//                     )}
//                     {selectedConsultation.frequence && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Fréquence</span>
//                         <span className="text-gray-900">{selectedConsultation.frequence} bpm</span>
//                       </div>
//                     )}
//                     {selectedConsultation.glycemie && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Glycémie</span>
//                         <span className="text-gray-900">{selectedConsultation.glycemie}</span>
//                       </div>
//                     )}
//                     {selectedConsultation.saturation && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Saturation</span>
//                         <span className="text-gray-900">{selectedConsultation.saturation}%</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <hr className="border-gray-200" />
                
//                 {selectedConsultation.traitement && (
//                   <div className="flex justify-between items-start">
//                     <span className="font-medium text-gray-700">Traitement</span>
//                     <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.traitement}</span>
//                   </div>
//                 )}
                
//                 {selectedConsultation.observation && (
//                   <div className="flex justify-between items-start">
//                     <span className="font-medium text-gray-700">Observations</span>
//                     <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.observation}</span>
//                   </div>
//                 )}
                
//                 {selectedConsultation.note && (
//                   <div className="flex justify-between items-start">
//                     <span className="font-medium text-gray-700">Notes</span>
//                     <span className="text-gray-900 text-right max-w-xs">{selectedConsultation.note}</span>
//                   </div>
//                 )}
//               </div>
              
//               <button
//                 onClick={() => handleDeleteConsultation(selectedConsultation.id)}
//                 className="mt-6 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center w-12 h-12 ml-auto"
//                 title="Supprimer cette consultation"
//               >
//                 ✕
//               </button>
//             </div>
//           ) : (
//             <div className="p-6 text-center text-gray-500">
//               Sélectionnez une consultation pour voir les détails
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal d'ajout de consultation */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-bold mb-4">Nouvelle consultation</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Informations générales */}
//               <div className="space-y-4">
//                 <h4 className="font-medium text-gray-700 border-b pb-2">Informations générales</h4>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date de consultation
//                   </label>
//                   <input
//                     type="date"
//                     value={newConsultation.datecons}
//                     onChange={(e) => handleInputChange('datecons', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Motif *
//                   </label>
//                   <input
//                     type="text"
//                     value={newConsultation.motif}
//                     onChange={(e) => handleInputChange('motif', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Motif de la consultation"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Diagnostic *
//                   </label>
//                   <textarea
//                     value={newConsultation.diagnostic}
//                     onChange={(e) => handleInputChange('diagnostic', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows="3"
//                     placeholder="Diagnostic médical"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Traitement
//                   </label>
//                   <textarea
//                     value={newConsultation.traitement}
//                     onChange={(e) => handleInputChange('traitement', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows="3"
//                     placeholder="Traitement prescrit"
//                   />
//                 </div>
//               </div>
              
//               {/* Constantes et examens */}
//               <div className="space-y-4">
//                 <h4 className="font-medium text-gray-700 border-b pb-2">Constantes et examens</h4>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Température (°C)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newConsultation.temperature}
//                       onChange={(e) => handleInputChange('temperature', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="37.0"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Pression artérielle
//                     </label>
//                     <input
//                       type="text"
//                       value={newConsultation.pression}
//                       onChange={(e) => handleInputChange('pression', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="120/80"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Poids (kg)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newConsultation.poids}
//                       onChange={(e) => handleInputChange('poids', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="70.0"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Taille (cm)
//                     </label>
//                     <input
//                       type="number"
//                       value={newConsultation.taille}
//                       onChange={(e) => handleInputChange('taille', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="170"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       IMC
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={newConsultation.IMC}
//                       onChange={(e) => handleInputChange('IMC', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
//                       placeholder="Calculé automatiquement"
//                       readOnly
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Fréquence cardiaque
//                     </label>
//                     <input
//                       type="number"
//                       value={newConsultation.frequence}
//                       onChange={(e) => handleInputChange('frequence', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="70"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Glycémie
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newConsultation.glycemie}
//                       onChange={(e) => handleInputChange('glycemie', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="1.0"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Saturation O2 (%)
//                     </label>
//                     <input
//                       type="number"
//                       value={newConsultation.saturation}
//                       onChange={(e) => handleInputChange('saturation', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="98"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     TDR
//                   </label>
//                   <input
//                     type="text"
//                     value={newConsultation.tdr}
//                     onChange={(e) => handleInputChange('tdr', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Test de diagnostic rapide"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Autres examens paracliniques
//                   </label>
//                   <textarea
//                     value={newConsultation.autresParaclinique}
//                     onChange={(e) => handleInputChange('autresParaclinique', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows="2"
//                     placeholder="Autres examens effectués"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             {/* Observations et notes */}
//             <div className="mt-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Observations
//                   </label>
//                   <textarea
//                     value={newConsultation.observation}
//                     onChange={(e) => handleInputChange('observation', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows="3"
//                     placeholder="Observations du médecin"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Notes
//                   </label>
//                   <textarea
//                     value={newConsultation.note}
//                     onChange={(e) => handleInputChange('note', e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows="3"
//                     placeholder="Notes additionnelles"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowAddForm(false);
//                   setNewConsultation({
//                     datecons: new Date().toISOString().split('T')[0],
//                     motif: '',
//                     temperature: '',
//                     taille: '',
//                     poids: '',
//                     IMC: '',
//                     frequence: '',
//                     pression: '',
//                     glycemie: '',
//                     saturation: '',
//                     tdr: '',
//                     autresParaclinique: '',
//                     diagnostic: '',
//                     o2r: '',
//                     traitement: '',
//                     besoinpf: '',
//                     observation: '',
//                     note: ''
//                   });
//                 }}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleAddConsultation}
//                 disabled={!newConsultation.motif || !newConsultation.diagnostic}
//                 className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//               >
//                 Enregistrer la consultation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ConsultationPatient;

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  User, Plus, X, CheckCircle, AlertCircle, ClipboardList, Stethoscope, Calendar, Thermometer, Ruler, Weight, Activity, HeartPulse, Droplets, Syringe, NotebookPen, Pill, FileText, Search, Users, Clock, TrendingUp, Shield, Database, BarChart3, Zap, Target, Award, Trash2, Edit3
} from 'lucide-react';

function ConsultationPatient({ patientId }) {
  const [consultations, setConsultations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newConsultation, setNewConsultation] = useState({
    // Informations consultation
    datecons: new Date().toISOString().split('T')[0],
    motif: '',

    // Examens généraux / constantes
    temperature: '',
    taille: '',
    poids: '',
    IMC: '',
    frequence: '',
    pression: '',
    glycemie: '',
    saturation: '',

    // Examens paracliniques et diagnostics
    tdr: '',
    autresParaclinique: '',
    diagnostic: '',
    o2r: '',
    traitement: '',
    besoinpf: '',
    observation: '',
    note: ''
  });

  // Champs du formulaire avec icônes colorées
  const formFields = [
    { name: "datecons", label: "Date de consultation *", icon: Calendar, type: "date", color: "bg-cyan-600" },
    { name: "motif", label: "Motif *", icon: ClipboardList, textarea: true, color: "bg-green-600" },
    { name: "diagnostic", label: "Diagnostic *", icon: NotebookPen, textarea: true, color: "bg-blue-600" },
    { name: "temperature", label: "Température (°C)", icon: Thermometer, type: "number", color: "bg-red-600" },
    { name: "taille", label: "Taille (cm)", icon: Ruler, type: "number", color: "bg-cyan-600" },
    { name: "poids", label: "Poids (kg)", icon: Weight, type: "number", color: "bg-green-600" },
    { name: "IMC", label: "IMC (kg/m²)", icon: Activity, type: "number", color: "bg-purple-600" },
    { name: "frequence", label: "Fréquence cardiaque (bpm)", icon: HeartPulse, type: "number", color: "bg-pink-600" },
    { name: "pression", label: "Pression artérielle (mmHg)", icon: Droplets, type: "text", color: "bg-orange-600" },
    { name: "glycemie", label: "Glycémie (mg/dL)", icon: Syringe, type: "number", color: "bg-yellow-600" },
    { name: "saturation", label: "Saturation O2 (%)", icon: Stethoscope, type: "number", color: "bg-cyan-600" },
    { name: "tdr", label: "TDR", icon: FileText, type: "text", color: "bg-blue-600" },
    { name: "autresParaclinique", label: "Autres examens", icon: FileText, textarea: true, color: "bg-purple-600" },
    { name: "o2r", label: "O2R", icon: Pill, type: "text", color: "bg-cyan-600" },
    { name: "traitement", label: "Traitement", icon: Syringe, textarea: true, color: "bg-yellow-600" },
    { name: "besoinpf", label: "Besoin PF", icon: FileText, type: "text", color: "bg-blue-600" },
    { name: "observation", label: "Observation", icon: FileText, textarea: true, color: "bg-purple-600" },
    { name: "note", label: "Note", icon: FileText, textarea: true, color: "bg-gray-600" },
  ];

  useEffect(() => {
    if (patientId) {
      loadConsultations();
    }
  }, [patientId]);

  const loadConsultations = async () => {
    try {
      console.log('🔄 Chargement des consultations pour le patient', patientId);
      
      const response = await fetch(`http://localhost:3000/api/urologie/consultations/patient/${patientId}`, {
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
      
      let consultationsData = [];
      if (data.consultations && Array.isArray(data.consultations)) {
        consultationsData = data.consultations;
      } else if (Array.isArray(data)) {
        consultationsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        consultationsData = data.data;
      }
      
      console.log('🎯 Consultations finales à afficher:', consultationsData);
      setConsultations(consultationsData);
      
    } catch (error) {
      console.error('💥 Erreur lors du chargement des consultations:', error);
      setConsultations([]);
    }
  };

  const handleAddConsultation = async () => {
    if (newConsultation.motif && newConsultation.diagnostic) {
      try {
        const consultationData = {
          patient_id: patientId,
          ...newConsultation,
          // Conversion des valeurs numériques
          temperature: newConsultation.temperature ? parseFloat(newConsultation.temperature) : null,
          taille: newConsultation.taille ? parseFloat(newConsultation.taille) : null,
          poids: newConsultation.poids ? parseFloat(newConsultation.poids) : null,
          IMC: newConsultation.IMC ? parseFloat(newConsultation.IMC) : null,
          frequence: newConsultation.frequence ? parseFloat(newConsultation.frequence) : null,
          glycemie: newConsultation.glycemie ? parseFloat(newConsultation.glycemie) : null,
          saturation: newConsultation.saturation ? parseFloat(newConsultation.saturation) : null,
        };
        
        const response = await fetch('http://localhost:3000/api/urologie/consultations/enre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(consultationData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || errorData.message || 'Erreur lors de l\'enregistrement');
        }
        
        const result = await response.json();
        console.log('✅ Consultation enregistrée:', result);
        
        toast.success('Consultation enregistrée avec succès !');
        
        // Recharger la liste des consultations
        await loadConsultations();
        
        // Réinitialiser le formulaire
        setNewConsultation({
          datecons: new Date().toISOString().split('T')[0],
          motif: '',
          temperature: '',
          taille: '',
          poids: '',
          IMC: '',
          frequence: '',
          pression: '',
          glycemie: '',
          saturation: '',
          tdr: '',
          autresParaclinique: '',
          diagnostic: '',
          o2r: '',
          traitement: '',
          besoinpf: '',
          observation: '',
          note: ''
        });
        setShowAddForm(false);
        
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        toast.error('Erreur lors de l\'enregistrement de la consultation: ' + error.message);
      }
    } else {
      toast.error('Veuillez remplir au minimum le motif et le diagnostic');
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/urologie/consultations/${id}/supprimer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }
        
        await loadConsultations();
        setSelectedConsultation(null);
        toast.success('Consultation supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la consultation');
      }
    }
  };

  const handleSelectConsultation = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleInputChange = (field, value) => {
    setNewConsultation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcul automatique de l'IMC
  const calculateIMC = () => {
    const taille = parseFloat(newConsultation.taille);
    const poids = parseFloat(newConsultation.poids);
    
    if (taille && poids && taille > 0) {
      const tailleEnMetres = taille / 100;
      const imc = (poids / (tailleEnMetres * tailleEnMetres)).toFixed(2);
      setNewConsultation(prev => ({
        ...prev,
        IMC: imc
      }));
    }
  };

  useEffect(() => {
    calculateIMC();
  }, [newConsultation.taille, newConsultation.poids]);

  const formatDate = (dateString) => {
    try {
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

  // Vérification de la prop patientId
  if (!patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultations Médicales</h2>
          <p className="text-gray-600">Aucun patient sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des consultations */}
          <div className="bg-gradient-to-br from-cyan-50 to-green-50 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                Historique des consultations
              </h3>
            </div>
            
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {consultations.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucune consultation enregistrée</p>
                    <p className="text-sm">Ajoutez une nouvelle consultation pour ce patient</p>
                  </div>
                ) : (
                  consultations.map((consultation, index) => (
                    <div
                      key={consultation.id || index}
                      onClick={() => handleSelectConsultation(consultation)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                        selectedConsultation?.id === consultation.id
                          ? 'bg-green-100 border-2 border-green-400 shadow-lg'
                          : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Stethoscope className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {consultation.numcons || `Consultation ${index + 1}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(consultation.datecons || consultation.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-800">
                            {consultation.motif || 'Motif non précisé'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nouvelle consultation
              </button>
            </div>
          </div>

          {/* Détails de la consultation sélectionnée */}
          <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Détails de la consultation
              </h3>
            </div>
            
            {selectedConsultation ? (
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Informations générales */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      Informations générales
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <span className="ml-2 font-medium">{formatDate(selectedConsultation.datecons)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">N° Consultation:</span>
                        <span className="ml-2 font-medium">{selectedConsultation.numcons || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Motif et diagnostic */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-green-600" />
                      Motif et diagnostic
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Motif:</span>
                        <p className="font-medium mt-1">{selectedConsultation.motif || 'Non précisé'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Diagnostic:</span>
                        <p className="font-medium mt-1">{selectedConsultation.diagnostic || 'Non précisé'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Constantes vitales */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      Constantes vitales
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {selectedConsultation.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">Température:</span>
                          <span className="font-medium">{selectedConsultation.temperature}°C</span>
                        </div>
                      )}
                      {selectedConsultation.pression && (
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-600">Pression:</span>
                          <span className="font-medium">{selectedConsultation.pression}</span>
                        </div>
                      )}
                      {selectedConsultation.poids && (
                        <div className="flex items-center gap-2">
                          <Weight className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Poids:</span>
                          <span className="font-medium">{selectedConsultation.poids} kg</span>
                        </div>
                      )}
                      {selectedConsultation.taille && (
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-600">Taille:</span>
                          <span className="font-medium">{selectedConsultation.taille} cm</span>
                        </div>
                      )}
                      {selectedConsultation.imc && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">IMC:</span>
                          <span className="font-medium">{selectedConsultation.imc}</span>
                        </div>
                      )}
                      {selectedConsultation.frequence && (
                        <div className="flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-pink-500" />
                          <span className="text-gray-600">Fréquence:</span>
                          <span className="font-medium">{selectedConsultation.frequence} bpm</span>
                        </div>
                      )}
                      {selectedConsultation.glycemie && (
                        <div className="flex items-center gap-2">
                          <Syringe className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">Glycémie:</span>
                          <span className="font-medium">{selectedConsultation.glycemie}</span>
                        </div>
                      )}
                      {selectedConsultation.saturation && (
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-600">Saturation O2:</span>
                          <span className="font-medium">{selectedConsultation.saturation}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Traitement et observations */}
                  {(selectedConsultation.traitement || selectedConsultation.observation || selectedConsultation.note) && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <NotebookPen className="w-4 h-4 text-blue-600" />
                        Traitement et observations
                      </h4>
                      <div className="space-y-3">
                        {selectedConsultation.traitement && (
                          <div>
                            <span className="text-gray-600 text-sm">Traitement:</span>
                            <p className="font-medium mt-1">{selectedConsultation.traitement}</p>
                          </div>
                        )}
                        {selectedConsultation.observation && (
                          <div>
                            <span className="text-gray-600 text-sm">Observations:</span>
                            <p className="font-medium mt-1">{selectedConsultation.observation}</p>
                          </div>
                        )}
                        {selectedConsultation.note && (
                          <div>
                            <span className="text-gray-600 text-sm">Notes:</span>
                            <p className="font-medium mt-1">{selectedConsultation.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleDeleteConsultation(selectedConsultation.id)}
                  className="mt-6 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer cette consultation"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>Sélectionnez une consultation pour voir les détails</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal d'ajout de consultation */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6 rounded-t-2xl">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Nouvelle consultation
                </h3>
              </div>
              
              <form className="p-6" onSubmit={(e) => { e.preventDefault(); handleAddConsultation(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map(({ name, label, icon: Icon, type = "text", color, textarea }) => (
                    <div key={name} className={`${textarea ? 'md:col-span-2' : ''}`}>
                      <div className={`flex items-center rounded-lg overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
                        <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
                          <Icon className="text-white w-5 h-5" />
                        </div>
                        {textarea ? (
                          <textarea
                            name={name}
                            value={newConsultation[name]}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={label.replace(' *', '')}
                            className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                            rows="3"
                            required={label.includes('*')}
                          />
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={newConsultation[name]}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={label.replace(' *', '')}
                            className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                            required={label.includes('*')}
                            readOnly={name === 'IMC'}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewConsultation({
                        datecons: new Date().toISOString().split('T')[0],
                        motif: '',
                        temperature: '',
                        taille: '',
                        poids: '',
                        IMC: '',
                        frequence: '',
                        pression: '',
                        glycemie: '',
                        saturation: '',
                        tdr: '',
                        autresParaclinique: '',
                        diagnostic: '',
                        o2r: '',
                        traitement: '',
                        besoinpf: '',
                        observation: '',
                        note: ''
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!newConsultation.motif || !newConsultation.diagnostic}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Enregistrer la consultation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationPatient;