import React, { useEffect, useState } from 'react';
import { 
  Activity, FileText, User, AlertCircle, CheckCircle, X, Plus, Trash2, 
  Eye, Clock, Calendar, Printer, Stethoscope, ClipboardList, RefreshCw, 
  Loader, UserCheck, Search, Heart, Brain, Zap, Radio, Scan, TestTube
} from 'lucide-react';

function ParacliniquePatients({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [paracliniques, setParacliniques] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedParaclinique, setSelectedParaclinique] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newParaclinique, setNewParaclinique] = useState({
    examen: '',
    diagnostic: '',
    examens_selectionnes: []
  });

  const typesExamens = {
    echographie: {
      nom: "Échographies",
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      examens: [
        "Échographie rénale et vésicale",
        "Échographie prostatique sus-pubienne", 
        "Échographie scrotale",
        "Échographie pénienne avec test rigidité",
        "Échographie rénale Doppler"
      ]
    },
    radiographie: {
      nom: "Radiographies",
      icon: Radio,
      color: "from-green-500 to-green-600",
      examens: [
        "ASP (Abdomen sans préparation)",
        "Urographie intraveineuse",
        "Cystographie rétrograde",
        "Urétrocystographie rétrograde"
      ]
    },
    scanner: {
      nom: "Scanner/IRM",
      icon: Scan,
      color: "from-purple-500 to-purple-600",
      examens: [
        "Scanner abdomino-pelvien avec injection",
        "Scanner abdomino-pelvien sans injection", 
        "IRM pelvienne",
        "IRM prostatique multiparamétrique",
        "Uro-scanner"
      ]
    },
    biologie: {
      nom: "Biologie",
      icon: TestTube,
      color: "from-red-500 to-red-600",
      examens: [
        "ECBU + Antibiogramme",
        "Créatininémie + DFG",
        "Urée sanguine",
        "PSA total et libre",
        "Testostéronémie",
        "Cytologie urinaire"
      ]
    },
    fonctionnel: {
      nom: "Fonctionnel",
      icon: Heart,
      color: "from-orange-500 to-orange-600",
      examens: [
        "Débitmétrie urinaire",
        "Cystomanométrie",
        "Bilan urodynamique complet",
        "Résidu post-mictionnel"
      ]
    }
  };

  const loadPatientInfo = async () => {
    if (!patientId) return;
    try {
      const response = await fetch('http://localhost:3000/api/urologie/consultations/consulterPatientL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: patientId })
      });
      const result = await response.json();
      if (result.success && result.patient) {
        setPatient(result.patient);
      }
    } catch (error) {
      console.error('Erreur patient:', error);
    }
  };

  const loadParacliniques = async () => {
    if (!patientId) return;
    
    setLoadingList(true);
    setMessage(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/paracliniques/patient/${patientId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      let paracliniquesData = [];
      
      if (data?.paracliniques) paracliniquesData = data.paracliniques;
      else if (Array.isArray(data)) paracliniquesData = data;
      
      const paracliniquesValides = paracliniquesData
        .filter(p => p && !p.supprimer)
        .map(p => ({
          id: p.id,
          examen: p.examen || '',
          diagnostic: p.diagnostic || '',
          user_id: p.user_id,
          consultation_id: p.consultation_id,
          medecin_id: p.medecin_id,
          createdAt: p.createdAt,
          medecin: p.medecin || null
        }));
      
      setParacliniques(paracliniquesValides);
      
    } catch (error) {
      console.error('Erreur chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
      setParacliniques([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadPatientInfo();
      loadParacliniques();
    }
  }, [patientId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddParaclinique = async () => {
    if (!newParaclinique.examen?.trim() && newParaclinique.examens_selectionnes.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins un examen' });
      return;
    }

    setLoading(true);
    try {
      const sessionRes = await fetch('http://localhost:3000/api/urologie/session/get', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!sessionRes.ok) throw new Error('Session invalide');
      
      const sessionData = await sessionRes.json();
      
      let examensFinaux = [...newParaclinique.examens_selectionnes];
      if (newParaclinique.examen?.trim()) {
        examensFinaux.push(newParaclinique.examen.trim());
      }
      
      const paraclinqueData = {
        examen: examensFinaux.join('\n• '),
        diagnostic: newParaclinique.diagnostic?.trim() || null,
        medecin_id: sessionData.user_id || 1,
        consultation_id: null,
        user_id: patientId
      };
      
      const response = await fetch('http://localhost:3000/api/urologie/paracliniques/ajouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paraclinqueData),
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      
      setMessage({ type: 'success', text: 'Prescription ajoutée !' });
      await loadParacliniques();
      setNewParaclinique({ examen: '', diagnostic: '', examens_selectionnes: [] });
      setShowAddForm(false);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'ajout' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParaclinique = async (id) => {
    if (!confirm('Supprimer cette prescription ?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/paracliniques/delete/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ supprimer: true }),
      });
      
      if (!response.ok) throw new Error('Erreur suppression');
      
      setMessage({ type: 'success', text: 'Prescription supprimée' });
      setParacliniques(prev => prev.filter(p => p.id !== id));
      setSelectedParaclinique(null);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur suppression' });
    } finally {
      setLoading(false);
    }
  };

  const handleExamenSelection = (examen) => {
    setNewParaclinique(prev => {
      const examens = [...prev.examens_selectionnes];
      const index = examens.indexOf(examen);
      
      if (index > -1) {
        examens.splice(index, 1);
      } else {
        examens.push(examen);
      }
      
      return { ...prev, examens_selectionnes: examens };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const calculerAge = (dateNaissance) => {
    if (!dateNaissance) return 'Non défini';
    try {
      const naissance = new Date(dateNaissance);
      const aujourd = new Date();
      let age = aujourd.getFullYear() - naissance.getFullYear();
      const mois = aujourd.getMonth() - naissance.getMonth();
      
      if (mois < 0 || (mois === 0 && aujourd.getDate() < naissance.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'Non défini';
    }
  };

  const handlePrintParaclinique = (paraclinique) => {
    if (!paraclinique || !patient) return;

    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const prescriptionDate = formatDate(paraclinique.createdAt);
    const ageCalcule = patient.user?.date_nai ? calculerAge(patient.user.date_nai) : '';
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Prescription Paraclinique</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-box { background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .diagnostic { background: #fef3e2; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b; }
          .examens { background: white; border: 1px solid #e2e8f0; border-radius: 6px; }
          .examens-header { background: #dbeafe; padding: 15px; font-weight: bold; }
          .examens-body { padding: 20px; }
          .signature { border: 2px dashed #cbd5e1; height: 80px; margin: 20px 0; border-radius: 6px; }
          .footer { margin-top: 20px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Prescription d'Examens Paracliniques</h1>
        </div>
        
        <div class="patient-info">
          <div class="info-box">
            <h3>Patient</h3>
            <p><strong>Nom:</strong> ${patient.user?.prenom || ''} ${patient.user?.nom || ''}</p>
            <p><strong>Âge:</strong> ${ageCalcule ? ageCalcule + ' ans' : ''}</p>
            <p><strong>Sexe:</strong> ${patient.user?.sexe || ''}</p>
          </div>
          <div class="info-box">
            <h3>Prescription</h3>
            <p><strong>Date:</strong> ${prescriptionDate}</p>
            <p><strong>Médecin:</strong> Dr. ${paraclinique.medecin?.user?.prenom || ''} ${paraclinique.medecin?.user?.nom || ''}</p>
          </div>
        </div>
        
        <div class="diagnostic">
          <h3>Diagnostic / Indication</h3>
          <p>${paraclinique.diagnostic || 'Non spécifié'}</p>
        </div>
        
        <div class="examens">
          <div class="examens-header">Examens Prescrits</div>
          <div class="examens-body">
            <pre>${paraclinique.examen || 'Examens non spécifiés'}</pre>
          </div>
        </div>
        
        <div class="signature">
          <p style="text-align: center; margin-top: 30px; color: #64748b;">Signature et cachet</p>
        </div>
        
        <div class="footer">
          Document généré le ${currentDate} - Système SENPACS
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const filteredCategories = Object.entries(typesExamens).map(([key, type]) => ({
    key,
    type,
    filteredExamens: type.examens.filter(examen =>
      examen.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(({ filteredExamens }) => filteredExamens.length > 0);

  if (!patientId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Prescriptions Paracliniques</h2>
          <p className="text-gray-500">Aucun patient sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      {/* Header compact */}
      {patient && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold">Prescriptions Paracliniques</h1>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? 
              <CheckCircle className="w-4 h-4" /> : 
              <AlertCircle className="w-4 h-4" />
            }
            <span className="text-sm">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Liste des prescriptions */}
        <div className="bg-white rounded-lg shadow border">
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                Prescriptions ({paracliniques.length})
              </h3>
            </div>
          </div>
          
          <div className="p-4">
            {loadingList ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm">Chargement...</span>
              </div>
            ) : paracliniques.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucune prescription
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Aucun examen prescrit pour ce patient
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle prescription
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {paracliniques.map((paraclinique) => (
                    <div
                      key={paraclinique.id}
                      onClick={() => setSelectedParaclinique(paraclinique)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedParaclinique?.id === paraclinique.id
                          ? 'bg-blue-50 border-2 border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">
                            {paraclinique.examen?.substring(0, 60)}...
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(paraclinique.createdAt)}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-600">
                          {paraclinique.diagnostic?.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle prescription
                </button>
              </>
            )}
          </div>
        </div>

        {/* Détails de la prescription */}
        <div className="bg-white rounded-lg shadow border">
          <div className="bg-green-50 p-4 border-b">
            <h3 className="font-semibold text-green-900 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Détails de la prescription
            </h3>
          </div>
          
          {selectedParaclinique ? (
            <div className="p-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-700 mb-1 text-sm">Examens prescrits</div>
                  <div className="text-sm text-gray-900 whitespace-pre-line">
                    {selectedParaclinique.examen || 'Non défini'}
                  </div>
                </div>
                
                {selectedParaclinique.diagnostic && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-gray-700 mb-1 text-sm">Diagnostic</div>
                    <div className="text-sm text-gray-900">
                      {selectedParaclinique.diagnostic}
                    </div>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-gray-700 mb-1 text-sm">Date de prescription</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedParaclinique.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handlePrintParaclinique(selectedParaclinique)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
                <button
                  onClick={() => handleDeleteParaclinique(selectedParaclinique.id)}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Sélectionnez une prescription</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de prescription compact */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">Nouvelle prescription</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewParaclinique({ examen: '', diagnostic: '', examens_selectionnes: [] });
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Barre de recherche */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un examen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Examens sélectionnés */}
              {newParaclinique.examens_selectionnes.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 mb-2 text-sm">
                    {newParaclinique.examens_selectionnes.length} examen(s) sélectionné(s)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newParaclinique.examens_selectionnes.map((examen, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        {examen.substring(0, 30)}...
                        <button
                          onClick={() => handleExamenSelection(examen)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
                
              {/* Grille des catégories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {(searchTerm ? filteredCategories : Object.entries(typesExamens).map(([key, type]) => ({ key, type, filteredExamens: type.examens }))).map(({ key, type, filteredExamens }) => {
                  const IconComponent = type.icon;
                  const selectedCount = filteredExamens.filter(examen => 
                    newParaclinique.examens_selectionnes.includes(examen)
                  ).length;

                  return (
                    <div key={key} className="border rounded-lg overflow-hidden">
                      <div className={`bg-gradient-to-r ${type.color} p-2`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-white" />
                            <h5 className="text-sm font-medium text-white">{type.nom}</h5>
                          </div>
                          {selectedCount > 0 && (
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-white text-xs">
                              {selectedCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 max-h-32 overflow-y-auto">
                        {filteredExamens.map((examen, index) => {
                          const isSelected = newParaclinique.examens_selectionnes.includes(examen);
                          return (
                            <label
                              key={index}
                              className={`flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-50 ${
                                isSelected ? 'bg-blue-50' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleExamenSelection(examen)}
                                className="w-3 h-3 text-blue-600"
                              />
                              <span className={`text-xs ${isSelected ? 'font-medium' : ''}`}>
                                {examen}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Champs texte */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autres examens
                  </label>
                  <textarea
                    value={newParaclinique.examen}
                    onChange={(e) => setNewParaclinique(prev => ({ ...prev, examen: e.target.value }))}
                    placeholder="Autres examens spécifiques..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnostic / Indication
                  </label>
                  <input
                    type="text"
                    value={newParaclinique.diagnostic}
                    onChange={(e) => setNewParaclinique(prev => ({ ...prev, diagnostic: e.target.value }))}
                    placeholder="Indication pour les examens..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewParaclinique({ examen: '', diagnostic: '', examens_selectionnes: [] });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddParaclinique}
                  disabled={
                    (newParaclinique.examens_selectionnes.length === 0 && !newParaclinique.examen?.trim()) || 
                    loading
                  }
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Prescription...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Prescrire ({newParaclinique.examens_selectionnes.length + (newParaclinique.examen?.trim() ? 1 : 0)})
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

export default ParacliniquePatients;