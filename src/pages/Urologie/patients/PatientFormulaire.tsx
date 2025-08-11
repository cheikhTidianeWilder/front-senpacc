// import React, { useState, useRef, useEffect } from "react";
// import {
//   User,
//   Calendar,
//   CreditCard,
//   Users,
//   Phone,
//   PhoneCall,
//   Mail,
//   Droplet,
//   Home,
//   Briefcase,
//   QrCode,
//   Lock,
//   AlertTriangle,
//   Building,
//   Loader,
//   CheckCircle,
//   AlertCircle,
//   Camera,
//   Square
// } from "lucide-react";
// import jsQR from 'jsqr';
// interface PatientData {
//   prenom: string;
//   nom: string;
//   adresse: string;
//   profession: string;
//   date_nai: string;
//   CNI: string;
//   statut: string;
//   sexe: string;
//   email: string;
//   tel: string;
//   sang: string;
//   tel_a_prevenir: string;
//   allergie: string;
//   photo: string;
//   cartePatient: string;
// }

// const AddPatientForm = () => {
//   const [patient, setPatient] = useState<PatientData>({
//     prenom: "",
//     nom: "",
//     adresse: "",
//     profession: "",
//     date_nai: "",
//     CNI: "",
//     statut: "Actif",
//     sexe: "",
//     email: "",
//     tel: "",
//     sang: "",
//     tel_a_prevenir: "",
//     allergie: "",
//     photo: "default-avatar.png",
//     cartePatient: ""
//   });

//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [scanning, setScanning] = useState<boolean>(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//   const [patientCreated, setPatientCreated] = useState<any | null>(null);
//   const [qrCodeResult, setQrCodeResult] = useState<string>("");
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [qrCodesDisponibles, setQrCodesDisponibles] = useState<any[]>([]);
//   const [scanAttempts, setScanAttempts] = useState<number>(0);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [stream]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setPatient({ ...patient, [e.target.name]: e.target.value });
//   };

//   // Fonction pour récupérer les QR codes disponibles
//   const fetchQRCodesDisponibles = async (): Promise<any[]> => {
//     try {
//       const token = localStorage.getItem('token');

//       console.log("🔍 Récupération des QR codes disponibles...");

//       const response = await fetch("http://localhost:3000/api/urologie/qrcodes/liste", {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("✅ QR codes disponibles récupérés:", data);

//         if (data.success && data.qrCodes) {
//           setQrCodesDisponibles(data.qrCodes);
//           return data.qrCodes;
//         } else {
//           console.log("❌ Aucun QR code disponible");
//           setMessage({
//             type: 'error',
//             text: "Aucun QR code disponible dans le système"
//           });
//           return [];
//         }
//       } else {
//         console.error("❌ Erreur récupération QR codes:", response.status);
//         return [];
//       }
//     } catch (error) {
//       console.error("🚨 Erreur récupération QR disponibles:", error);
//       return [];
//     }
//   };
//   const scanQRCode = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     if (!context || video.videoWidth === 0) return;

//     // Configurer le canvas aux dimensions de la vidéo
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Dessiner l'image de la vidéo sur le canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     try {
//       // Obtenir les données d'image
//       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

//       // ✅ DÉTECTION RÉELLE avec jsQR
//       const code = jsQR(imageData.data, imageData.width, imageData.height, {
//         inversionAttempts: "dontInvert", // Optimisation
//       });

//       if (code) {
//         console.log("🎯 QR Code réellement détecté:", code.data);

//         // Arrêter le scan immédiatement
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//           intervalRef.current = null;
//         }

//         // Traiter le QR code détecté
//         handleQRDetection(code.data);
//         return;
//       }

//       setScanAttempts(prev => prev + 1);

//       // Message après plusieurs tentatives
//       if (scanAttempts > 30) {
//         setMessage({
//           type: 'error',
//           text: "Aucun QR code détecté. Vérifiez l'éclairage et la netteté de l'image."
//         });
//       }

//     } catch (error) {
//       console.error("❌ Erreur scan QR:", error);
//     }
//   };
//   // Fonction appelée quand un QR code est détecté
//   const handleQRDetection = async (qrContent: string) => {
//     console.log("📱 QR Code détecté:", qrContent);

//     // Arrêter le scan
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     setMessage({
//       type: 'success',
//       text: `🎯 QR Code détecté: ${qrContent}. Vérification en cours...`
//     });

//     // Vérifier si le QR code est valide et disponible
//     const isValid = await verifyQRCodeAvailability(qrContent);

//     if (isValid) {
//       setQrCodeResult(qrContent);
//       setMessage({
//         type: 'success',
//         text: `✅ QR Code ${qrContent} validé ! Prêt pour l'enregistrement.`
//       });

//       // Procéder automatiquement à l'enregistrement
//       await handleAutoSubmit(qrContent);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     await handlePatientSubmission();
//   };

//   const handlePatientSubmission = async () => {
//     // Validation simple
//     if (!patient.nom || !patient.prenom || !patient.email || !patient.sexe) {
//       setMessage({
//         type: 'error',
//         text: "Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email, Sexe)"
//       });
//       return;
//     }

//     // Validation email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(patient.email)) {
//       setMessage({
//         type: 'error',
//         text: "Veuillez saisir un email valide"
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     setPatientCreated(null);

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         setMessage({
//           type: 'error',
//           text: "Vous devez être connecté pour créer un patient"
//         });
//         setLoading(false);
//         return;
//       }

//       console.log('🔄 Enregistrement manuel sans carte:', patient);

//       const dataToSend = {
//         nom: patient.nom.trim(),
//         prenom: patient.prenom.trim(),
//         adresse: patient.adresse.trim(),
//         date_nai: patient.date_nai,
//         sexe: patient.sexe,
//         tel: patient.tel.trim(),
//         email: patient.email.trim().toLowerCase(),
//         photo: patient.photo,
//         statut: patient.statut,
//         profession: patient.profession.trim(),
//         sang: patient.sang,
//         allergie: patient.allergie.trim(),
//         CNI: patient.CNI.trim(),
//         tel_a_prevenir: patient.tel_a_prevenir.trim(),
//         cartePatient: null
//       };

//       const response = await fetch("http://localhost:3000/api/urologie/patients/creerUserPatient", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(dataToSend)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({
//           type: 'success',
//           text: "Patient créé avec succès sans carte !"
//         });

//         setPatientCreated(data);

//         // Réinitialiser le formulaire
//         setPatient({
//           prenom: "",
//           nom: "",
//           adresse: "",
//           profession: "",
//           date_nai: "",
//           CNI: "",
//           statut: "Actif",
//           sexe: "",
//           email: "",
//           tel: "",
//           sang: "",
//           tel_a_prevenir: "",
//           allergie: "",
//           photo: "default-avatar.png",
//           cartePatient: ""
//         } as PatientData);
//         setQrCodeResult("");
//       } else {
//         setMessage({
//           type: 'error',
//           text: data.error || `Erreur ${response.status}: ${data.message || 'Erreur lors de la création du patient'}`
//         });
//       }
//     } catch (error) {
//       console.error('🚨 Erreur complète:', error);
//       setMessage({
//         type: 'error',
//         text: "Erreur de connexion au serveur. Vérifiez que le serveur est démarré."
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       setScanning(true);
//       setMessage(null);
//       setScanAttempts(0);

//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' }
//       });

//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         videoRef.current.play();
//       }

//       setMessage({
//         type: 'success',
//         text: "📹 Caméra activée. Positionnez un QR code devant l'objectif..."
//       });

//       // Démarrer le scan continu
//       intervalRef.current = setInterval(() => {
//         scanQRCode();
//       }, 500); // Scanner toutes les 500ms

//     } catch (error) {
//       console.error('❌ Erreur caméra:', error);
//       setMessage({
//         type: 'error',
//         text: "Erreur lors de l'accès à la caméra. Vérifiez les permissions."
//       });
//       setScanning(false);
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setScanning(false);
//     setScanAttempts(0);
//   };

//   // Fonction de test pour simuler la détection d'un QR code
//   const simulateQRDetection = async () => {
//     if (qrCodesDisponibles.length === 0) {
//       setMessage({
//         type: 'error',
//         text: "Aucun QR code disponible pour simulation"
//       });
//       return;
//     }

//     const qrToSimulate = qrCodesDisponibles[0];
//     console.log("🧪 Simulation de détection QR:", qrToSimulate.qrcodeContenu);

//     await handleQRDetection(qrToSimulate.qrcodeContenu);
//   };

//   // Fonction pour vérifier la disponibilité d'un QR code
//   const verifyQRCodeAvailability = async (qrCodeContenu: string): Promise<boolean> => {
//     try {
//       const token = localStorage.getItem('token');

//       console.log("🔍 Vérification disponibilité QR:", qrCodeContenu);

//       const response = await fetch("http://localhost:3000/api/urologie/qrcodes/verifier", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ qrCodeContenu })
//       });

//       const data = await response.json();
//       console.log("📥 Réponse vérification:", data);

//       if (response.ok && data.success) {
//         return true;
//       } else {
//         let errorMessage = "QR Code non valide";

//         if (data.codeErreur === 'QR_CODE_INCONNU') {
//           errorMessage = "Cette carte n'est pas reconnue par le système. Seules les cartes générées par l'application sont acceptées.";
//         } else if (data.codeErreur === 'QR_CODE_DEJA_UTILISE') {
//           errorMessage = `Cette carte est déjà utilisée par : ${data.patientExistant?.prenom} ${data.patientExistant?.nom}`;
//         } else {
//           errorMessage = data.message || "QR Code non valide";
//         }

//         setMessage({
//           type: 'error',
//           text: errorMessage
//         });
//         return false;
//       }
//     } catch (error) {
//       console.error('🚨 Erreur vérification QR Code:', error);
//       setMessage({
//         type: 'error',
//         text: "Erreur de connexion lors de la vérification du QR Code"
//       });
//       return false;
//     }
//   };

//   // Fonction d'enregistrement automatique après scan QR
//   const handleAutoSubmit = async (carteScannee: string): Promise<void> => {
//     // Validation des champs obligatoires
//     if (!patient.nom || !patient.prenom || !patient.email || !patient.sexe) {
//       setMessage({
//         type: 'error',
//         text: "Veuillez d'abord remplir tous les champs obligatoires (Nom, Prénom, Email, Sexe) avant de scanner la carte"
//       });
//       return;
//     }

//     // Validation email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(patient.email)) {
//       setMessage({
//         type: 'error',
//         text: "Veuillez saisir un email valide avant de scanner la carte"
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage({
//       type: 'success',
//       text: "Création du patient et affectation de la carte en cours..."
//     });
//     setPatientCreated(null);

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         setMessage({
//           type: 'error',
//           text: "Vous devez être connecté pour créer un patient"
//         });
//         setLoading(false);
//         return;
//       }

//       console.log("🔄 Étape 1: Création du patient sans carte...");

//       // Étape 1: Créer le patient
//       const dataToSend = {
//         nom: patient.nom.trim(),
//         prenom: patient.prenom.trim(),
//         adresse: patient.adresse.trim(),
//         date_nai: patient.date_nai,
//         sexe: patient.sexe,
//         tel: patient.tel.trim(),
//         email: patient.email.trim().toLowerCase(),
//         photo: patient.photo,
//         statut: patient.statut,
//         profession: patient.profession.trim(),
//         sang: patient.sang,
//         allergie: patient.allergie.trim(),
//         CNI: patient.CNI.trim(),
//         tel_a_prevenir: patient.tel_a_prevenir.trim(),
//         cartePatient: null
//       };

//       const response = await fetch("http://localhost:3000/api/urologie/patients/creerUserPatient", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(dataToSend)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setMessage({
//           type: 'error',
//           text: data.error || `Erreur lors de la création du patient: ${data.message}`
//         });
//         setLoading(false);
//         return;
//       }

//       const patientId = data.patient?.id || data.id;

//       if (!patientId) {
//         setMessage({
//           type: 'error',
//           text: "Erreur: ID du patient non trouvé dans la réponse"
//         });
//         setLoading(false);
//         return;
//       }

//       console.log("✅ Patient créé avec ID:", patientId);
//       console.log("🔄 Étape 2: Affectation de la carte QR...");

//       // Étape 2: Affecter la carte QR
//       const affectationResponse = await fetch("http://localhost:3000/api/urologie/qrcodes/affecter", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           patientId: patientId,
//           qrCodeContenu: carteScannee
//         })
//       });

//       const affectationData = await affectationResponse.json();

//       if (affectationResponse.ok && affectationData.success) {
//         setMessage({
//           type: 'success',
//           text: `🎉 Patient créé et carte ${carteScannee} affectée avec succès !`
//         });

//         setPatientCreated({
//           ...data,
//           cartePatient: carteScannee
//         });

//         // Réinitialiser le formulaire
//         setPatient({
//           prenom: "",
//           nom: "",
//           adresse: "",
//           profession: "",
//           date_nai: "",
//           CNI: "",
//           statut: "Actif",
//           sexe: "",
//           email: "",
//           tel: "",
//           sang: "",
//           tel_a_prevenir: "",
//           allergie: "",
//           photo: "default-avatar.png",
//           cartePatient: ""
//         } as PatientData);

//         // Fermer la modal
//         stopCamera();
//         setShowModal(false);

//       } else {
//         let errorMessage = "Erreur lors de l'affectation de la carte";

//         if (affectationData.message) {
//           errorMessage = affectationData.message;
//         }

//         if (affectationData.patientExistant) {
//           errorMessage = `Cette carte est déjà utilisée par : ${affectationData.patientExistant.prenom} ${affectationData.patientExistant.nom}`;
//         }

//         setMessage({
//           type: 'error',
//           text: `Patient créé mais ${errorMessage}. Vous pouvez affecter une carte manuellement plus tard.`
//         });

//         setPatientCreated({
//           ...data,
//           cartePatient: null
//         });
//       }

//     } catch (error) {
//       console.error('🚨 Erreur enregistrement automatique:', error);
//       setMessage({
//         type: 'error',
//         text: "Erreur de connexion lors de l'enregistrement automatique"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleScanModal = async () => {
//     await fetchQRCodesDisponibles();
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     stopCamera();
//     setShowModal(false);
//     setQrCodeResult("");
//   };

//   const formFields = [
//     { name: "prenom", label: "Prénom *", icon: User, color: "bg-gray-400" },
//     { name: "nom", label: "Nom *", icon: User, color: "bg-gray-400" },
//     { name: "date_nai", label: "Naissance", icon: Calendar, type: "date", color: "bg-red-600" },
//     { name: "CNI", label: "CNI", icon: CreditCard, color: "bg-red-600" },
//     { name: "sexe", label: "Sexe *", icon: Users, color: "bg-indigo-900" },
//     { name: "tel", label: "Téléphone", icon: Phone, color: "bg-yellow-400" },
//     { name: "tel_a_prevenir", label: "Téléphone Urgence", icon: PhoneCall, color: "bg-blue-500" },
//     { name: "email", label: "Email *", icon: Mail, type: "email", color: "bg-yellow-400" },
//     { name: "sang", label: "Gp Sanguin", icon: Droplet, color: "bg-blue-500" },
//     { name: "allergie", label: "Allergies", icon: AlertTriangle, color: "bg-orange-500" },
//     { name: "adresse", label: "Adresse", icon: Home, color: "bg-gray-400" },
//     { name: "profession", label: "Profession", icon: Briefcase, color: "bg-gray-400" },
//   ];

//   return (
//     <>
//       <div className="flex justify-center items-center min-h-screen px-4 py-8">
//         <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">

//           {/* Messages d'état */}
//           {message && (
//             <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
//               ? 'bg-green-100 text-green-800 border border-green-200'
//               : 'bg-red-100 text-red-800 border border-red-200'
//               }`}>
//               {message.type === 'success' ? (
//                 <CheckCircle className="text-green-600 w-5 h-5" />
//               ) : (
//                 <AlertCircle className="text-red-600 w-5 h-5" />
//               )}
//               <span>{message.text}</span>
//             </div>
//           )}

//           {/* Information sur les modes d'enregistrement */}
//           {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h4 className="font-medium text-blue-800 mb-2">Modes d'enregistrement :</h4>
//             <div className="text-sm text-blue-700 space-y-1">
//               <p>• <strong>Enregistrement manuel :</strong> Cliquez sur "Enregistrer Patient" sans scanner de carte</p>
//               <p>• <strong>Scan QR Code :</strong> Scannez physiquement une carte QR avec la caméra pour l'affectation automatique</p>
//             </div>
//           </div> */}

//           {/* Affichage de la carte scannée */}
//           {qrCodeResult && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-center gap-2 text-green-800">
//                 <QrCode className="w-5 h-5" />
//                 <span className="font-medium">Carte Patient Scannée :</span>
//                 <span className="font-mono bg-green-100 px-2 py-1 rounded text-sm font-semibold">{qrCodeResult}</span>
//               </div>
//               <p className="text-sm text-green-600 mt-1">
//                 Carte détectée et prête pour l'enregistrement.
//               </p>
//             </div>
//           )}

//           {/* Informations du patient créé */}
//           {patientCreated && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <h3 className="font-semibold text-green-800 mb-2">Patient créé avec succès :</h3>
//               <div className="text-sm text-green-700">
//                 <p><strong>Carte Patient:</strong> {qrCodeResult || "Aucune carte affectée"}</p>
//                 <p><strong>Service:</strong> {patientCreated.service || "Urologie"}</p>
//                 <p><strong>Structure:</strong> {patientCreated.structure || "Structure médicale"}</p>
//                 <p><strong>Créé par:</strong> {patientCreated.medecin_createur || "Médecin connecté"}</p>
//                 {patientCreated.patient?.id && (
//                   <p><strong>ID Patient:</strong> {patientCreated.patient.id}</p>
//                 )}
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-2 gap-6">
//               {formFields.map(({ name, label, icon: Icon, type = "text", color }) => (
//                 <div key={name} className={`${name === "allergie" ? "col-span-2" : ""} flex items-center rounded-full overflow-hidden shadow-md text-base h-12 w-full`}>
//                   <div className={`p-3 flex items-center justify-center ${color} min-w-[48px]`}>
//                     <Icon className="text-white w-5 h-5" />
//                   </div>
//                   {name === "sexe" ? (
//                     <select
//                       name={name}
//                       value={patient[name as keyof PatientData]}
//                       onChange={handleChange}
//                       className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">{label.replace(' *', '')}...</option>
//                       <option value="Homme">Homme</option>
//                       <option value="Femme">Femme</option>
//                     </select>
//                   ) : name === "sang" ? (
//                     <select
//                       name={name}
//                       value={patient[name as keyof PatientData]}
//                       onChange={handleChange}
//                       className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">{label}...</option>
//                       <option value="A+">A+</option>
//                       <option value="A-">A-</option>
//                       <option value="B+">B+</option>
//                       <option value="B-">B-</option>
//                       <option value="AB+">AB+</option>
//                       <option value="AB-">AB-</option>
//                       <option value="O+">O+</option>
//                       <option value="O-">O-</option>
//                     </select>
//                   ) : (
//                     <input
//                       type={type}
//                       name={name}
//                       value={patient[name as keyof PatientData]}
//                       onChange={handleChange}
//                       placeholder={label.replace(' *', '')}
//                       className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
//                       required={label.includes('*')}
//                     />
//                   )}
//                 </div>
//               ))}

//               {/* Boutons d'action */}
//               <div className="col-span-2 flex justify-center gap-4 mt-4">
//                 <button
//                   type="button"
//                   onClick={handleScanModal}
//                   className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-2 text-sm"
//                   disabled={loading || patientCreated}
//                 >
//                   <QrCode className="w-4 h-4" />
//                   Scanner Carte QR
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-800 transition-all transform hover:scale-105 text-sm flex items-center gap-2 disabled:opacity-50"
//                   disabled={loading || patientCreated}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader className="animate-spin w-4 h-4" />
//                       Enregistrement...
//                     </>
//                   ) : (
//                     'Enregistrer Patient (Sans Carte)'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       {showModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
//     <div className="bg-white rounded-lg shadow-xl w-full max-w-xs max-h-[70vh] overflow-y-auto">
      
//       {/* Header */}
//       <div className="bg-blue-600 text-white px-3 py-2 rounded-t-lg flex justify-between items-center">
//         <h3 className="text-base font-semibold flex items-center gap-2">
//           <QrCode className="w-5 h-5" />
//           Scanner
//         </h3>
//         <button
//           onClick={closeModal}
//           className="text-white hover:text-gray-200 text-xl"
//         >
//           ×
//         </button>
//       </div>

//       {/* Body */}
//       <div className="px-3 py-2 text-sm">
//         {scanning && (
//           <p className="text-blue-600 text-xs text-center mb-2">
//             🔍 Tentative {scanAttempts} – En attente de détection...
//           </p>
//         )}

//         {qrCodesDisponibles.length > 0 && (
//           <div className="mb-2 p-2 bg-blue-50 text-xs text-blue-800 border border-blue-200 rounded">
//             {qrCodesDisponibles.length} carte(s) QR disponible(s)
//           </div>
//         )}

//         <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded relative overflow-hidden">
//           <video
//             ref={videoRef}
//             className="w-full h-48 object-cover"
//             style={{ display: scanning ? 'block' : 'none' }}
//           />
//           <canvas ref={canvasRef} style={{ display: 'none' }} />

//           {!scanning && (
//             <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
//               <Camera className="w-8 h-8" />
//               <p className="mt-1">Caméra inactive</p>
//             </div>
//           )}

//           {/* Cadre de scan */}
//           {scanning && (
//             <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
//               <div className="w-36 h-36 border-2 border-red-500 border-dashed bg-red-100 bg-opacity-10 relative">
//                 <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-500" />
//                 <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-500" />
//                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-500" />
//                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-500" />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Simulateur */}
//         {scanning && (
//           <div className="text-center mt-3">
//             <button
//               onClick={simulateQRDetection}
//               className="text-xs px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
//               disabled={loading || qrCodesDisponibles.length === 0}
//             >
//               🧪 Simuler QR
//             </button>
//           </div>
//         )}

//         {qrCodeResult && (
//           <div className="mt-2 p-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
//             ✅ QR détecté : {qrCodeResult}
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-2">
//         <button
//           onClick={closeModal}
//           className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
//         >
//           Fermer
//         </button>
//         {!scanning ? (
//           <button
//             onClick={startCamera}
//             className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
//           >
//             <Camera className="w-4 h-4" />
//             Démarrer
//           </button>
//         ) : (
//           <button
//             onClick={stopCamera}
//             className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-1"
//           >
//             <Square className="w-4 h-4" />
//             Stop
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// )}
//     </>
//   );
// };

// export default AddPatientForm;

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Calendar,
  CreditCard,
  Users,
  Phone,
  PhoneCall,
  Mail,
  Droplet,
  Home,
  Briefcase,
  QrCode,
  Lock,
  AlertTriangle,
  Building,
  Loader,
  CheckCircle,
  AlertCircle,
  Camera,
  Square
} from "lucide-react";

interface PatientData {
  prenom: string;
  nom: string;
  adresse: string;
  profession: string;
  date_nai: string;
  CNI: string;
  statut: string;
  sexe: string;
  email: string;
  tel: string;
  sang: string;
  tel_a_prevenir: string;
  allergie: string;
  photo: string;
  cartePatient: string;
}

const AddPatientForm = () => {
  const [patient, setPatient] = useState<PatientData>({
    prenom: "",
    nom: "",
    adresse: "",
    profession: "",
    date_nai: "",
    CNI: "",
    statut: "Actif",
    sexe: "",
    email: "",
    tel: "",
    sang: "",
    tel_a_prevenir: "",
    allergie: "",
    photo: "default-avatar.png",
    cartePatient: ""
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [patientCreated, setPatientCreated] = useState<any | null>(null);
  const [qrCodeResult, setQrCodeResult] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [qrCodesDisponibles, setQrCodesDisponibles] = useState<any[]>([]);
  const [scanAttempts, setScanAttempts] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stream]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  // Fonction pour récupérer les QR codes disponibles
  const fetchQRCodesDisponibles = async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem('token');

      console.log("🔍 Récupération des QR codes disponibles...");

      const response = await fetch("http://localhost:3000/api/urologie/qrcodes/liste", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ QR codes disponibles récupérés:", data);

        if (data.success && data.qrCodes) {
          setQrCodesDisponibles(data.qrCodes);
          return data.qrCodes;
        } else {
          console.log("❌ Aucun QR code disponible");
          setMessage({
            type: 'error',
            text: "Aucun QR code disponible dans le système"
          });
          return [];
        }
      } else {
        console.error("❌ Erreur récupération QR codes:", response.status);
        return [];
      }
    } catch (error) {
      console.error("🚨 Erreur récupération QR disponibles:", error);
      return [];
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      setScanAttempts(prev => prev + 1);

      if (scanAttempts > 30) {
        setMessage({
          type: 'error',
          text: "Aucun QR code détecté. Vérifiez l'éclairage et la netteté de l'image."
        });
      }

    } catch (error) {
      console.error("❌ Erreur scan QR:", error);
    }
  };

  const handleQRDetection = async (qrContent: string) => {
    console.log("📱 QR Code détecté:", qrContent);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setMessage({
      type: 'success',
      text: `🎯 QR Code détecté: ${qrContent}. Vérification en cours...`
    });

    const isValid = await verifyQRCodeAvailability(qrContent);

    if (isValid) {
      setQrCodeResult(qrContent);
      setMessage({
        type: 'success',
        text: `✅ QR Code ${qrContent} validé ! Prêt pour l'enregistrement.`
      });

      await handleAutoSubmit(qrContent);
    }
  };

  const handlePatientSubmission = async () => {
    if (!patient.nom || !patient.prenom || !patient.email || !patient.sexe) {
      setMessage({
        type: 'error',
        text: "Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email, Sexe)"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      setMessage({
        type: 'error',
        text: "Veuillez saisir un email valide"
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    setPatientCreated(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage({
          type: 'error',
          text: "Vous devez être connecté pour créer un patient"
        });
        setLoading(false);
        return;
      }

      console.log('🔄 Enregistrement manuel sans carte:', patient);

      const dataToSend = {
        nom: patient.nom.trim(),
        prenom: patient.prenom.trim(),
        adresse: patient.adresse.trim(),
        date_nai: patient.date_nai,
        sexe: patient.sexe,
        tel: patient.tel.trim(),
        email: patient.email.trim().toLowerCase(),
        photo: patient.photo,
        statut: patient.statut,
        profession: patient.profession.trim(),
        sang: patient.sang,
        allergie: patient.allergie.trim(),
        CNI: patient.CNI.trim(),
        tel_a_prevenir: patient.tel_a_prevenir.trim(),
        cartePatient: null
      };

      const response = await fetch("http://localhost:3000/api/urologie/patients/creerUserPatient", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: "Patient créé avec succès sans carte !"
        });

        setPatientCreated(data);

        setPatient({
          prenom: "",
          nom: "",
          adresse: "",
          profession: "",
          date_nai: "",
          CNI: "",
          statut: "Actif",
          sexe: "",
          email: "",
          tel: "",
          sang: "",
          tel_a_prevenir: "",
          allergie: "",
          photo: "default-avatar.png",
          cartePatient: ""
        } as PatientData);
        setQrCodeResult("");
      } else {
        setMessage({
          type: 'error',
          text: data.error || `Erreur ${response.status}: ${data.message || 'Erreur lors de la création du patient'}`
        });
      }
    } catch (error) {
      console.error('🚨 Erreur complète:', error);
      setMessage({
        type: 'error',
        text: "Erreur de connexion au serveur. Vérifiez que le serveur est démarré."
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setScanning(true);
      setMessage(null);
      setScanAttempts(0);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setMessage({
        type: 'success',
        text: "📹 Caméra activée. Positionnez un QR code devant l'objectif..."
      });

      intervalRef.current = setInterval(() => {
        scanQRCode();
      }, 500);

    } catch (error) {
      console.error('❌ Erreur caméra:', error);
      setMessage({
        type: 'error',
        text: "Erreur lors de l'accès à la caméra. Vérifiez les permissions."
      });
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setScanning(false);
    setScanAttempts(0);
  };

  const simulateQRDetection = async () => {
    if (qrCodesDisponibles.length === 0) {
      setMessage({
        type: 'error',
        text: "Aucun QR code disponible pour simulation"
      });
      return;
    }

    const qrToSimulate = qrCodesDisponibles[0];
    console.log("🧪 Simulation de détection QR:", qrToSimulate.qrcodeContenu);

    await handleQRDetection(qrToSimulate.qrcodeContenu);
  };

  const verifyQRCodeAvailability = async (qrCodeContenu: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');

      console.log("🔍 Vérification disponibilité QR:", qrCodeContenu);

      const response = await fetch("http://localhost:3000/api/urologie/qrcodes/verifier", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qrCodeContenu })
      });

      const data = await response.json();
      console.log("📥 Réponse vérification:", data);

      if (response.ok && data.success) {
        return true;
      } else {
        let errorMessage = "QR Code non valide";

        if (data.codeErreur === 'QR_CODE_INCONNU') {
          errorMessage = "Cette carte n'est pas reconnue par le système. Seules les cartes générées par l'application sont acceptées.";
        } else if (data.codeErreur === 'QR_CODE_DEJA_UTILISE') {
          errorMessage = `Cette carte est déjà utilisée par : ${data.patientExistant?.prenom} ${data.patientExistant?.nom}`;
        } else {
          errorMessage = data.message || "QR Code non valide";
        }

        setMessage({
          type: 'error',
          text: errorMessage
        });
        return false;
      }
    } catch (error) {
      console.error('🚨 Erreur vérification QR Code:', error);
      setMessage({
        type: 'error',
        text: "Erreur de connexion lors de la vérification du QR Code"
      });
      return false;
    }
  };

  const handleAutoSubmit = async (carteScannee: string): Promise<void> => {
    if (!patient.nom || !patient.prenom || !patient.email || !patient.sexe) {
      setMessage({
        type: 'error',
        text: "Veuillez d'abord remplir tous les champs obligatoires (Nom, Prénom, Email, Sexe) avant de scanner la carte"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      setMessage({
        type: 'error',
        text: "Veuillez saisir un email valide avant de scanner la carte"
      });
      return;
    }

    setLoading(true);
    setMessage({
      type: 'success',
      text: "Création du patient et affectation de la carte en cours..."
    });
    setPatientCreated(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage({
          type: 'error',
          text: "Vous devez être connecté pour créer un patient"
        });
        setLoading(false);
        return;
      }

      console.log("🔄 Étape 1: Création du patient sans carte...");

      const dataToSend = {
        nom: patient.nom.trim(),
        prenom: patient.prenom.trim(),
        adresse: patient.adresse.trim(),
        date_nai: patient.date_nai,
        sexe: patient.sexe,
        tel: patient.tel.trim(),
        email: patient.email.trim().toLowerCase(),
        photo: patient.photo,
        statut: patient.statut,
        profession: patient.profession.trim(),
        sang: patient.sang,
        allergie: patient.allergie.trim(),
        CNI: patient.CNI.trim(),
        tel_a_prevenir: patient.tel_a_prevenir.trim(),
        cartePatient: null
      };

      const response = await fetch("http://localhost:3000/api/urologie/patients/creerUserPatient", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error || `Erreur lors de la création du patient: ${data.message}`
        });
        setLoading(false);
        return;
      }

      const patientId = data.patient?.id || data.id;

      if (!patientId) {
        setMessage({
          type: 'error',
          text: "Erreur: ID du patient non trouvé dans la réponse"
        });
        setLoading(false);
        return;
      }

      console.log("✅ Patient créé avec ID:", patientId);
      console.log("🔄 Étape 2: Affectation de la carte QR...");

      const affectationResponse = await fetch("http://localhost:3000/api/urologie/qrcodes/affecter", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: patientId,
          qrCodeContenu: carteScannee
        })
      });

      const affectationData = await affectationResponse.json();

      if (affectationResponse.ok && affectationData.success) {
        setMessage({
          type: 'success',
          text: `🎉 Patient créé et carte ${carteScannee} affectée avec succès !`
        });

        setPatientCreated({
          ...data,
          cartePatient: carteScannee
        });

        setPatient({
          prenom: "",
          nom: "",
          adresse: "",
          profession: "",
          date_nai: "",
          CNI: "",
          statut: "Actif",
          sexe: "",
          email: "",
          tel: "",
          sang: "",
          tel_a_prevenir: "",
          allergie: "",
          photo: "default-avatar.png",
          cartePatient: ""
        } as PatientData);

        stopCamera();
        setShowModal(false);

      } else {
        let errorMessage = "Erreur lors de l'affectation de la carte";

        if (affectationData.message) {
          errorMessage = affectationData.message;
        }

        if (affectationData.patientExistant) {
          errorMessage = `Cette carte est déjà utilisée par : ${affectationData.patientExistant.prenom} ${affectationData.patientExistant.nom}`;
        }

        setMessage({
          type: 'error',
          text: `Patient créé mais ${errorMessage}. Vous pouvez affecter une carte manuellement plus tard.`
        });

        setPatientCreated({
          ...data,
          cartePatient: null
        });
      }

    } catch (error) {
      console.error('🚨 Erreur enregistrement automatique:', error);
      setMessage({
        type: 'error',
        text: "Erreur de connexion lors de l'enregistrement automatique"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanModal = async () => {
    await fetchQRCodesDisponibles();
    setShowModal(true);
  };

  const closeModal = () => {
    stopCamera();
    setShowModal(false);
    setQrCodeResult("");
  };

  const formFields = [
    { name: "prenom", label: "Prénom *", icon: User, color: "bg-gray-400" },
    { name: "nom", label: "Nom *", icon: User, color: "bg-gray-400" },
    { name: "date_nai", label: "Naissance", icon: Calendar, type: "date", color: "bg-red-600" },
    { name: "CNI", label: "CNI", icon: CreditCard, color: "bg-red-600" },
    { name: "sexe", label: "Sexe *", icon: Users, color: "bg-indigo-900" },
    { name: "tel", label: "Téléphone", icon: Phone, color: "bg-yellow-400" },
    { name: "tel_a_prevenir", label: "Téléphone Urgence", icon: PhoneCall, color: "bg-blue-500" },
    { name: "email", label: "Email *", icon: Mail, type: "email", color: "bg-yellow-400" },
    { name: "sang", label: "Gp Sanguin", icon: Droplet, color: "bg-blue-500" },
    { name: "allergie", label: "Allergies", icon: AlertTriangle, color: "bg-orange-500" },
    { name: "adresse", label: "Adresse", icon: Home, color: "bg-gray-400" },
    { name: "profession", label: "Profession", icon: Briefcase, color: "bg-gray-400" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouveau Patient</h1>
            <p className="text-gray-600">Enregistrement d'un nouveau patient dans le système</p>
          </div> */}

          <div className="bg-white rounded-xl shadow-xl p-12">
            {message && (
              <div className={`mb-8 p-5 rounded-lg flex items-center gap-3 ${message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="text-green-600 w-6 h-6" />
                ) : (
                  <AlertCircle className="text-red-600 w-6 h-6" />
                )}
                <span className="text-base">{message.text}</span>
              </div>
            )}

            {qrCodeResult && (
              <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 text-green-800">
                  <QrCode className="w-6 h-6" />
                  <span className="font-medium text-base">Carte Patient Scannée :</span>
                  <span className="font-mono bg-green-100 px-3 py-2 rounded text-base font-semibold">{qrCodeResult}</span>
                </div>
                <p className="text-base text-green-600 mt-2">
                  Carte détectée et prête pour l'enregistrement.
                </p>
              </div>
            )}

            {/* {patientCreated && (
              <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3 text-lg">Patient créé avec succès :</h3>
                <div className="text-base text-green-700">
                  <p><strong>Carte Patient:</strong> {qrCodeResult || "Aucune carte affectée"}</p>
                  <p><strong>Service:</strong> {patientCreated.service || "Urologie"}</p>
                  <p><strong>Structure:</strong> {patientCreated.structure || "Structure médicale"}</p>
                  <p><strong>Créé par:</strong> {patientCreated.medecin_createur || "Médecin connecté"}</p>
                  {patientCreated.patient?.id && (
                    <p><strong>ID Patient:</strong> {patientCreated.patient.id}</p>
                  )}
                </div>
              </div>
            )} */}

            <div>
              <div className="grid grid-cols-2 gap-8">
                {formFields.map(({ name, label, icon: Icon, type = "text", color }) => (
                  <div key={name} className="flex items-center rounded-full overflow-hidden shadow-md text-base h-16 w-full">
                    <div className={`p-4 flex items-center justify-center ${color} min-w-[64px]`}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    {name === "sexe" ? (
                      <select
                        name={name}
                        value={patient[name as keyof PatientData]}
                        onChange={handleChange}
                        className="px-5 py-4 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">{label.replace(' *', '')}...</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    ) : name === "sang" ? (
                      <select
                        name={name}
                        value={patient[name as keyof PatientData]}
                        onChange={handleChange}
                        className="px-5 py-4 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{label}...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={patient[name as keyof PatientData]}
                        onChange={handleChange}
                        placeholder={label.replace(' *', '')}
                        className="px-5 py-4 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                        required={label.includes('*')}
                      />
                    )}
                  </div>
                ))}

                <div className="col-span-2 flex justify-center gap-6 mt-8">
                  <button
                    type="button"
                    onClick={handleScanModal}
                    className="bg-green-600 text-white px-6 py-4 rounded-full shadow-md hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-3 text-base"
                    disabled={loading || patientCreated}
                  >
                    <QrCode className="w-5 h-5" />
                    Carte QR
                  </button>
                  <button
                    type="button"
                    onClick={handlePatientSubmission}
                    className="bg-indigo-700 text-white px-8 py-4 rounded-full shadow-md hover:bg-indigo-800 transition-all transform hover:scale-105 text-base flex items-center gap-3 disabled:opacity-50"
                    disabled={loading || patientCreated}
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin w-5 h-5" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer Patient'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs max-h-[70vh] overflow-y-auto">
            
            <div className="bg-blue-600 text-white px-3 py-2 rounded-t-lg flex justify-between items-center">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scanner
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 text-xl"
              >
                ×
              </button>
            </div>

            <div className="px-3 py-2 text-sm">
              {scanning && (
                <p className="text-blue-600 text-xs text-center mb-2">
                  🔍 Tentative {scanAttempts} – En attente de détection...
                </p>
              )}

              {qrCodesDisponibles.length > 0 && (
                <div className="mb-2 p-2 bg-blue-50 text-xs text-blue-800 border border-blue-200 rounded">
                  {qrCodesDisponibles.length} carte(s) QR disponible(s)
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded relative overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover"
                  style={{ display: scanning ? 'block' : 'none' }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {!scanning && (
                  <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                    <Camera className="w-8 h-8" />
                    <p className="mt-1">Caméra inactive</p>
                  </div>
                )}

                {scanning && (
                  <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                    <div className="w-36 h-36 border-2 border-red-500 border-dashed bg-red-100 bg-opacity-10 relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-500" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-500" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-500" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-500" />
                    </div>
                  </div>
                )}
              </div>

              {scanning && (
                <div className="text-center mt-3">
                  <button
                    onClick={simulateQRDetection}
                    className="text-xs px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                    disabled={loading || qrCodesDisponibles.length === 0}
                  >
                    🧪 Simuler QR
                  </button>
                </div>
              )}

              {qrCodeResult && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                  ✅ QR détecté : {qrCodeResult}
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
              >
                Fermer
              </button>
              {!scanning ? (
                <button
                  onClick={startCamera}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                >
                  <Camera className="w-4 h-4" />
                  Démarrer
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-1"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPatientForm;