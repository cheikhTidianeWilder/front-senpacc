import React, { useState, useEffect } from 'react';

function ConsultationPatient({ patientId }) {
    const [consultations, setConsultations] = useState([]);
    const [patient, setPatient] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [expandedConsultation, setExpandedConsultation] = useState(null);
    const [error, setError] = useState(null);

    const [newConsultation, setNewConsultation] = useState({
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

    const [showForm, setShowForm] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleSearch = async () => {
        console.log('Début de la recherche pour:', searchValue);

        if (!searchValue.trim()) {
            alert("Entrez une valeur pour la recherche.");
            return;
        }

        try {
            setSearchLoading(true);
            setError(null);

            console.log('Envoi de la requête...');

            const response = await fetch(`http://localhost:3000/api/urologie/consultations/consulterflexible`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ identifiant: searchValue })
            });

            console.log('Réponse reçue, status:', response.status);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Données reçues:', data);

            if (data?.patient?.id) {
                setPatient(data.patient);
                setShowForm(true);
                await loadConsultations(data.patient.id);
            } else {
                setPatient(null);
                setConsultations([]);
                setShowForm(false);
                alert('Patient non trouvé.');
            }
        } catch (err) {
            console.error('Erreur de recherche patient :', err);
            setError(`Erreur lors de la recherche: ${err.message}`);
            alert('Erreur lors de la recherche du patient.');
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            loadConsultations(patientId);
            setShowForm(true);
        }
    }, [patientId]);

    const loadConsultations = async (targetPatientId) => {
        try {
            const id = targetPatientId || patientId;
            console.log('Chargement des consultations pour patient ID:', id);

            const response = await fetch(`http://localhost:3000/api/urologie/consultations/patient/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Consultations reçues:', data);

            setConsultations(data?.consultations || data?.data || data || []);
        } catch (error) {
            console.error('Erreur chargement consultations:', error);
            setConsultations([]);
        }
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Date non disponible';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Erreur formatage date:', error);
            return dateString;
        }
    };

    const toggleExpansion = (index) => {
        setExpandedConsultation(expandedConsultation === index ? null : index);
    };

    const renderField = (label, value, unit = '') => {
        if (!value || value === '') return null;
        return (
            <div className="mb-2">
                <span className="font-medium text-gray-700">{label}:</span>
                <span className="ml-2 text-gray-900">{value}{unit}</span>
            </div>
        );
    };

    const renderSection = (title, fields) => {
        const hasContent = fields.some(field => field.value && field.value !== '');
        if (!hasContent) return null;

        return (
            <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">{title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    {fields.map((field, idx) => (
                        <div key={idx}>
                            {renderField(field.label, field.value, field.unit)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFormField = (label, name, type = 'text', placeholder = '', required = false) => {
        const value = newConsultation[name] || '';

        const handleChange = (e) => {
            setNewConsultation(prev => ({
                ...prev,
                [name]: e.target.value
            }));
        };

        if (type === 'textarea') {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={required}
                    />
                </div>
            );
        }

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    step={type === 'number' ? '0.1' : undefined}
                    min={type === 'number' ? '0' : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={required}
                />
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!patient?.id) {
            alert('Aucun patient sélectionné.');
            return;
        }

        // Validation des champs requis
        if (!newConsultation.motif.trim()) {
            alert('Le motif de consultation est requis.');
            return;
        }

        if (!newConsultation.datecons) {
            alert('La date de consultation est requise.');
            return;
        }

        try {
            setSaveLoading(true);

            // Fonction pour convertir les chaînes vides en null ou garder les valeurs numériques
            const convertToNumberOrNull = (value) => {
                if (!value || value === '') return null;
                const num = parseFloat(value);
                return isNaN(num) ? null : num;
            };

            // Préparer les données de consultation avec la bonne structure
            const consultationData = {
                patient_id: patient.id,
                datecons: newConsultation.datecons,
                motif: newConsultation.motif.trim(),
                temperature: convertToNumberOrNull(newConsultation.temperature),
                taille: convertToNumberOrNull(newConsultation.taille),
                poids: convertToNumberOrNull(newConsultation.poids),
                IMC: convertToNumberOrNull(newConsultation.IMC),
                frequence: convertToNumberOrNull(newConsultation.frequence),
                pression: newConsultation.pression.trim() || null,
                glycemie: convertToNumberOrNull(newConsultation.glycemie),
                saturation: convertToNumberOrNull(newConsultation.saturation),
                tdr: newConsultation.tdr.trim() || null,
                autresParaclinique: newConsultation.autresParaclinique.trim() || null,
                diagnostic: newConsultation.diagnostic.trim() || null,
                o2r: newConsultation.o2r.trim() || null,
                traitement: newConsultation.traitement.trim() || null,
                besoinpf: newConsultation.besoinpf.trim() || null,
                observation: newConsultation.observation.trim() || null,
                note: newConsultation.note.trim() || null
            };

            console.log('Données à envoyer:', consultationData);

            const response = await fetch('http://localhost:3000/api/urologie/consultations/enreR', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(consultationData)
            });

            console.log('Réponse du serveur, status:', response.status);

            // Vérifier si la réponse est au format JSON
            const responseText = await response.text();
            let result;
            
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Erreur de parsing JSON:', parseError);
                console.error('Réponse brute:', responseText);
                throw new Error('Réponse du serveur non valide');
            }

            if (!response.ok) {
                console.error('Erreur du serveur:', result);
                throw new Error(result.message || `Erreur HTTP: ${response.status}`);
            }

            console.log('Consultation créée avec succès:', result);

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

            // Recharger les consultations
            await loadConsultations(patient.id);

            // Masquer le formulaire
            setShowForm(false);

            alert('Consultation enregistrée avec succès !');

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert(`Erreur lors de l'enregistrement: ${error.message}`);
        } finally {
            setSaveLoading(false);
        }
    };

    // Affichage d'erreur si nécessaire
    if (error) {
        return (
            <div className="mt-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 font-semibold mb-2">Erreur</h2>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            {/* 🔍 Barre de recherche */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                    Rechercher un patient (par CNI ou cartePatient) :
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Entrer la CNI ou la carte patient"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                    >
                        {searchLoading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </div>
            </div>

            {!patient ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center text-gray-500">
                        Veuillez rechercher un patient pour afficher ses consultations.
                    </div>
                </div>
            ) : (
                <div>
                    {/* Informations du patient */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h2 className="text-xl font-semibold mb-2 text-blue-800">
                            Patient : {patient.nom} {patient.prenom}
                        </h2>
                        <div className="text-sm text-blue-600">
                            ID: {patient.id} |
                            {patient.cni && ` CNI: ${patient.cni} |`}
                            {patient.cartePatient && ` Carte: ${patient.cartePatient}`}
                        </div>
                    </div>

                    {/* Formulaire de nouvelle consultation */}
                    {showForm && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Nouvelle Consultation
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Date de consultation */}
                                    {renderFormField('Date de consultation', 'datecons', 'date', '', true)}

                                    {/* Motif */}
                                    <div className="md:col-span-2">
                                        {renderFormField('Motif de consultation', 'motif', 'textarea', 'Décrivez le motif de la consultation...', true)}
                                    </div>

                                    {/* Constantes vitales */}
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                                            Constantes vitales
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {renderFormField('Température (°C)', 'temperature', 'number', '37.0')}
                                            {renderFormField('Taille (cm)', 'taille', 'number', '170')}
                                            {renderFormField('Poids (kg)', 'poids', 'number', '70')}
                                            {renderFormField('IMC (kg/m²)', 'IMC', 'number', '24.5')}
                                            {renderFormField('Fréquence cardiaque (bpm)', 'frequence', 'number', '80')}
                                            {renderFormField('Pression artérielle (mmHg)', 'pression', 'text', '120/80')}
                                            {renderFormField('Glycémie (mg/dL)', 'glycemie', 'number', '90')}
                                            {renderFormField('Saturation O2 (%)', 'saturation', 'number', '98')}
                                        </div>
                                    </div>

                                    {/* Examens paracliniques */}
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                                            Examens paracliniques
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {renderFormField('TDR', 'tdr', 'text', 'Résultat du TDR')}
                                            {renderFormField('Autres examens', 'autresParaclinique', 'textarea', 'Autres examens réalisés...')}
                                        </div>
                                    </div>

                                    {/* Diagnostic et traitement */}
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                                            Diagnostic et traitement
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {renderFormField('Diagnostic', 'diagnostic', 'textarea', 'Diagnostic établi...')}
                                            {renderFormField('O2R', 'o2r', 'text', 'Oxygénothérapie')}
                                            {renderFormField('Traitement', 'traitement', 'textarea', 'Traitement prescrit...')}
                                        </div>
                                    </div>

                                    {/* Suivi et observations */}
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                                            Suivi et observations
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {renderFormField('Besoin PF', 'besoinpf', 'text', 'Besoins en planification familiale')}
                                            {renderFormField('Observation', 'observation', 'textarea', 'Observations cliniques...')}
                                            {renderFormField('Note', 'note', 'textarea', 'Notes complémentaires...')}
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                    >
                                        {saveLoading ? 'Enregistrement...' : 'Enregistrer la consultation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Bouton pour afficher le formulaire si masqué */}
                    {!showForm && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                + Nouvelle Consultation
                            </button>
                        </div>
                    )}

                    {/* Historique des consultations */}
                    {consultations.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-center text-gray-500">
                                Aucune consultation trouvée pour ce patient.
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Historique des consultations ({consultations.length})
                            </h3>

                            {consultations.map((c, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
                                    {/* En-tête de la consultation */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleExpansion(idx)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {formatDate(c.datecons)}
                                                    </span>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        Consultation #{idx + 1}
                                                    </span>
                                                </div>
                                                <div className="font-semibold text-gray-800 mb-1">
                                                    Motif: {c.motif || 'Non spécifié'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Diagnostic: {c.diagnostic || 'Non spécifié'}
                                                </div>
                                            </div>
                                            <div className="text-gray-400">
                                                {expandedConsultation === idx ? '▼' : '▶'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Détails de la consultation */}
                                    {expandedConsultation === idx && (
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            <div className="pt-4">

                                                {/* Constantes vitales */}
                                                {renderSection('Constantes vitales', [
                                                    { label: 'Température', value: c.temperature, unit: '°C' },
                                                    { label: 'Taille', value: c.taille, unit: ' cm' },
                                                    { label: 'Poids', value: c.poids, unit: ' kg' },
                                                    { label: 'IMC', value: c.IMC, unit: ' kg/m²' },
                                                    { label: 'Fréquence cardiaque', value: c.frequence, unit: ' bpm' },
                                                    { label: 'Pression artérielle', value: c.pression, unit: ' mmHg' },
                                                    { label: 'Glycémie', value: c.glycemie, unit: ' mg/dL' },
                                                    { label: 'Saturation O2', value: c.saturation, unit: '%' }
                                                ])}

                                                {/* Examens paracliniques */}
                                                {renderSection('Examens paracliniques', [
                                                    { label: 'TDR', value: c.tdr },
                                                    { label: 'Autres examens', value: c.autresParaclinique }
                                                ])}

                                                {/* Diagnostic et traitement */}
                                                {renderSection('Diagnostic et traitement', [
                                                    { label: 'Diagnostic', value: c.diagnostic },
                                                    { label: 'O2R', value: c.o2r },
                                                    { label: 'Traitement', value: c.traitement }
                                                ])}

                                                {/* Suivi et observations */}
                                                {renderSection('Suivi et observations', [
                                                    { label: 'Besoin PF', value: c.besoinpf },
                                                    { label: 'Observation', value: c.observation },
                                                    { label: 'Note', value: c.note }
                                                ])}

                                                {/* Informations système */}
                                                {(c.createdAt || c.updatedAt) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <div className="text-xs text-gray-500">
                                                            {c.createdAt && (
                                                                <div>Créé le : {formatDate(c.createdAt)}</div>
                                                            )}
                                                            {c.updatedAt && c.updatedAt !== c.createdAt && (
                                                                <div>Modifié le : {formatDate(c.updatedAt)}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConsultationPatient;

// import React, { useState, useEffect } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import {
//   User, Plus, X, CheckCircle, AlertCircle, ClipboardList, Stethoscope, Calendar, Thermometer, Ruler, Weight, Activity, HeartPulse, Droplets, Syringe, NotebookPen, Pill, FileText, Search, Users, Clock, TrendingUp, Shield, Database, BarChart3, Zap, Target, Award
// } from 'lucide-react';

// function ConsultationPatient({ patientId }) {
//   const [consultations, setConsultations] = useState([]);
//   const [patient, setPatient] = useState(null);
//   const [searchValue, setSearchValue] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [expandedConsultation, setExpandedConsultation] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [saveLoading, setSaveLoading] = useState(false);

//   const [newConsultation, setNewConsultation] = useState({
//     datecons: new Date().toISOString().split('T')[0],
//     motif: '',
//     temperature: '',
//     taille: '',
//     poids: '',
//     IMC: '',
//     frequence: '',
//     pression: '',
//     glycemie: '',
//     saturation: '',
//     tdr: '',
//     autresParaclinique: '',
//     diagnostic: '',
//     o2r: '',
//     traitement: '',
//     besoinpf: '',
//     observation: '',
//     note: ''
//   });

//   // Champs du formulaire avec icônes colorées
//   const formFields = [
//     { name: "datecons", label: "Date *", icon: Calendar, type: "date", color: "bg-cyan-600" },
//     { name: "motif", label: "Motif *", icon: ClipboardList, textarea: true, color: "bg-green-600" },
//     { name: "temperature", label: "Température (°C)", icon: Thermometer, type: "number", color: "bg-blue-600" },
//     { name: "taille", label: "Taille (cm)", icon: Ruler, type: "number", color: "bg-cyan-600" },
//     { name: "poids", label: "Poids (kg)", icon: Weight, type: "number", color: "bg-green-600" },
//     { name: "IMC", label: "IMC (kg/m²)", icon: Activity, type: "number", color: "bg-purple-600" },
//     { name: "frequence", label: "Fréquence cardiaque (bpm)", icon: HeartPulse, type: "number", color: "bg-pink-600" },
//     { name: "pression", label: "Pression artérielle (mmHg)", icon: Droplets, type: "text", color: "bg-orange-600" },
//     { name: "glycemie", label: "Glycémie (mg/dL)", icon: Syringe, type: "number", color: "bg-yellow-600" },
//     { name: "saturation", label: "Saturation O2 (%)", icon: Stethoscope, type: "number", color: "bg-cyan-600" },
//     { name: "tdr", label: "TDR", icon: FileText, type: "text", color: "bg-blue-600" },
//     { name: "autresParaclinique", label: "Autres examens", icon: FileText, textarea: true, color: "bg-purple-600" },
//     { name: "diagnostic", label: "Diagnostic", icon: NotebookPen, textarea: true, color: "bg-green-600" },
//     { name: "o2r", label: "O2R", icon: Pill, type: "text", color: "bg-cyan-600" },
//     { name: "traitement", label: "Traitement", icon: Syringe, textarea: true, color: "bg-yellow-600" },
//     { name: "besoinpf", label: "Besoin PF", icon: FileText, type: "text", color: "bg-blue-600" },
//     { name: "observation", label: "Observation", icon: FileText, textarea: true, color: "bg-purple-600" },
//     { name: "note", label: "Note", icon: FileText, textarea: true, color: "bg-gray-600" },
//   ];

//   // Statistiques fictives pour enrichir l'interface
//   const stats = [
//     { icon: Users, label: "Patients traités", value: "1,247", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
//     { icon: Stethoscope, label: "Consultations", value: "3,892", color: "from-green-500 to-emerald-500", bg: "bg-green-50" },
//     { icon: Clock, label: "Temps moyen", value: "25 min", color: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
//     { icon: TrendingUp, label: "Satisfaction", value: "98%", color: "from-orange-500 to-red-500", bg: "bg-orange-50" }
//   ];

//   // Fonctionnalités rapides
//   const quickActions = [
//     { icon: Search, label: "Recherche rapide", description: "Trouver un patient en quelques secondes", color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
//     { icon: Plus, label: "Nouvelle consultation", description: "Créer une consultation pour un patient", color: "bg-gradient-to-r from-green-500 to-emerald-500" },
//     { icon: Database, label: "Historique complet", description: "Accéder aux dossiers médicaux", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
//     { icon: BarChart3, label: "Statistiques", description: "Analyser les données de consultation", color: "bg-gradient-to-r from-orange-500 to-red-500" }
//   ];

//   // Recherche patient
//   const handleSearch = async () => {
//     if (!searchValue.trim()) {
//       setMessage({ type: 'error', text: "Entrez une valeur pour la recherche." });
//       return;
//     }
//     try {
//       setSearchLoading(true);
//       setMessage(null);
//       const response = await fetch(`http://localhost:3000/api/urologie/consultations/consulterflexible`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ identifiant: searchValue })
//       });
//       if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//       const data = await response.json();
//       if (data?.patient?.id) {
//         setPatient(data.patient);
//         setShowForm(true);
//         await loadConsultations(data.patient.id);
//         setMessage({ type: 'success', text: 'Patient trouvé !' });
//       } else {
//         setPatient(null);
//         setConsultations([]);
//         setShowForm(false);
//         setMessage({ type: 'error', text: 'Patient non trouvé.' });
//       }
//     } catch (err) {
//       setMessage({ type: 'error', text: `Erreur lors de la recherche: ${err.message}` });
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (patientId) {
//       loadConsultations(patientId);
//       setShowForm(true);
//     }
//     // eslint-disable-next-line
//   }, [patientId]);

//   const loadConsultations = async (targetPatientId) => {
//     try {
//       const id = targetPatientId || patientId;
//       const response = await fetch(`http://localhost:3000/api/urologie/consultations/patient/${id}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//       const data = await response.json();
//       setConsultations(data?.consultations || data?.data || data || []);
//     } catch (error) {
//       setConsultations([]);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'Date non disponible';
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
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

//   const handleInputChange = (field, value) => {
//     setNewConsultation(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!patient?.id) {
//       setMessage({ type: 'error', text: 'Aucun patient sélectionné.' });
//       return;
//     }
//     if (!newConsultation.motif.trim()) {
//       setMessage({ type: 'error', text: 'Le motif de consultation est requis.' });
//       return;
//     }
//     if (!newConsultation.datecons) {
//       setMessage({ type: 'error', text: 'La date de consultation est requise.' });
//       return;
//     }
//     try {
//       setSaveLoading(true);
//       const convertToNumberOrNull = (value) => {
//         if (!value || value === '') return null;
//         const num = parseFloat(value);
//         return isNaN(num) ? null : num;
//       };
//       const consultationData = {
//         patient_id: patient.id,
//         datecons: newConsultation.datecons,
//         motif: newConsultation.motif.trim(),
//         temperature: convertToNumberOrNull(newConsultation.temperature),
//         taille: convertToNumberOrNull(newConsultation.taille),
//         poids: convertToNumberOrNull(newConsultation.poids),
//         IMC: convertToNumberOrNull(newConsultation.IMC),
//         frequence: convertToNumberOrNull(newConsultation.frequence),
//         pression: newConsultation.pression.trim() || null,
//         glycemie: convertToNumberOrNull(newConsultation.glycemie),
//         saturation: convertToNumberOrNull(newConsultation.saturation),
//         tdr: newConsultation.tdr.trim() || null,
//         autresParaclinique: newConsultation.autresParaclinique.trim() || null,
//         diagnostic: newConsultation.diagnostic.trim() || null,
//         o2r: newConsultation.o2r.trim() || null,
//         traitement: newConsultation.traitement.trim() || null,
//         besoinpf: newConsultation.besoinpf.trim() || null,
//         observation: newConsultation.observation.trim() || null,
//         note: newConsultation.note.trim() || null
//       };
//       const response = await fetch('http://localhost:3000/api/urologie/consultations/enreR', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(consultationData)
//       });
//       const responseText = await response.text();
//       let result;
//       try {
//         result = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error('Réponse du serveur non valide');
//       }
//       if (!response.ok) {
//         throw new Error(result.message || `Erreur HTTP: ${response.status}`);
//       }
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
//       await loadConsultations(patient.id);
//       setShowForm(false);
//       setMessage({ type: 'success', text: 'Consultation enregistrée avec succès !' });
//     } catch (error) {
//       setMessage({ type: 'error', text: `Erreur lors de l'enregistrement: ${error.message}` });
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const toggleExpansion = (index) => {
//     setExpandedConsultation(expandedConsultation === index ? null : index);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50">
//       <Toaster position="top-right" />
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Message d'état */}
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

//         {!patient ? (
//           <div className="space-y-8">
//             {/* Statistiques */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {stats.map((stat, index) => (
//                 <div key={index} className={`${stat.bg} rounded-xl p-6 shadow-lg border border-white`}>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">{stat.label}</p>
//                       <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                     </div>
//                     <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
//                       <stat.icon className="w-6 h-6 text-white" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Barre de recherche améliorée */}
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//               <div className="text-center mb-8">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mb-4">
//                   <Search className="w-8 h-8 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Rechercher un Patient</h2>
//                 <p className="text-gray-600">Entrez la CNI ou le numéro de carte patient pour accéder aux consultations</p>
//               </div>
              
//               <div className="max-w-2xl mx-auto">
//                 <div className="flex gap-3">
//                   <div className="flex-1 relative">
//                     <input
//                       type="text"
//                       placeholder="CNI ou numéro de carte patient..."
//                       className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-lg"
//                       value={searchValue}
//                       onChange={(e) => setSearchValue(e.target.value)}
//                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                       disabled={searchLoading}
//                     />
//                     <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   </div>
//                   <button
//                     onClick={handleSearch}
//                     disabled={searchLoading}
//                     className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-green-600 text-white rounded-xl hover:from-cyan-700 hover:to-green-700 disabled:opacity-50 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg"
//                   >
//                     {searchLoading ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     ) : (
//                       <Search className="w-5 h-5" />
//                     )}
//                     {searchLoading ? 'Recherche...' : 'Rechercher'}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Actions rapides */}
//             {/* Informations utiles */}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Liste des consultations */}
//             <div className="bg-gradient-to-br from-cyan-50 to-green-50 rounded-lg shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6">
//                 <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                   <Stethoscope className="w-6 h-6" />
//                   Consultations du patient
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <div className="max-h-96 overflow-y-auto space-y-3">
//                   {consultations.length === 0 ? (
//                     <div className="text-center text-gray-500 py-12">
//                       <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-lg">Aucune consultation enregistrée</p>
//                       <p className="text-sm">Ajoutez une nouvelle consultation pour ce patient</p>
//                     </div>
//                   ) : (
//                     consultations.map((c, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => toggleExpansion(idx)}
//                         className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
//                           expandedConsultation === idx
//                             ? 'bg-green-100 border-2 border-green-400 shadow-lg'
//                             : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-green-100 rounded-full">
//                               <Stethoscope className="w-4 h-4 text-green-600" />
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-800">
//                                 {c.motif}
//                               </div>
//                               <div className="text-sm text-gray-600">
//                                 {formatDate(c.datecons)}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm font-medium text-gray-800">
//                               {c.diagnostic || 'Diagnostic non précisé'}
//                             </div>
//                           </div>
//                         </div>
//                         {/* Détails expand/collapse */}
//                         {expandedConsultation === idx && (
//                           <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
//                             <div className="grid grid-cols-2 gap-2 text-sm">
//                               <div>Température: <span className="font-semibold">{c.temperature || '-'}</span></div>
//                               <div>Taille: <span className="font-semibold">{c.taille || '-'}</span></div>
//                               <div>Poids: <span className="font-semibold">{c.poids || '-'}</span></div>
//                               <div>IMC: <span className="font-semibold">{c.IMC || '-'}</span></div>
//                               <div>Fréquence cardiaque: <span className="font-semibold">{c.frequence || '-'}</span></div>
//                               <div>Pression: <span className="font-semibold">{c.pression || '-'}</span></div>
//                               <div>Glycémie: <span className="font-semibold">{c.glycemie || '-'}</span></div>
//                               <div>Saturation O2: <span className="font-semibold">{c.saturation || '-'}</span></div>
//                             </div>
//                             <div className="mt-2 text-gray-700">Traitement: <span className="font-semibold">{c.traitement || '-'}</span></div>
//                             <div className="mt-2 text-gray-700">Observation: <span className="font-semibold">{c.observation || '-'}</span></div>
//                             <div className="mt-2 text-gray-700">Note: <span className="font-semibold">{c.note || '-'}</span></div>
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 shadow-lg"
//                   disabled={saveLoading}
//                 >
//                   <Plus className="w-5 h-5" />
//                   Nouvelle consultation
//                 </button>
//               </div>
//             </div>

//             {/* Détails du patient */}
//             <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-6">
//                 <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                   <User className="w-6 h-6" />
//                   Informations du patient
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <div className="font-bold text-lg text-cyan-800">{patient.nom} {patient.prenom}</div>
//                 <div className="text-sm text-cyan-700">
//                   ID: {patient.id} | {patient.CNI && `CNI: ${patient.CNI} |`} {patient.cartePatient && `Carte: ${patient.cartePatient}`}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal d'ajout de consultation */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               <div className="bg-gradient-to-r from-cyan-600 to-green-600 p-6 rounded-t-lg">
//                 <h3 className="text-white text-xl font-bold flex items-center gap-2">
//                   <Plus className="w-6 h-6" />
//                   Nouvelle consultation
//                 </h3>
//               </div>
//               <form className="p-6" onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {formFields.map(({ name, label, icon: Icon, type = "text", color, textarea }) => (
//                     <div key={name} className={`${textarea ? 'md:col-span-2' : ''}`}>
//                       <div className={`flex items-center rounded-lg overflow-hidden shadow-md ${textarea ? 'h-20' : 'h-12'} w-full`}>
//                         <div className={`p-3 flex items-center justify-center ${color} min-w-[48px] ${textarea ? 'h-full' : ''}`}>
//                           <Icon className="text-white w-5 h-5" />
//                         </div>
//                         {textarea ? (
//                           <textarea
//                             name={name}
//                             value={newConsultation[name]}
//                             onChange={(e) => handleInputChange(name, e.target.value)}
//                             placeholder={label.replace(' *', '')}
//                             className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500 h-20 resize-none"
//                             rows="3"
//                           />
//                         ) : (
//                           <input
//                             type={type}
//                             name={name}
//                             value={newConsultation[name]}
//                             onChange={(e) => handleInputChange(name, e.target.value)}
//                             placeholder={label.replace(' *', '')}
//                             className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                             required={label.includes('*')}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex gap-3 mt-8">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setNewConsultation({
//                         datecons: new Date().toISOString().split('T')[0],
//                         motif: '',
//                         temperature: '',
//                         taille: '',
//                         poids: '',
//                         IMC: '',
//                         frequence: '',
//                         pression: '',
//                         glycemie: '',
//                         saturation: '',
//                         tdr: '',
//                         autresParaclinique: '',
//                         diagnostic: '',
//                         o2r: '',
//                         traitement: '',
//                         besoinpf: '',
//                         observation: '',
//                         note: ''
//                       });
//                       setMessage(null);
//                     }}
//                     className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
//                     disabled={saveLoading}
//                   >
//                     <X className="w-5 h-5" />
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={!newConsultation.motif || !newConsultation.datecons || saveLoading}
//                     className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 text-white py-3 px-6 rounded-full hover:from-cyan-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
//                   >
//                     {saveLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                         Enregistrement...
//                       </>
//                     ) : (
//                       <>
//                         <Plus className="w-5 h-5" />
//                         Enregistrer
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ConsultationPatient;