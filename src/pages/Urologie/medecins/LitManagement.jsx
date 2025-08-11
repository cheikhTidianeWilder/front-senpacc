// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, Bed, Filter } from 'lucide-react';

// function LitManagement() {
//   const [lits, setLits] = useState([]);
//   const [chambres, setChambres] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingLit, setEditingLit] = useState(null);
//   const [selectedChambre, setSelectedChambre] = useState('');

//   const [formData, setFormData] = useState({
//     numero: ''
//   });

//   const [formErrors, setFormErrors] = useState({});

//   useEffect(() => {
//     loadChambres();
//     loadLits();
//   }, []);

//   const loadChambres = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/urologie/chambres/allChSer', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       if (data.status === 200) {
//         setChambres(data.chambres || []);
//       }
//     } catch (err) {
//       console.error('Erreur lors du chargement des chambres:', err);
//     }
//   };

//   const loadLits = async (chambreId = '') => {
//     setLoading(true);
//     setError('');
//     try {
//       const queryParams = chambreId ? `?chambre_id=${chambreId}` : '';
//       const response = await fetch(`http://localhost:3000/api/urologie/lits/liste${queryParams}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       if (data.status === 200) {
//         setLits(data.lits || []);
//       } else {
//         setError(data.msg || 'Erreur lors du chargement des lits');
//       }
//     } catch (err) {
//       console.error('Erreur lors du chargement des lits:', err);
//       setError('Erreur réseau : impossible de charger les lits');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.numero || formData.numero.trim() === '') {
//       errors.numero = 'Le numéro du lit est requis';
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Effacer l'erreur du champ modifié
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setError('');
//     setSuccess('');
    
//     try {
//       const url = editingLit 
//         ? `http://localhost:3000/api/urologie/lits/${editingLit.id}/modifier`
//         : 'http://localhost:3000/api/urologie/lits/ajouter';
      
//       const method = editingLit ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method: method,
//         credentials: 'include',
//         headers: { 
//           'Content-Type': 'application/json' 
//         },
//         body: JSON.stringify({
//           numero: formData.numero.trim()
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.status === 200) {
//         setSuccess(editingLit ? 'Lit modifié avec succès !' : 'Lit ajouté avec succès !');
//         await loadLits(selectedChambre); // Recharger les données
//         resetForm();
//       } else {
//         setError(data.msg || 'Erreur lors de l\'opération');
//       }
//     } catch (err) {
//       console.error('Erreur lors de la soumission:', err);
//       setError('Erreur réseau : impossible de traiter la demande');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteLit = async (id) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lit ?')) return;
    
//     setLoading(true);
//     setError('');
//     setSuccess('');
    
//     try {
//       const response = await fetch(`http://localhost:3000/api/urologie/lits/${id}/supprimer`, {
//         method: 'DELETE',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.status === 200) {
//         setSuccess('Lit supprimé avec succès !');
//         await loadLits(selectedChambre); // Recharger les données
//       } else {
//         setError(data.msg || 'Erreur lors de la suppression');
//       }
//     } catch (err) {
//       console.error('Erreur lors de la suppression:', err);
//       setError('Erreur réseau : impossible de supprimer le lit');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ numero: '' });
//     setFormErrors({});
//     setShowForm(false);
//     setEditingLit(null);
//   };

//   const handleEdit = (lit) => {
//     setEditingLit(lit);
//     setFormData({
//       numero: lit.numero || ''
//     });
//     setShowForm(true);
//   };

//   const handleChambreFilter = (chambreId) => {
//     setSelectedChambre(chambreId);
//     loadLits(chambreId);
//   };

//   const getEtatColor = (etat) => {
//     switch (etat) {
//       case 'Libre': return 'bg-green-100 text-green-800';
//       case 'Occupé': return 'bg-red-100 text-red-800';
//       case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const filteredLits = lits.filter(lit =>
//     lit && !lit.supprimer && (
//       (lit.numero && lit.numero.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (lit.chambre && lit.chambre.numero && lit.chambre.numero.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//   );

//   // Auto-hide messages après 5 secondes
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center gap-3 mb-2">
//           <Bed className="w-8 h-8 text-blue-600" />
//           <h1 className="text-3xl font-bold text-gray-900">Gestion des Lits</h1>
//         </div>
//         <p className="text-gray-600 mb-6">Gérez les lits de votre service d'urologie</p>

//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
//             <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
//             <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
//             <span>{success}</span>
//           </div>
//         )}

//         <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher un lit..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
//             />
//           </div>

//           <div className="relative">
//             <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//             <select
//               value={selectedChambre}
//               onChange={(e) => handleChambreFilter(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full appearance-none"
//             >
//               <option value="">Toutes les chambres</option>
//               {chambres.filter(chambre => !chambre.supprimer).map(chambre => (
//                 <option key={chambre.id} value={chambre.id}>
//                   Chambre {chambre.numero} - Étage {chambre.etage}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div></div>

//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
//           >
//             <Plus className="w-5 h-5" />
//             Ajouter un lit
//           </button>
//         </div>

//         {showForm && (
//           <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">
//               {editingLit ? 'Modifier le lit' : 'Ajouter un lit'}
//             </h2>
            
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//               <p className="text-sm text-blue-800">
//                 <strong>Note :</strong> Le lit sera automatiquement ajouté à la chambre active la plus récente de votre service.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Numéro du lit <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="numero"
//                   value={formData.numero}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     formErrors.numero ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="ex: L01, Lit-1, A..."
//                 />
//                 {formErrors.numero && (
//                   <p className="mt-1 text-sm text-red-600">{formErrors.numero}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 flex gap-3">
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading ? 'Traitement...' : (editingLit ? 'Modifier' : 'Ajouter')}
//               </button>
//               <button
//                 onClick={resetForm}
//                 disabled={loading}
//                 className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="px-6 py-4 bg-gray-50 border-b">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Liste des lits ({filteredLits.length})
//             </h2>
//           </div>

//           {loading && lits.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
//               <p>Chargement des lits...</p>
//             </div>
//           ) : filteredLits.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               {searchTerm ? 'Aucun lit trouvé pour cette recherche' : 'Aucun lit disponible'}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Numéro
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Chambre
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Étage
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       État
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Service
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredLits.map(lit => (
//                     <tr key={lit.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         <div className="flex items-center">
//                           <Bed className="w-4 h-4 text-gray-400 mr-2" />
//                           {lit.numero}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {lit.chambre?.numero || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           Étage {lit.chambre?.etage || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEtatColor(lit.etat)}`}>
//                           {lit.etat || 'Non défini'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {lit.chambre?.service?.nom || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => handleEdit(lit)} 
//                             className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded" 
//                             title="Modifier"
//                             disabled={loading}
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteLit(lit.id)} 
//                             className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded" 
//                             title="Supprimer"
//                             disabled={loading}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LitManagement;

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, Bed, Filter } from 'lucide-react';

function LitManagement() {
  const [lits, setLits] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLit, setEditingLit] = useState(null);
  const [selectedChambre, setSelectedChambre] = useState('');

  const [formData, setFormData] = useState({
    numero: '',
    chambre_id: '',
    etat: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadChambres();
    loadLits();
  }, []);

  const loadChambres = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/urologie/chambres/allChSer', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === 200) {
        setChambres(data.chambres || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des chambres:', err);
    }
  };

  const loadLits = async (chambreId = '') => {
    setLoading(true);
    setError('');
    try {
      const queryParams = chambreId ? `?chambre_id=${chambreId}` : '';
      const response = await fetch(`http://localhost:3000/api/urologie/lits/liste${queryParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === 200) {
        setLits(data.lits || []);
      } else {
        setError(data.msg || 'Erreur lors du chargement des lits');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des lits:', err);
      setError('Erreur réseau : impossible de charger les lits');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.numero || formData.numero.trim() === '') {
      errors.numero = 'Le numéro du lit est requis';
    }
    
    if (!formData.chambre_id || formData.chambre_id === '') {
      errors.chambre_id = 'La chambre est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // URL CORRIGÉE
      const url = editingLit 
        ? `http://localhost:3000/api/urologie/lits/${editingLit.id}`
        : 'http://localhost:3000/api/urologie/lits/ajouter';
      
      const method = editingLit ? 'PUT' : 'POST';
      
      // DONNÉES CORRIGÉES - Pour la modification, on n'envoie que les champs modifiables
      const bodyData = editingLit 
        ? {
            numero: formData.numero.trim(),
            etat: formData.etat
          }
        : {
            numero: formData.numero.trim(),
            chambre_id: formData.chambre_id,
            etat: formData.etat
          };
      
      console.log('Envoi des données:', { url, method, bodyData }); // Debug
      
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(bodyData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 200 || data.status === 201) {
        setSuccess(editingLit ? 'Lit modifié avec succès !' : 'Lit ajouté avec succès !');
        await loadLits(selectedChambre);
        resetForm();
      } else {
        setError(data.msg || 'Erreur lors de l\'opération');
      }
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.message || 'Erreur réseau : impossible de traiter la demande');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLit = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lit ?')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/lits/${id}/supprime`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 200) {
        setSuccess('Lit supprimé avec succès !');
        await loadLits(selectedChambre);
      } else {
        setError(data.msg || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur réseau : impossible de supprimer le lit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ numero: '', chambre_id: '', etat: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingLit(null);
  };

  const handleEdit = (lit) => {
    setEditingLit(lit);
    setFormData({
      numero: lit.numero || '',
      chambre_id: lit.chambre_id || '',
      etat: lit.etat || 'Libre'
    });
    setShowForm(true);
  };

  const handleChambreFilter = (chambreId) => {
    setSelectedChambre(chambreId);
    loadLits(chambreId);
  };

  const getEtatColor = (etat) => {
    switch (etat) {
      case 'Libre': return 'bg-green-100 text-green-800';
      case 'Occupé': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLits = lits.filter(lit =>
    lit && !lit.supprimer && (
      (lit.numero && lit.numero.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lit.chambre && lit.chambre.numero && lit.chambre.numero.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Bed className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Lits</h1>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un lit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <select
              value={selectedChambre}
              onChange={(e) => handleChambreFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full appearance-none"
            >
              <option value="">Toutes les chambres</option>
              {chambres.filter(chambre => !chambre.supprimer).map(chambre => (
                <option key={chambre.id} value={chambre.id}>
                  Chambre {chambre.numero} - Étage {chambre.etage}
                </option>
              ))}
            </select>
          </div>

          <div></div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Ajouter un lit
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingLit ? 'Modifier le lit' : 'Ajouter un lit'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro du lit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.numero ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ex: L01, Lit-1, A..."
                />
                {formErrors.numero && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.numero}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chambre <span className="text-red-500">*</span>
                </label>
                <select
                  name="chambre_id"
                  value={formData.chambre_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.chambre_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  // DÉSACTIVER LE CHAMP CHAMBRE EN MODE ÉDITION
                  disabled={editingLit}
                >
                  <option value="">Sélectionnez une chambre</option>
                  {chambres.filter(chambre => !chambre.supprimer).map(chambre => (
                    <option key={chambre.id} value={chambre.id}>
                      Chambre {chambre.numero} - Étage {chambre.etage}
                    </option>
                  ))}
                </select>
                {editingLit && (
                  <p className="mt-1 text-sm text-gray-500">
                    La chambre ne peut pas être modifiée
                  </p>
                )}
                {formErrors.chambre_id && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.chambre_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  État
                </label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Libre">Libre</option>
                  <option value="Occupé">Occupé</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Traitement...' : (editingLit ? 'Modifier' : 'Ajouter')}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des lits ({filteredLits.length})
            </h2>
          </div>

          {loading && lits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Chargement des lits...</p>
            </div>
          ) : filteredLits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aucun lit trouvé pour cette recherche' : 'Aucun lit disponible'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chambre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      État
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLits.map(lit => (
                    <tr key={lit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 text-gray-400 mr-2" />
                          {lit.numero}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lit.chambre?.numero || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Étage {lit.chambre?.etage || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEtatColor(lit.etat)}`}>
                          {lit.etat || 'Non défini'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lit.chambre?.service?.nom || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(lit)} 
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded" 
                            title="Modifier"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLit(lit.id)} 
                            className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded" 
                            title="Supprimer"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LitManagement;