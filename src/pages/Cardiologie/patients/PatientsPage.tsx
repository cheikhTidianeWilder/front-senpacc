import React, { useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  FaUser,
  FaBirthdayCake,
  FaIdCard,
  FaVenusMars,
  FaPhone,
  FaPhoneAlt,
  FaEnvelope,
  FaTint,
  FaUsers,
  FaHome,
  FaBriefcase,
  FaQrcode,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const AddPatientForm = () => {
  const [patient, setPatient] = useState({
    prenom: "",
    nom: "",
    adresse: "",
    profession: "",
    date_nai: "",
    CNI: "",
    statut: "",
    sexe: "",
    email: "",
    tel: "",
    sang: "",
    tel_a_prevenir: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Patient:", patient);
  };

  const handleScan = async () => {
    const codeReader = new BrowserMultiFormatReader();
    try {
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, "video");
      const valeurScannee = result.getText();
      const donnees = JSON.parse(valeurScannee); // ⚠️ suppose que le QR code contient du JSON
      setPatient((prev) => ({ ...prev, ...donnees }));
      setShowModal(false);
    } catch (err) {
      console.error("Erreur lors du scan :", err);
      alert("Échec du scan ou format de données invalide.");
    }
  };

 return (
  <>
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-xl grid grid-cols-2 gap-6 w-full max-w-2xl"
      >
        {[ // Champs du formulaire
          { name: "prenom", label: "Prénom", icon: FaUser, color: "bg-gray-400" },
          { name: "nom", label: "Nom", icon: FaUser, color: "bg-gray-400" },
          { name: "date_nai", label: "Naissance", icon: FaBirthdayCake, type: "date", color: "bg-red-600" },
          { name: "CNI", label: "CNI", icon: FaIdCard, color: "bg-red-600" },
          { name: "sexe", label: "Sexe", icon: FaVenusMars, color: "bg-indigo-900" },
          { name: "tel", label: "Téléphone", icon: FaPhone, color: "bg-yellow-400" },
          { name: "tel_a_prevenir", label: "Téléphone Urgence", icon: FaPhoneAlt, color: "bg-blue-500" },
          { name: "email", label: "Email", icon: FaEnvelope, type: "email", color: "bg-yellow-400" },
          { name: "sang", label: "Gp Sanguin", icon: FaTint, color: "bg-blue-500" },
          { name: "statut", label: "Statut", icon: FaUsers, color: "bg-indigo-900" },
          { name: "adresse", label: "Adresse", icon: FaHome, color: "bg-gray-400" },
          { name: "profession", label: "Profession", icon: FaBriefcase, color: "bg-gray-400" },
        ].map(({ name, label, icon: Icon, type = "text", color }) => (
          <div key={name} className="flex items-center rounded-full overflow-hidden shadow-md text-base h-12 w-full">
            <div className={`p-3 flex items-center justify-center ${color} min-w-[48px]`}>
              <Icon className="text-white text-lg" />
            </div>
            {name === "sexe" || name === "statut" || name === "sang" ? (
              <select
                name={name}
                value={patient[name as keyof typeof patient]}
                onChange={handleChange}
                className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{label}...</option>
                {name === "sexe" && (
                  <>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </>
                )}
                {name === "statut" && (
                  <>
                    <option value="célibataire">Célibataire</option>
                    <option value="marié(e)">Marié(e)</option>
                    <option value="divorcé(e)">Divorcé(e)</option>
                    <option value="veuf(ve)">Veuf(ve)</option>
                  </>
                )}
                {name === "sang" && (
                  <>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={patient[name as keyof typeof patient]}
                onChange={handleChange}
                placeholder={label}
                className="px-4 py-2 focus:outline-none bg-white text-base w-full border-0 focus:ring-2 focus:ring-blue-500"
                onFocus={() => setPatient((prev) => ({ ...prev, [name]: "" }))}
              />
            )}
          </div>
        ))}
        
        {/* Boutons d'action */}
        <div className="col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <FaQrcode className="text-base" />
            Scanner QR Code
          </button>
          <button
            type="submit"
            className="bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-800 transition-all transform hover:scale-105 text-sm"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>

    {/* Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <Modal.Title className="text-xl">📱 Scanner le QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body className="flex flex-col items-center p-6">
        <div className="mb-4 text-center">
          <p className="text-gray-600">Positionnez le QR code devant la caméra</p>
        </div>
        <video 
          id="video" 
          width="80%" 
          height="auto" 
          className="border-2 border-dashed border-gray-300 rounded-lg"
        />
      </Modal.Body>
      <Modal.Footer className="bg-gray-50">
        <Button 
          variant="secondary" 
          onClick={() => setShowModal(false)}
          className="px-4 py-2"
        >
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleScan}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
        >
          Démarrer le scan
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);};

export default AddPatientForm;
