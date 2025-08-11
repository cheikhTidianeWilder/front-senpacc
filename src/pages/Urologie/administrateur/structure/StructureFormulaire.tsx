// import React, { useState } from "react";
// import {
//   FaBuilding,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaPhone,
//   FaImage,
//   FaSpinner,
//   FaCheckCircle,
//   FaExclamationTriangle
// } from "react-icons/fa";

// const AddStructureForm = () => {
//   const [structure, setStructure] = useState({
//     nom: "",
//     Adresse: "",
//     email: "",
//     telephone: "",
//     image: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
//   const [createdStructure, setCreatedStructure] = useState<any>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setStructure(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     setCreatedStructure(null);

//     const requiredFields = ["nom", "Adresse", "email", "telephone"];
//     for (let field of requiredFields) {
//       if (!structure[field as keyof typeof structure]) {
//         setMessage({ type: "error", text: "Tous les champs obligatoires doivent être remplis." });
//         return;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(structure.email)) {
//       setMessage({ type: "error", text: "Email invalide." });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:3000/api/urologie/structures/creer", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(structure)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: "success", text: data.message });
//         setCreatedStructure(data.structure);
//         setStructure({ nom: "", Adresse: "", email: "", telephone: "", image: "" });
//       } else {
//         setMessage({ type: "error", text: data.message || "Erreur lors de la création." });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: "Erreur de connexion au serveur." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 py-8">
//       <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-xl">
//         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//           <FaBuilding /> Ajouter une structure
//         </h2>

//         {message && (
//           <div className={`mb-6 p-4 rounded flex items-center gap-2 ${
//             message.type === "success" ? "bg-green-100 text-green-800 border border-green-300" :
//             "bg-red-100 text-red-800 border border-red-300"
//           }`}>
//             {message.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
//             <span>{message.text}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {[
//             { name: "nom", label: "Nom de la structure", icon: FaBuilding },
//             { name: "Adresse", label: "Adresse", icon: FaMapMarkerAlt },
//             { name: "email", label: "Email", icon: FaEnvelope, type: "email" },
//             { name: "telephone", label: "Téléphone", icon: FaPhone },
//             { name: "image", label: "Image (URL)", icon: FaImage }
//           ].map(({ name, label, icon: Icon, type = "text" }) => (
//             <div key={name} className="flex items-center rounded-full overflow-hidden shadow-md h-12">
//               <div className="p-3 bg-indigo-600 text-white flex items-center justify-center min-w-[48px]">
//                 <Icon />
//               </div>
//               <input
//                 type={type}
//                 name={name}
//                 value={structure[name as keyof typeof structure]}
//                 onChange={handleChange}
//                 placeholder={label}
//                 className="px-4 py-2 w-full focus:outline-none border-0 focus:ring-2 focus:ring-indigo-500"
//                 required={["nom", "Adresse", "email", "telephone"].includes(name)}
//               />
//             </div>
//           ))}

//           <div className="flex justify-center mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-indigo-700 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-800 transition"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" /> Enregistrement...
//                 </>
//               ) : (
//                 <>
//                   <FaBuilding /> Créer la structure
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {createdStructure && (
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
//             <h3 className="font-semibold text-blue-800 mb-2">Structure enregistrée :</h3>
//             <p><strong>Nom:</strong> {createdStructure.nom}</p>
//             <p><strong>Adresse:</strong> {createdStructure.Adresse}</p>
//             <p><strong>Email:</strong> {createdStructure.email}</p>
//             <p><strong>Téléphone:</strong> {createdStructure.telephone}</p>
//             {createdStructure.image && <p><strong>Image:</strong> {createdStructure.image}</p>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddStructureForm;

import React, { useState, useEffect } from "react";

const AddStructureForm = () => {
  const [structure, setStructure] = useState({
    nom: "",
    Adresse: "",
    email: "",
    telephone: "",
    image: ""
  });

  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [created, setCreated] = useState<any>(null);

  // Charger la liste des structures
  const fetchStructures = async () => {
    try {
      setLoadingList(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:3000/api/urologie/structures/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStructures(data.structures || data || []);
        console.log('📋 Structures chargées:', data.structures?.length || data.length);
      } else {
        console.error('Erreur chargement structures:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des structures:', error);
      setMessage({ type: "error", text: "Erreur lors du chargement de la liste" });
    } finally {
      setLoadingList(false);
    }
  };

  // Charger les structures au montage
  useEffect(() => {
    fetchStructures();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStructure(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setCreated(null);

    const requiredFields = ["nom", "Adresse", "email", "telephone"];
    for (const field of requiredFields) {
      if (!structure[field as keyof typeof structure]) {
        setMessage({ type: "error", text: "Veuillez remplir tous les champs obligatoires." });
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/urologie/structures/creer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(structure)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setCreated(data.structure);
        setStructure({
          nom: "",
          Adresse: "",
          email: "",
          telephone: "",
          image: ""
        });
        
        // Recharger la liste après création
        fetchStructures();
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors de la création." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "nom", label: "Nom de la structure", IconComponent: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
      </svg>
    )},
    { name: "Adresse", label: "Adresse", IconComponent: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    )},
    { name: "email", label: "Email", type: "email", IconComponent: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    )},
    { name: "telephone", label: "Téléphone", IconComponent: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    )},
    { name: "image", label: "Image (URL)", IconComponent: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    )}
  ];

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-8 bg-gray-100">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Formulaire de création */}
        <div className="p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            Créer une structure
          </h2>

          {message && (
            <div className={`mb-6 p-4 rounded flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {message.type === "success" ? 
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg> :
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ name, label, IconComponent, type = "text" }) => (
              <div key={name} className="flex items-center rounded-full overflow-hidden shadow-md h-12 w-full">
                <div className="p-3 bg-indigo-600 text-white flex items-center justify-center min-w-[48px]">
                  <IconComponent />
                </div>
                <input
                  type={type}
                  name={name}
                  value={structure[name as keyof typeof structure]}
                  onChange={handleChange}
                  placeholder={label}
                  className="px-4 py-2 w-full focus:outline-none border-0 focus:ring-2 focus:ring-indigo-500"
                  required={["nom", "Adresse", "email", "telephone"].includes(name)}
                />
              </div>
            ))}

            <div className="col-span-2 flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-700 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-800 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    Créer la structure
                  </>
                )}
              </button>
            </div>
          </div>

          {created && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">✅ Structure créée avec succès :</h3>
              <div className="text-sm space-y-1">
                <p><strong>ID:</strong> {created.id}</p>
                <p><strong>Nom:</strong> {created.nom}</p>
                <p><strong>Adresse:</strong> {created.Adresse}</p>
                <p><strong>Email:</strong> {created.email}</p>
                <p><strong>Téléphone:</strong> {created.telephone}</p>
                {created.image && (
                  <p><strong>Image:</strong> 
                    <a href={created.image} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">
                      Voir l'image
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Liste des structures existantes */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2V6a1 1 0 012 0v1a1 1 0 11-2 0zm3 0V6a1 1 0 112 0v1a1 1 0 11-2 0z" clipRule="evenodd" />
              </svg>
              Structures existantes
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {structures.length}
              </span>
            </h3>
          </div>
          
          <div className="p-4 max-h-80 overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center justify-center py-8">
                <svg className="w-6 h-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                <span className="ml-2 text-gray-600">Chargement des structures...</span>
              </div>
            ) : structures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Aucune structure trouvée</p>
                <p className="text-sm">Créez votre première structure ci-dessus</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {structures.map((struct: any, index: number) => (
                  <div key={struct.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {struct.image ? (
                          <img 
                            src={struct.image} 
                            alt={struct.nom}
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              const nextSibling = target.nextElementSibling as HTMLElement;
                              target.style.display = 'none';
                              if (nextSibling) {
                                nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold ${struct.image ? 'hidden' : 'flex'}`}>
                          {struct.nom ? struct.nom.charAt(0).toUpperCase() : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {struct.nom || 'Structure sans nom'}
                        </h4>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {struct.Adresse || struct.adresse || 'Adresse non renseignée'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {struct.email && (
                            <span className="text-xs text-blue-600 truncate">
                              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              {struct.email}
                            </span>
                          )}
                        </div>
                        {struct.telephone && (
                          <p className="text-xs text-green-600 mt-1">
                            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {struct.telephone}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        ID: {struct.id}
                      </span>
                      {struct.created_at && (
                        <span className="text-xs text-gray-400">
                          {new Date(struct.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pied de la liste */}
          {!loadingList && structures.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Total: {structures.length} structure{structures.length > 1 ? 's' : ''}</span>
                <button
                  onClick={fetchStructures}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStructureForm;