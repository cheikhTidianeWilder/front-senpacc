import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, X, Home, DollarSign, Building, List, Grid3X3, Filter } from 'lucide-react';

function ChambreManagement() {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingChambre, setEditingChambre] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filterEtage, setFilterEtage] = useState('');

  const [formData, setFormData] = useState({
    etage: '',
    numero: '',
    tarif_journalier: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadChambres();
  }, []);

  const loadChambres = async () => {
    setLoading(true);
    setError('');
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
      } else {
        setError(data.msg || 'Erreur lors du chargement des chambres');
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur réseau : impossible de charger les chambres');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.etage || formData.etage.trim() === '') {
      errors.etage = 'L\'étage est requis';
    }
    
    if (!formData.numero || formData.numero.trim() === '') {
      errors.numero = 'Le numéro est requis';
    }
    
    if (!formData.tarif_journalier || formData.tarif_journalier.trim() === '') {
      errors.tarif_journalier = 'Le tarif journalier est requis';
    } else if (isNaN(formData.tarif_journalier) || parseFloat(formData.tarif_journalier) <= 0) {
      errors.tarif_journalier = 'Le tarif doit être un nombre positif';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const url = editingChambre 
        ? `http://localhost:3000/api/urologie/chambres/${editingChambre.id}/modifier`
        : 'http://localhost:3000/api/urologie/chambres/ajouter';
      
      const method = editingChambre ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          etage: formData.etage.trim(),
          numero: formData.numero.trim(),
          tarif_journalier: parseFloat(formData.tarif_journalier)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 200) {
        setSuccess(editingChambre ? 'Chambre modifiée avec succès !' : 'Chambre ajoutée avec succès !');
        await loadChambres();
        resetForm();
      } else {
        setError(data.msg || 'Erreur lors de l\'opération');
      }
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError('Erreur réseau : impossible de traiter la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChambre = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) return;
    
    setDeletingId(id);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`http://localhost:3000/api/urologie/chambres/${id}/supprimer`, {
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
        setSuccess('Chambre supprimée avec succès !');
        await loadChambres();
      } else {
        setError(data.msg || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur réseau : impossible de supprimer la chambre');
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({ etage: '', numero: '', tarif_journalier: '' });
    setFormErrors({});
    setShowForm(false);
    setEditingChambre(null);
  };

  const handleEdit = (chambre) => {
    setEditingChambre(chambre);
    setFormData({
      etage: chambre.etage || '',
      numero: chambre.numero || '',
      tarif_journalier: chambre.tarif_journalier ? parseFloat(chambre.tarif_journalier).toString() : ''
    });
    setShowForm(true);
  };

  const filteredChambres = chambres.filter(chambre => {
    if (!chambre || chambre.supprimer) return false;
    
    const matchesSearch = 
      (chambre.numero && chambre.numero.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (chambre.etage && chambre.etage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEtage = !filterEtage || chambre.etage === filterEtage;
    
    return matchesSearch && matchesEtage;
  });

  const stats = {
    total: chambres.filter(c => !c.supprimer).length,
    etages: [...new Set(chambres.filter(c => !c.supprimer && c.etage).map(c => c.etage))].length,
    tarifMoyen: chambres.filter(c => !c.supprimer).length > 0 
      ? Math.round(chambres.filter(c => !c.supprimer).reduce((sum, c) => sum + (parseFloat(c.tarif_journalier) || 0), 0) / chambres.filter(c => !c.supprimer).length)
      : 0
  };

  const etages = [...new Set(chambres.filter(c => c.etage).map(c => c.etage))].sort();

  // Auto-hide messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header simple avec animation */}
        <div className="mb-6 opacity-0 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 transform transition-all duration-300 hover:scale-105">
            Gestion des Chambres
          </h1>
          <p className="text-gray-600">Gérez vos chambres d'hospitalisation</p>
        </div>

        {/* Notifications avec animations */}
        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between transform transition-all duration-300 animate-slide-down shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  <span>{error}</span>
                </div>
                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 transform transition-all duration-200 hover:scale-110">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between transform transition-all duration-300 animate-slide-down shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 animate-bounce" />
                  <span>{success}</span>
                </div>
                <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 transform transition-all duration-200 hover:scale-110">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Statistiques avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total chambres</p>
                <p className="text-xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-500 transform transition-all duration-300 hover:scale-110 hover:rotate-12" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Étages</p>
                <p className="text-xl font-bold text-gray-900 transition-all duration-300 hover:text-green-600">
                  {stats.etages}
                </p>
              </div>
              <Home className="w-8 h-8 text-green-500 transform transition-all duration-300 hover:scale-110 hover:-rotate-12" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tarif moyen</p>
                <p className="text-xl font-bold text-gray-900 transition-all duration-300 hover:text-orange-600">
                  {stats.tarifMoyen.toLocaleString()} FCFA
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500 transform transition-all duration-300 hover:scale-110 hover:rotate-12" />
            </div>
          </div>
        </div>

        {/* Barre de recherche et contrôles avec animations */}
        <div className="bg-white rounded-lg border p-4 mb-6 transform transition-all duration-300 hover:shadow-lg animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 transition-all duration-300 hover:text-blue-500" />
              <input
                type="text"
                placeholder="Rechercher par numéro ou étage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 focus:scale-105"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-lg' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <Filter className={`w-4 h-4 transition-all duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                Filtrer
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-all duration-300 transform hover:scale-105 ${
                    viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all duration-300 transform hover:scale-105 ${
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-4 h-4 transition-all duration-300 hover:rotate-90" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Filtres avec animation */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-down">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
                  <select
                    value={filterEtage}
                    onChange={(e) => setFilterEtage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400"
                  >
                    <option value="">Tous les étages</option>
                    {etages.map(etage => (
                      <option key={etage} value={etage}>{etage}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilterEtage('')}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal formulaire avec animations */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-md w-full p-6 transform transition-all duration-300 animate-modal-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingChambre ? 'Modifier la chambre' : 'Ajouter une chambre'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transform transition-all duration-200 hover:scale-110 hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="transform transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Étage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="etage"
                    value={formData.etage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      formErrors.etage ? 'border-red-300 animate-shake' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ex: 1, 2, RDC..."
                  />
                  {formErrors.etage && (
                    <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.etage}</p>
                  )}
                </div>

                <div className="transform transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      formErrors.numero ? 'border-red-300 animate-shake' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ex: 101, A12..."
                  />
                  {formErrors.numero && (
                    <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.numero}</p>
                  )}
                </div>

                <div className="transform transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarif journalier (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="tarif_journalier"
                    value={formData.tarif_journalier}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      formErrors.tarif_journalier ? 'border-red-300 animate-shake' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Ex: 25000"
                  />
                  {formErrors.tarif_journalier && (
                    <p className="mt-1 text-sm text-red-600 animate-fade-in">{formErrors.tarif_journalier}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {submitting ? 'Traitement...' : (editingChambre ? 'Modifier' : 'Ajouter')}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transform transition-all duration-300 hover:scale-105"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal avec animations */}
        <div className="bg-white rounded-lg border transform transition-all duration-300 hover:shadow-lg animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Chambres ({filteredChambres.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="absolute inset-0 animate-spin rounded-full h-8 w-8 border-t-2 border-blue-300 mx-auto mb-4 animation-delay-150"></div>
              </div>
              <p className="text-gray-600 animate-pulse">Chargement...</p>
            </div>
          ) : filteredChambres.length === 0 ? (
            <div className="p-8 text-center animate-fade-in">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4 transform transition-all duration-300 hover:scale-110" />
              <p className="text-gray-600 mb-2">
                {searchTerm ? 'Aucune chambre trouvée' : 'Aucune chambre disponible'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Essayez avec d\'autres termes' : 'Commencez par ajouter une chambre'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChambres.map((chambre, index) => (
                  <div 
                    key={chambre.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Étage {chambre.etage}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 transition-all duration-300 hover:text-blue-600">
                        {chambre.numero}
                      </h3>
                      <div className="text-lg font-semibold text-green-600 transition-all duration-300 hover:scale-110">
                        {parseFloat(chambre.tarif_journalier || 0).toLocaleString()} FCFA
                      </div>
                      <p className="text-sm text-gray-500">par jour</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(chambre)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteChambre(chambre.id)}
                        disabled={deletingId === chambre.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                      >
                        {deletingId === chambre.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarif journalier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChambres.map((chambre, index) => (
                    <tr 
                      key={chambre.id} 
                      className="hover:bg-gray-50 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 transition-all duration-300 hover:text-blue-600">
                        {chambre.etage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 transition-all duration-300 hover:text-blue-600">
                        {chambre.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 transition-all duration-300 hover:scale-110">
                        {parseFloat(chambre.tarif_journalier || 0).toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(chambre)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-all duration-300 transform hover:scale-110"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChambre(chambre.id)}
                            disabled={deletingId === chambre.id}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50 transition-all duration-300 transform hover:scale-110"
                          >
                            {deletingId === chambre.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
      
      {/* Styles CSS pour les animations personnalisées */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}

export default ChambreManagement;