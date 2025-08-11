import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle, X, Plus, Trash2, Eye } from 'lucide-react';

function RendezVousPatients({ patientId }) {
  const [rendezVous, setRendezVous] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRendezVous, setSelectedRendezVous] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newRendezVous, setNewRendezVous] = useState({
    daterv: '',
    heurerv: '',
    note: '',
    statut: 'en attente'
  });

  useEffect(() => {
    if (patientId) {
      loadRendezVous();
    }
  }, [patientId]);

  const loadRendezVous = async () => {
    try {
      console.log('🔄 Chargement des rendez-vous pour le patient:', patientId);
      
      const response = await fetch(`http://localhost:3000/api/urologie/rdvs/patient/${patientId}`, {
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
      let rendezVousData = [];
      if (data.success && Array.isArray(data.rendezVous)) {
        rendezVousData = data.rendezVous;
      } else if (data.status === 200 && Array.isArray(data.rendezVous)) {
        rendezVousData = data.rendezVous;
      } else if (Array.isArray(data.data)) {
        rendezVousData = data.data;
      } else if (Array.isArray(data)) {
        rendezVousData = data;
      } else if (data.rendezVous && Array.isArray(data.rendezVous)) {
        rendezVousData = data.rendezVous;
      } else {
        console.log('⚠️ Structure de données non reconnue, utilisation d\'un tableau vide');
        rendezVousData = [];
      }
      
      console.log('🎯 Rendez-vous finaux à afficher:', rendezVousData);
      setRendezVous(rendezVousData);
      
    } catch (error) {
      console.error('💥 Erreur lors du chargement des rendez-vous:', error);
      setRendezVous([]);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des rendez-vous'
      });
    }
  };

  const handleAddRendezVous = async () => {
    if (!newRendezVous.daterv || !newRendezVous.heurerv) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires (date et heure)'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const rendezVousData = {
        user_id: patientId,
        daterv: newRendezVous.daterv,
        heurerv: newRendezVous.heurerv,
        note: newRendezVous.note,
        statut: newRendezVous.statut
      };
      
      console.log('📤 Données à envoyer:', rendezVousData);
      
      const response = await fetch('http://localhost:3000/api/urologie/rdvs/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rendezVousData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur lors de l'ajout du rendez-vous: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Rendez-vous ajouté:', result);
      
      setMessage({
        type: 'success',
        text: 'Rendez-vous ajouté avec succès !'
      });
      
      // Recharger la liste des rendez-vous
      await loadRendezVous();
      
      // Réinitialiser le formulaire
      setNewRendezVous({
        daterv: '',
        heurerv: '',
        note: '',
        statut: 'en attente'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'ajout du rendez-vous. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRendezVous = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/rdvs/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du rendez-vous');
      }
      
      console.log('✅ Rendez-vous supprimé');
      
      setMessage({
        type: 'success',
        text: 'Rendez-vous supprimé avec succès !'
      });
      
      // Recharger la liste après suppression
      await loadRendezVous();
      setSelectedRendezVous(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRendezVous = (rv) => {
    setSelectedRendezVous(rv);
  };

  const handleInputChange = (field, value) => {
    setNewRendezVous(prev => ({
      ...prev,
      [field]: value
    }));
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

  const formatTime = (timeString) => {
    try {
      if (!timeString) return 'Non définie';
      return timeString.slice(0, 5); // Format HH:MM
    } catch (error) {
      return timeString;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmé':
        return 'bg-blue-100 text-blue-800';
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculerTempsRestant = (daterv, heurerv) => {
    if (!daterv || !heurerv) return 'Non défini';
    
    try {
      const maintenant = new Date();
      const dateRdv = new Date(`${daterv}T${heurerv}`);
      
      if (dateRdv < maintenant) {
        return 'Passé';
      }
      
      const diffTime = dateRdv - maintenant;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Aujourd\'hui';
      } else if (diffDays === 1) {
        return 'Demain';
      } else {
        return `Dans ${diffDays} jours`;
      }
    } catch (error) {
      return 'Erreur de calcul';
    }
  };

  // Champs du formulaire avec icônes colorées
  const formFields = [
    { name: "daterv", label: "Date du RDV *", icon: Calendar, type: "date", color: "bg-blue-600" },
    { name: "heurerv", label: "Heure du RDV *", icon: Clock, type: "time", color: "bg-green-600" },
    { name: "statut", label: "Statut", icon: AlertCircle, color: "bg-orange-500" },
    { name: "note", label: "Notes", icon: FileText, color: "bg-purple-600", textarea: true },
  ];

  if (!patientId) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Rendez-vous</h2>
            <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses rendez-vous</p>
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
          {/* Liste des rendez-vous */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Liste des rendez-vous
              </h3>
            </div>
            
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {console.log('🖥️ Rendu - Nombre de rendez-vous:', rendezVous.length)}
                {console.log('🖥️ Rendu - Rendez-vous:', rendezVous)}
                
                {rendezVous.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucun rendez-vous enregistré</p>
                    <p className="text-sm">Ajoutez un nouveau rendez-vous pour ce patient</p>
                  </div>
                ) : (
                  rendezVous.map((rv, index) => {
                    console.log(`🔍 Rendez-vous ${index}:`, rv);
                    return (
                      <div
                        key={rv.id || index}
                        onClick={() => handleSelectRendezVous(rv)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                          selectedRendezVous?.id === rv.id
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(rv.statut)}`}>
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {formatDate(rv.daterv)} à {formatTime(rv.heurerv)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {rv.note || 'Aucune note'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rv.statut)}`}>
                              {rv.statut}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {calculerTempsRestant(rv.daterv, rv.heurerv)}
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
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                Ajouter un rendez-vous
              </button>
            </div>
          </div>

          {/* Détails du rendez-vous sélectionné */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Détails du rendez-vous
              </h3>
            </div>
            
            {selectedRendezVous ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatDate(selectedRendezVous.daterv)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Heure</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatTime(selectedRendezVous.heurerv)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Statut</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRendezVous.statut)}`}>
                      {selectedRendezVous.statut}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Temps restant</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {calculerTempsRestant(selectedRendezVous.daterv, selectedRendezVous.heurerv)}
                    </span>
                  </div>
                  
                  {selectedRendezVous.User && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-700">Patient</span>
                      </div>
                      <span className="text-gray-900 font-semibold text-right max-w-xs">
                        {`${selectedRendezVous.User.prenom} ${selectedRendezVous.User.nom}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Notes</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedRendezVous.note || 'Aucune note'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteRendezVous(selectedRendezVous.id)}
                  className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer ce rendez-vous"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez un rendez-vous</p>
                <p className="text-sm">Cliquez sur un rendez-vous pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout de rendez-vous avec style moderne */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Nouveau rendez-vous
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {formFields.map(({ name, label, icon: Icon, type = "text", color, textarea }) => (
                  <div key={name} className="flex items-center rounded-full overflow-hidden shadow-md h-12 w-full">
                    <div className={`p-3 flex items-center justify-center ${color} min-w-[48px]`}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    {name === "statut" ? (
                      <select
                        name={name}
                        value={newRendezVous[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en attente">En attente</option>
                        <option value="confirmé">Confirmé</option>
                        <option value="terminé">Terminé</option>
                        <option value="annulé">Annulé</option>
                      </select>
                    ) : textarea ? (
                      <textarea
                        name={name}
                        value={newRendezVous[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={newRendezVous[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                        min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
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
                    setNewRendezVous({
                      daterv: '',
                      heurerv: '',
                      note: '',
                      statut: 'en attente'
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
                  onClick={handleAddRendezVous}
                  disabled={!newRendezVous.daterv || !newRendezVous.heurerv || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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

export default RendezVousPatients;