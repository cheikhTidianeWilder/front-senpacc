import React, { useEffect, useState } from 'react';
import { Activity, FileText, User, AlertCircle, CheckCircle, X, Plus, Trash2, Eye, Clock, Calendar } from 'lucide-react';

function RelevesPatients({ patientId }) {
  const [releves, setReleves] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReleve, setSelectedReleve] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newReleve, setNewReleve] = useState({
    titre: '',
    contenu: '',
    note: ''
  });

  useEffect(() => {
    if (patientId) {
      loadReleves();
    }
  }, [patientId]);

  const loadReleves = async () => {
    try {
      console.log('🔄 Chargement des relevés...');
      
      const response = await fetch('http://localhost:3000/api/urologie/releves/alLlreleves', {
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
      console.log('📋 Structure des données:', Object.keys(data));
      
      // Vérification des différentes structures possibles
      let relevesData = [];
      if (data.releves && Array.isArray(data.releves)) {
        relevesData = data.releves;
        console.log('✅ Trouvé data.releves:', relevesData.length, 'éléments');
      } else if (Array.isArray(data)) {
        relevesData = data;
        console.log('✅ Trouvé data direct:', relevesData.length, 'éléments');
      } else if (data.data && Array.isArray(data.data)) {
        relevesData = data.data;
        console.log('✅ Trouvé data.data:', relevesData.length, 'éléments');
      } else {
        console.log('⚠️ Aucune structure de données reconnue');
      }
      
      console.log('🎯 Relevés finaux à afficher:', relevesData);
      setReleves(relevesData);
      
    } catch (error) {
      console.error('💥 Erreur lors du chargement des relevés:', error);
      setReleves([]);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des relevés'
      });
    }
  };

  const handleAddReleve = async () => {
    if (!newReleve.titre || !newReleve.contenu) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires (titre et données)'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const releveData = {
        patientId: patientId,
        titre: newReleve.titre,
        contenu: newReleve.contenu,
        note: newReleve.note,
        date: new Date().toISOString()
      };
      
      console.log('📤 Données à envoyer:', releveData);
      
      const response = await fetch('http://localhost:3000/api/urologie/releves/ajoutreleves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(releveData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur lors de l'ajout du relevé: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Relevé ajouté:', result);
      
      setMessage({
        type: 'success',
        text: 'Relevé ajouté avec succès !'
      });
      
      // Recharger la liste des relevés
      await loadReleves();
      
      // Réinitialiser le formulaire
      setNewReleve({ titre: '', contenu: '', note: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du relevé:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'ajout du relevé. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReleve = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce relevé ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/releves/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du relevé');
      }
      
      console.log('✅ Relevé supprimé');
      
      setMessage({
        type: 'success',
        text: 'Relevé supprimé avec succès !'
      });
      
      // Recharger la liste après suppression
      await loadReleves();
      setSelectedReleve(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du relevé:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReleve = (releve) => {
    setSelectedReleve(releve);
  };

  const handleInputChange = (field, value) => {
    setNewReleve(prev => ({
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
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const calculerTempsEcoule = (dateString) => {
    if (!dateString) return 'Non défini';
    
    try {
      const maintenant = new Date();
      const dateReleve = new Date(dateString);
      
      if (dateReleve > maintenant) {
        return 'Futur';
      }
      
      const diffTime = maintenant - dateReleve;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffDays > 0) {
        return diffDays === 1 ? 'Il y a 1 jour' : `Il y a ${diffDays} jours`;
      } else if (diffHours > 0) {
        return diffHours === 1 ? 'Il y a 1 heure' : `Il y a ${diffHours} heures`;
      } else if (diffMinutes > 0) {
        return diffMinutes === 1 ? 'Il y a 1 minute' : `Il y a ${diffMinutes} minutes`;
      } else {
        return 'À l\'instant';
      }
    } catch (error) {
      return 'Erreur de calcul';
    }
  };

  // Champs du formulaire avec icônes colorées
  const formFields = [
    { name: "titre", label: "Titre *", icon: FileText, type: "text", color: "bg-blue-600" },
    { name: "contenu", label: "Données *", icon: Activity, type: "text", color: "bg-green-600" },
    { name: "note", label: "Notes", icon: FileText, color: "bg-purple-600", textarea: true },
  ];

  if (!patientId) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Relevés de Constantes</h2>
            <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses relevés</p>
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
          {/* Liste des relevés */}
          <div className="bg-gradient-to-br from-cyan-50 to-green-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Liste des relevés de constantes
              </h3>
            </div>
            
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {console.log('🖥️ Rendu - Nombre de relevés:', releves.length)}
                {console.log('🖥️ Rendu - Relevés:', releves)}
                
                {releves.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucun relevé enregistré</p>
                    <p className="text-sm">Ajoutez un nouveau relevé pour ce patient</p>
                  </div>
                ) : (
                  releves.map((releve, index) => {
                    console.log(`🔍 Relevé ${index}:`, releve);
                    return (
                      <div
                        key={releve.id || index}
                        onClick={() => handleSelectReleve(releve)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                          selectedReleve?.id === releve.id
                            ? 'bg-green-100 border-2 border-green-400 shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <Activity className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {releve.titre}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(releve.createdAt || releve.date)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">
                              {releve.contenu}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {calculerTempsEcoule(releve.createdAt || releve.date)}
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
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                Ajouter un relevé
              </button>
            </div>
          </div>

          {/* Détails du relevé sélectionné */}
          <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Détails du relevé
              </h3>
            </div>
            
            {selectedReleve ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Titre</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{selectedReleve.titre}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Données</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{selectedReleve.contenu}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {formatDate(selectedReleve.createdAt || selectedReleve.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Temps écoulé</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {calculerTempsEcoule(selectedReleve.createdAt || selectedReleve.date)}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Notes</span>
                    </div>
                    <p className="text-gray-900 ml-11 bg-gray-50 p-3 rounded-lg">
                      {selectedReleve.note || 'Aucune note'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteReleve(selectedReleve.id)}
                  className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer ce relevé"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez un relevé</p>
                <p className="text-sm">Cliquez sur un relevé pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout de relevé avec style moderne */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6 rounded-t-lg">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Nouveau relevé
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {formFields.map(({ name, label, icon: Icon, type = "text", color, textarea }) => (
                  <div key={name} className={`flex items-center rounded-full overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
                    <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    {textarea ? (
                      <textarea
                        name={name}
                        value={newReleve[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={newReleve[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={label.replace(' *', '')}
                        className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
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
                    setNewReleve({
                      titre: '',
                      contenu: '',
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
                  onClick={handleAddReleve}
                  disabled={!newReleve.titre || !newReleve.contenu || loading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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

export default RelevesPatients;