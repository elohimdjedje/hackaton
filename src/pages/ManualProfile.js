import React, { useState } from 'react';

const ManualProfile = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    linkedin_url: '',
    cv_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/candidats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert("✅ Candidat ajouté !");
      console.log("Retour API :", data);
    } catch (error) {
      console.error("Erreur serveur :", error);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="manual-profile">
      <h2>Créer mon profil</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={formData.linkedin_url} onChange={handleChange} />
        <input type="text" name="cv_url" placeholder="CV URL" value={formData.cv_url} onChange={handleChange} />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default ManualProfile;
