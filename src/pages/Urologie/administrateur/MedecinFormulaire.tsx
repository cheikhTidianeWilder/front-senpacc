// import React, { useEffect, useState } from "react";
// import {
//     CheckCircle,
//     AlertTriangle,
//     Loader2,
//     Stethoscope
// } from "lucide-react";

// interface Structure {
//     id: number;
//     nom: string;
// }

// interface Resume {
//     id: number;
//     nom_complet: string;
//     email: string;
//     structure_rattachee: string;
//     service_rattache: string;
//     profil: string;
//     statuts: {
//         chef_service: string;
//         administrateur: string;
//     };
//     date_creation: string;
// }

// interface Message {
//     type: "success" | "error";
//     text: string;
// }

// const AddMedecinForm: React.FC = () => {
//     const [formData, setFormData] = useState({
//         prenom: "",
//         nom: "",
//         adresse: "",
//         sexe: "",
//         email: "",
//         role: "",
//         tel: "",
//         date_nai: "",
//         photo: "",
//         structure_id: "",
//         profil: "",
//         isChef: false,
//         isAdmin: false
//     });

//     const [structures, setStructures] = useState<Structure[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<Message | null>(null);
//     const [resume, setResume] = useState<Resume | null>(null);

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         // Récupération structures
//         fetch("http://localhost:3000/api/urologie/structures/all", {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(res => res.json())
//             .then(data => setStructures(data.structures || data))
//             .catch(err => console.error("Erreur structures", err));
//     }, []);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//         const target = e.target as HTMLInputElement | HTMLSelectElement;
//         const { name, value } = target;

//         const isCheckbox = target instanceof HTMLInputElement && target.type === "checkbox";

//         setFormData((prev) => ({
//             ...prev,
//             [name]: isCheckbox ? target.checked : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage(null);
//         setResume(null);

//         const {
//             prenom,
//             nom,
//             adresse,
//             sexe,
//             email,
//             role,
//             tel,
//             date_nai,
//             photo,
//             structure_id,
//             profil
//         } = formData;

//         // Validation basique
//         if (
//             !prenom.trim() ||
//             !nom.trim() ||
//             !adresse.trim() ||
//             !sexe ||
//             !structure_id ||
//             !profil.trim()
//         ) {
//             setMessage({
//                 type: "error",
//                 text: "Veuillez remplir les champs obligatoires : prénom, nom, adresse, sexe, structure et profil."
//             });
//             return;
//         }
//         if (!["Femme", "Homme"].includes(sexe)) {
//             setMessage({
//                 type: "error",
//                 text: "Le champ sexe doit être 'Femme' ou 'Homme'."
//             });
//             return;
//         }

//         setLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             const res = await fetch("http://localhost:3000/api/urologie/admins/insMedecin", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     prenom: prenom.trim(),
//                     nom: nom.trim(),
//                     adresse: adresse.trim(),
//                     sexe,
//                     email: email.trim() || null,
//                     tel: tel.trim() || null,
//                     date_nai: date_nai || null,
//                     photo: photo.trim() || null,
//                     structure_id: parseInt(structure_id),
//                     profil: profil.trim(),
//                     isChef: formData.isChef,
//                     isAdmin: formData.isAdmin
//                 })
//             });

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 setMessage({
//                     type: "error",
//                     text: data.message || "Erreur inconnue"
//                 });
//             } else {
//                 setMessage({
//                     type: "success",
//                     text: data.message
//                 });
//                 setResume(data.resume);
//                 setFormData({
//                     prenom: "",
//                     nom: "",
//                     adresse: "",
//                     sexe: "",
//                     email: "",
//                     role,
//                     tel: "",
//                     date_nai: "",
//                     photo: "",
//                     structure_id: "",
//                     profil: "",
//                     isChef: false,
//                     isAdmin: false
//                 });
//             }
//         } catch (err) {
//             setMessage({
//                 type: "error",
//                 text: "Erreur réseau ou serveur"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
//             <h1 className="text-xl font-bold mb-4">Créer un médecin avec utilisateur</h1>

//             {message && (
//                 <div
//                     className={`p-3 mb-4 rounded ${message.type === "success"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                 >
//                     {message.type === "success" ? (
//                         <CheckCircle className="inline w-5 h-5 mr-2" />
//                     ) : (
//                         <AlertTriangle className="inline w-5 h-5 mr-2" />
//                     )}
//                     {message.text}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Prénom */}
//                 <div>
//                     <label className="block mb-1">Prénom *</label>
//                     <input
//                         type="text"
//                         name="prenom"
//                         value={formData.prenom}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     />
//                 </div>

//                 {/* Nom */}
//                 <div>
//                     <label className="block mb-1">Nom *</label>
//                     <input
//                         type="text"
//                         name="nom"
//                         value={formData.nom}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     />
//                 </div>

//                 {/* Adresse */}
//                 <div>
//                     <label className="block mb-1">Adresse *</label>
//                     <input
//                         type="text"
//                         name="adresse"
//                         value={formData.adresse}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     />
//                 </div>

//                 {/* Sexe */}
//                 <div>
//                     <label className="block mb-1">Sexe *</label>
//                     <select
//                         name="sexe"
//                         value={formData.sexe}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     >
//                         <option value="">-- Sélectionner le sexe --</option>
//                         <option value="Femme">Femme</option>
//                         <option value="Homme">Homme</option>
//                     </select>
//                 </div>

//                 {/* Email */}
//                 <div>
//                     <label className="block mb-1">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         placeholder="exemple@mail.com"
//                     />
//                 </div>

//                 {/* Téléphone */}
//                 <div>
//                     <label className="block mb-1">Téléphone</label>
//                     <input
//                         type="tel"
//                         name="tel"
//                         value={formData.tel}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         placeholder="0601020304"
//                     />
//                 </div>

//                 {/* Date naissance */}
//                 <div>
//                     <label className="block mb-1">Date de naissance</label>
//                     <input
//                         type="date"
//                         name="date_nai"
//                         value={formData.date_nai}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                     />
//                 </div>
//                 {/* Structure */}
//                 <div>
//                     <label className="block mb-1">Qualite *</label>
//                     <select
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     >
//                         <option value="">-- Sélectionner la Qualite --</option>
//                         <option value="Femme">Medecin</option>
//                         <option value="Homme">Urologue</option>
//                     </select>
//                 </div>
//                 {/* Photo */}
//                 <div>
//                     <label className="block mb-1">Photo (URL)</label>
//                     <input
//                         type="text"
//                         name="photo"
//                         value={formData.photo}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         placeholder="URL de la photo"
//                     />
//                 </div>

//                 {/* Structure */}
//                 <div>
//                     <label className="block mb-1">Structure *</label>
//                     <select
//                         name="structure_id"
//                         value={formData.structure_id}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     >
//                         <option value="">-- Sélectionner une structure --</option>
//                         {structures.map((s) => (
//                             <option key={s.id} value={s.id}>
//                                 {s.nom}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Profil */}
//                 <div>
//                     <label className="block mb-1">Profil *</label>
//                     <input
//                         type="text"
//                         name="profil"
//                         value={formData.profil}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         placeholder="Ex: Urologue"
//                         required
//                     />
//                 </div>

//                 {/* Statuts */}
//                 <div className="flex items-center gap-4">
//                     <label className="flex items-center gap-2">
//                         <input
//                             type="checkbox"
//                             name="isChef"
//                             checked={!!formData.isChef}
//                             onChange={handleChange}
//                         />
//                         Chef de service
//                     </label>
//                     <label className="flex items-center gap-2">
//                         <input
//                             type="checkbox"
//                             name="isAdmin"
//                             checked={!!formData.isAdmin}
//                             onChange={handleChange}
//                         />
//                         Administrateur
//                     </label>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//                 >
//                     {loading ? (
//                         <>
//                             <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
//                             Création...
//                         </>
//                     ) : (
//                         <>
//                             <Stethoscope className="inline w-5 h-5 mr-2" />
//                             Créer le médecin
//                         </>
//                     )}
//                 </button>
//             </form>

//             {resume && (
//                 <div className="mt-6 p-4 border rounded bg-gray-50">
//                     <h2 className="text-lg font-semibold mb-2">Résumé</h2>
//                     <p><strong>Nom complet:</strong> {resume.nom_complet}</p>
//                     <p><strong>Email:</strong> {resume.email}</p>
//                     <p><strong>Structure:</strong> {resume.structure_rattachee}</p>
//                     <p><strong>Service:</strong> {resume.service_rattache}</p>
//                     <p><strong>Profil:</strong> {resume.profil}</p>
//                     <p><strong>Chef de service:</strong> {resume.statuts.chef_service}</p>
//                     <p><strong>Admin:</strong> {resume.statuts.administrateur}</p>
//                     <p><strong>Date création:</strong> {new Date(resume.date_creation).toLocaleString()}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AddMedecinForm;


import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    MapPin,
    Phone,
    Calendar,
    BadgePlus,
    Landmark,
    ShieldCheck,
    ImageIcon,
    Stethoscope,
    Loader2,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

interface Structure {
    id: number;
    nom: string;
}

interface Resume {
    nom_complet: string;
    email: string;
    structure_rattachee: string;
    service_rattache: string;
    profil: string;
    statuts: {
        chef_service: string;
        administrateur: string;
    };
    date_creation: string;
}

const AddMedecinForm = () => {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        adresse: "",
        sexe: "",
        email: "",
        role: "",
        tel: "",
        date_nai: "",
        photo: "",
        structure_id: "",
        profil: "",
        isChef: false,
        isAdmin: false
    });

    const [structures, setStructures] = useState<Structure[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState<Resume | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3000/api/urologie/structures/all", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStructures(data.structures || data))
            .catch(console.error);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setResume(null);

        const { prenom, nom, adresse, sexe, structure_id, profil } = formData;
        if (!prenom || !nom || !adresse || !sexe || !structure_id || !profil) {
            setMessage({
                type: "error",
                text: "Tous les champs marqués * sont requis."
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/urologie/admins/insMedecin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, structure_id: parseInt(structure_id) })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                setMessage({ type: "error", text: data.message || "Erreur lors de la création." });
            } else {
                setMessage({ type: "success", text: data.message });
                setResume(data.resume);
                setFormData({
                    prenom: "", nom: "", adresse: "", sexe: "", email: "", role: "", tel: "", date_nai: "",
                    photo: "", structure_id: "", profil: "", isChef: false, isAdmin: false
                });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erreur de connexion ou serveur indisponible." });
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: "prenom", label: "Prénom *", icon: User },
        { name: "nom", label: "Nom *", icon: User },
        { name: "adresse", label: "Adresse *", icon: MapPin },
        { name: "email", label: "Email", icon: Mail },
        { name: "tel", label: "Téléphone", icon: Phone },
        { name: "date_nai", label: "Date de naissance", icon: Calendar, type: "date" },
        { name: "photo", label: "Photo (URL)", icon: ImageIcon },
        { name: "profil", label: "Profil *", icon: BadgePlus },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Ajouter un Médecin</h2>

            {message && (
                <div className={`mb-4 flex items-center gap-2 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map(({ name, label, icon: Icon, type = "text" }) => (
                        <div key={name} className="flex items-center rounded-full overflow-hidden shadow text-sm h-12 w-full">
                            <div className="min-w-[48px] bg-gray-400 flex items-center justify-center p-3">
                                <Icon className="text-white w-5 h-5" />
                            </div>
                            <input
                                type={type}
                                name={name}
                                value={formData[name as keyof typeof formData] as string}
                                onChange={handleChange}
                                placeholder={label.replace(" *", "")}
                                required={label.includes("*")}
                                className="w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}

                    {/* Sexe */}
                    <div className="flex items-center rounded-full overflow-hidden shadow text-sm h-12 w-full">
                        <div className="min-w-[48px] bg-pink-500 flex items-center justify-center p-3">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        <select
                            name="sexe"
                            value={formData.sexe}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sexe...</option>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                        </select>
                    </div>
                    {/* Role */}
                    <div className="flex items-center rounded-full overflow-hidden shadow text-sm h-12 w-full">
                        <div className="min-w-[48px] bg-pink-500 flex items-center justify-center p-3">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Role...</option>
                            <option value="Medecin">Medecin</option>
                            <option value="Urologue">Urologue</option>
                        </select>
                    </div>

                    {/* Structure */}
                    <div className="flex items-center rounded-full overflow-hidden shadow text-sm h-12 w-full">
                        <div className="min-w-[48px] bg-indigo-600 flex items-center justify-center p-3">
                            <Landmark className="text-white w-5 h-5" />
                        </div>
                        <select
                            name="structure_id"
                            value={formData.structure_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Structure...</option>
                            {structures.map(s => (
                                <option key={s.id} value={s.id}>{s.nom}</option>
                            ))}
                        </select>
                    </div>
                    {/* Statuts */}
                    <div className="flex items-center rounded-full overflow-hidden shadow text-sm h-12 w-full">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isChef"
                                checked={formData.isChef}
                                onChange={handleChange}
                            />
                            Chef de service
                        </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isAdmin"
                                checked={formData.isAdmin}
                                onChange={handleChange}
                            />
                            Administrateur
                        </label>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Stethoscope className="w-5 h-5" />
                                Créer le médecin
                            </>
                        )}
                    </button>
                </div>
            </form>

            {resume && (
                <div className="mt-8 bg-gray-50 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Résumé :</h3>
                    <p><strong>Nom:</strong> {resume.nom_complet}</p>
                    <p><strong>Email:</strong> {resume.email}</p>
                    <p><strong>Structure:</strong> {resume.structure_rattachee}</p>
                    <p><strong>Service:</strong> {resume.service_rattache}</p>
                    <p><strong>Profil:</strong> {resume.profil}</p>
                    <p><strong>Chef de service:</strong> {resume.statuts.chef_service}</p>
                    <p><strong>Administrateur:</strong> {resume.statuts.administrateur}</p>
                    <p><strong>Date de création:</strong> {new Date(resume.date_creation).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default AddMedecinForm;
