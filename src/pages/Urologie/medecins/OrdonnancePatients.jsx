import React, { useEffect, useState } from 'react';
import { Pill, FileText, User, Plus, Trash2, Eye, CheckCircle, AlertCircle, X, Clock, Calendar } from 'lucide-react';

function OrdonnancePatients({ patientId = "12345" }) {
  const [ordonnances, setOrdonnances] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newOrdonnance, setNewOrdonnance] = useState({
    medicaments: [{ medicament: '', matin: '', midi: '', soir: '', quantite: '' }]
  });

  useEffect(() => {
    if (patientId) {
      loadOrdonnances();
    }
  }, [patientId]);

  const loadOrdonnances = async () => {
    try {
      console.log('🔄 Chargement des ordonnances pour le patient:', patientId);
      
      // Simulation d'une réponse API pour la démo
      const mockData = [
        {
          id: 1,
          patient_id: patientId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          medicament: [
            {
              id: 1,
              medicament: 'Paracétamol 500mg',
              matin: '1 cp',
              midi: '1 cp',
              soir: '1 cp',
              quantite: '30'
            }
          ]
        }
      ];
      
      setOrdonnances(mockData);
      
    } catch (error) {
      console.error('💥 Erreur lors du chargement des ordonnances:', error);
      setOrdonnances([]);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement des ordonnances'
      });
    }
  };

  const handleAddOrdonnance = async () => {
    // Validation des médicaments
    const medicamentsValides = newOrdonnance.medicaments.filter(med => 
      med.medicament && med.medicament.trim() !== ''
    );

    if (medicamentsValides.length === 0) {
      setMessage({
        type: 'error',
        text: 'Veuillez ajouter au moins un médicament'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const ordonnanceData = {
        patient_id: patientId,
        medicaments: medicamentsValides
      };
      
      console.log('📤 Données à envoyer:', ordonnanceData);
      
      // Simulation d'ajout pour la démo
      const newId = ordonnances.length + 1;
      const newOrdonnanceItem = {
        id: newId,
        patient_id: patientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        medicament: medicamentsValides.map((med, index) => ({
          id: index + 1,
          ...med
        }))
      };
      
      setOrdonnances(prev => [...prev, newOrdonnanceItem]);
      
      setMessage({
        type: 'success',
        text: 'Ordonnance ajoutée avec succès !'
      });
      
      // Réinitialiser le formulaire
      setNewOrdonnance({
        medicaments: [{ medicament: '', matin: '', midi: '', soir: '', quantite: '' }]
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ordonnance:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'ajout de l\'ordonnance. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrdonnance = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulation de suppression
      setOrdonnances(prev => prev.filter(ord => ord.id !== id));
      
      console.log('✅ Ordonnance supprimée');
      
      setMessage({
        type: 'success',
        text: 'Ordonnance supprimée avec succès !'
      });
      
      setSelectedOrdonnance(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ordonnance:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrdonnance = (ordonnance) => {
    setSelectedOrdonnance(ordonnance);
  };

  const handleMedicamentChange = (index, field, value) => {
    setNewOrdonnance(prev => ({
      ...prev,
      medicaments: prev.medicaments.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addMedicamentField = () => {
    setNewOrdonnance(prev => ({
      ...prev,
      medicaments: [...prev.medicaments, { medicament: '', matin: '', midi: '', soir: '', quantite: '' }]
    }));
  };

  const removeMedicamentField = (index) => {
    if (newOrdonnance.medicaments.length > 1) {
      setNewOrdonnance(prev => ({
        ...prev,
        medicaments: prev.medicaments.filter((_, i) => i !== index)
      }));
    }
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

  const formatPosologie = (med) => {
    const posologie = [];
    if (med.matin) posologie.push(`Matin: ${med.matin}`);
    if (med.midi) posologie.push(`Midi: ${med.midi}`);
    if (med.soir) posologie.push(`Soir: ${med.soir}`);
    return posologie.length > 0 ? posologie.join(' | ') : 'Non spécifiée';
  };

  if (!patientId) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Ordonnances</h2>
            <p className="text-gray-600">Veuillez sélectionner un patient pour gérer ses ordonnances</p>
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
          {/* Liste des ordonnances */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Pill className="w-6 h-6" />
                Liste des ordonnances
              </h3>
            </div>
            
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {console.log('🖥️ Rendu - Nombre d\'ordonnances:', ordonnances.length)}
                {console.log('🖥️ Rendu - Ordonnances:', ordonnances)}
                
                {ordonnances.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Aucune ordonnance enregistrée</p>
                    <p className="text-sm">Ajoutez une nouvelle ordonnance pour ce patient</p>
                  </div>
                ) : (
                  ordonnances.map((ordonnance, index) => {
                    console.log(`🔍 Ordonnance ${index}:`, ordonnance);
                    return (
                      <div
                        key={ordonnance.id || index}
                        onClick={() => handleSelectOrdonnance(ordonnance)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                          selectedOrdonnance?.id === ordonnance.id
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                              <Pill className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                Ordonnance #{ordonnance.id}
                              </div>
                              <div className="text-sm text-gray-600">
                                {ordonnance.medicament?.length || 0} médicament(s)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Ordonnance
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(ordonnance.createdAt)}
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
                Ajouter une ordonnance
              </button>
            </div>
          </div>

          {/* Détails de l'ordonnance sélectionnée */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Détails de l'ordonnance
              </h3>
            </div>
            
            {selectedOrdonnance ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Numéro d'ordonnance</span>
                    </div>
                    <span className="text-gray-900 font-semibold">#{selectedOrdonnance.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Date de création</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{formatDate(selectedOrdonnance.createdAt)}</span>
                  </div>
                  
                  {selectedOrdonnance.updatedAt && selectedOrdonnance.updatedAt !== selectedOrdonnance.createdAt && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">Dernière modification</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{formatDate(selectedOrdonnance.updatedAt)}</span>
                    </div>
                  )}
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Pill className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Médicaments prescrits</span>
                    </div>
                    <div className="space-y-3 ml-11">
                      {selectedOrdonnance.medicament && selectedOrdonnance.medicament.length > 0 ? (
                        selectedOrdonnance.medicament.map((med, index) => (
                          <div key={med.id || index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-gray-800">{med.medicament}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {formatPosologie(med)}
                            </div>
                            {med.quantite && (
                              <div className="text-sm text-gray-600">
                                Quantité: {med.quantite}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">Aucun médicament</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteOrdonnance(selectedOrdonnance.id)}
                  className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  title="Supprimer cette ordonnance"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez une ordonnance</p>
                <p className="text-sm">Cliquez sur une ordonnance pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'ordonnance avec formulaire compact */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle ordonnance
              </h3>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Médicaments
                  </h4>
                  <button
                    onClick={addMedicamentField}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Ajouter
                  </button>
                </div>
                
                {newOrdonnance.medicaments.map((medicament, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 text-sm flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        Médicament {index + 1}
                      </span>
                      {newOrdonnance.medicaments.length > 1 && (
                        <button
                          onClick={() => removeMedicamentField(index)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-full transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nom du médicament *
                        </label>
                        <input
                          type="text"
                          value={medicament.medicament}
                          onChange={(e) => handleMedicamentChange(index, 'medicament', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Paracétamol 500mg"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Matin
                          </label>
                          <input
                            type="text"
                            value={medicament.matin}
                            onChange={(e) => handleMedicamentChange(index, 'matin', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1 cp"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Midi
                          </label>
                          <input
                            type="text"
                            value={medicament.midi}
                            onChange={(e) => handleMedicamentChange(index, 'midi', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1 cp"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Soir
                          </label>
                          <input
                            type="text"
                            value={medicament.soir}
                            onChange={(e) => handleMedicamentChange(index, 'soir', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1 cp"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantité
                          </label>
                          <input
                            type="text"
                            value={medicament.quantite}
                            onChange={(e) => handleMedicamentChange(index, 'quantite', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewOrdonnance({
                      medicaments: [{ medicament: '', matin: '', midi: '', soir: '', quantite: '' }]
                    });
                    setMessage(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 text-sm"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleAddOrdonnance}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
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

export default OrdonnancePatients;