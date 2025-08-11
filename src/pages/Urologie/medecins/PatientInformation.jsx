import React from 'react';

function PatientInformation({ patient }) {
  if (!patient) return <p>Chargement des données patient...</p>;

  const { user, profession, sang, allergie, cartePatient, CNI, tel_a_prevenir, derniere_consultation } = patient;

  // Calcul de l'âge à partir de la date de naissance
  const calculerAge = (date_nai) => {
    const birth = new Date(date_nai);
    const now = new Date();
    const ageDiff = new Date(now - birth);
    const years = ageDiff.getUTCFullYear() - 1970;
    // const months = ageDiff.getUTCMonth();  ${months} mois, ${days} jours
    // const days = ageDiff.getUTCDate() - 1;
    return `${years} ans,`;   
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="mb-4 text-2xl font-bold text-center">Informations de {user.prenom} {user.nom}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Genre</label>
              <input type="text" value={user.sexe} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">État matrimonial</label>
              <input type="text" value={user.statut || 'Non renseigné'} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Profession</label>
              <input type="text" value={profession} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input type="text" value={user.email} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Téléphone</label>
              <input type="text" value={user.tel} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Urgence</label>
              <input type="text" value={tel_a_prevenir || 'Non défini'} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Date de naissance</label>
              <input type="text" value={user.date_nai} disabled className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Dernière consultation</label>
              <input type="text" value={derniere_consultation || 'Aucune'} disabled className="w-full border p-2 rounded" />
            </div>
          </div>

          {/* Actions en bas */}
          <div className="flex justify-center mt-6 space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">QR</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded shadow">🚨</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow">⚠</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded shadow">✔</button>
          </div>
        </div>

        {/* Card patient */}
        <div className="bg-white border rounded p-6 shadow text-center">
          <img
            src="/logo_blanc.jpeg"
            alt="avatar"
            className="mx-auto mb-4 w-24 h-24 rounded-full border-4 border-gray-300"
          />
          <p className="text-lg font-semibold">{user.prenom} {user.nom}</p>
          <p className="text-green-600 font-medium mt-2">  {sang}</p>
          <p className="text-sm mt-2">
            âge : {calculerAge(user.date_nai)}<br />
            CNI : {CNI || 'Non défini'}<br />
            allergies : {allergie || 'Aucune'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientInformation;
