// import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MonProfil = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth();
  const [stars, setStars] = useState([]);
  const [activeSection, setActiveSection] = useState('infos');

  const [infoPerso, setInfoPerso] = useState({
    prenom: '',
    nom: '',
    poste: '',
    email: '',
    telephone: '',
    localisation: '',
    disponibilite: '',
    siteWeb: '',
    linkedin: '',
    github: '',
    photo: null
  });
  const [cvFile, setCVFile] = useState(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('visualisation');
  
// initiale noms

  const handleClickUpload = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};
//gestion des notifications

const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3000/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
    }
  };

  fetchNotifications();
}, []);



//Création d'un menu déroulant qui s'ouvre quand tu cliques sur la cloche

const [showNotifications, setShowNotifications] = useState(false);

const toggleNotifications = () => {
  setShowNotifications(!showNotifications);
};


  // eslint-disable-next-line no-unused-vars
  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [langues, setLangues] = useState([]);

  // États pour les formulaires d'ajout
const [newExperience, setNewExperience] = useState({
  poste: '',
  entreprise: '',
  localisation: '',
  dateDebut: '',
  dateFin: '',
  description: ''
});

const [newFormation, setNewFormation] = useState({
  diplome: '',
  etablissement: '',
  localisation: '',
  dateDebut: '',
  dateFin: '',
  description: ''
});

const [newCompetence, setNewCompetence] = useState({
  nom: '',
  niveau: 50
});

const [newLangue, setNewLangue] = useState({
  nom: '',
  niveau: 'Débutant'
});

// États pour contrôler l'affichage des formulaires
const [showExperienceForm, setShowExperienceForm] = useState(false);
const [showFormationForm, setShowFormationForm] = useState(false);
const [showCompetenceForm, setShowCompetenceForm] = useState(false);
const [showLangueForm, setShowLangueForm] = useState(false);

// États pour l'édition
const [editingExperienceId, setEditingExperienceId] = useState(null);
const [editingFormationId, setEditingFormationId] = useState(null);
const [editingCompetenceId, setEditingCompetenceId] = useState(null);
const [editingLangueId, setEditingLangueId] = useState(null);
  
  const [visibiliteParams, setVisibiliteParams] = useState({
    profil: 'public',
    telephone: 'contacts',
    email: 'public',
    experiencesDetails: 'public',
    formationsDetails: 'public'
  });

// Fonction pour partager le profil
const handleShare = () => {
  // Créer un lien de partage vers le profil public
  const shareUrl = `${window.location.origin}/profil/${currentUser?.uid || 'user'}`;
  
  // Vérifier si l'API de partage est disponible
  if (navigator.share) {
    navigator.share({
      title: `Profil de ${infoPerso.prenom} ${infoPerso.nom} sur TalentMatch`,
      text: `Consultez le profil professionnel de ${infoPerso.prenom} ${infoPerso.nom} sur TalentMatch.`,
      url: shareUrl,
    })
    .catch((error) => console.log('Erreur de partage:', error));
  } else {
    // Fallback: copier le lien dans le presse-papiers
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Afficher une notification
        alert("Lien copié dans le presse-papiers !");
      })
      .catch((err) => {
        console.error('Erreur lors de la copie:', err);
        // Fallback manuel
        prompt('Copiez ce lien pour partager le profil:', shareUrl);
      });
  }
};

// Fonction pour afficher l'aperçu public
const handlePreview = () => {
  // Ouvrir une nouvelle fenêtre avec la vue publique du profil
  const previewUrl = `${window.location.origin}/profil/preview/${currentUser?.uid || 'user'}`;
  window.open(previewUrl, '_blank');
  
  // Alternative: utiliser la navigation React Router dans la même fenêtre
  // navigate(`/profil/preview/${currentUser?.uid || 'user'}`);
};

  // Génération des étoiles pour le background
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${Math.random() * 2}px`,
          duration: `${Math.random() * 5 + 3}s`
        });
      }
      setStars(newStars);
    };
    
    generateStars();
  }, []);

  useEffect(() => {
    const fetchCandidatData = async () => {
      if (!currentUser?.email) return;
  
      try {
        const res = await fetch(`http://localhost:3000/candidats?email=${currentUser.email}`);
        const data = await res.json();
        if (data) {
          setInfoPerso({
            prenom: data.prenom || '',
            nom: data.nom || '',
            poste: data.poste || '',
            email: data.email || '',
            telephone: data.telephone || '',
            localisation: data.localisation || '',
            disponibilite: data.disponibilite || '',
            siteWeb: data.site_web || '',
            linkedin: data.linkedin_url || '',
            github: data.github_url || '',
            photo: data.photo || null
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement des infos candidat :", err);
      }
    };
  
    fetchCandidatData();
  }, [currentUser]);
  

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Présent';
    
    const [year, month] = dateString.split('-');
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setMode('visualisation');
    // Ici, vous ajouteriez la logique pour enregistrer les modifications
  };

  // Changer de section

const handleSectionChange = (section) => {
  setActiveSection(section);
  setMode('visualisation');
};
  // Fonctions pour ajouter de nouveaux éléments
const handleAddExperience = (e) => {
  e.preventDefault();
  const newId = experiences.length > 0 ? Math.max(...experiences.map(exp => exp.id)) + 1 : 1;
  setExperiences([...experiences, { ...newExperience, id: newId }]);
  setNewExperience({ poste: '', entreprise: '', localisation: '', dateDebut: '', dateFin: '', description: '' });
  setShowExperienceForm(false);
};

const handleAddFormation = (e) => {
  e.preventDefault();
  const newId = formations.length > 0 ? Math.max(...formations.map(form => form.id)) + 1 : 1;
  setFormations([...formations, { ...newFormation, id: newId }]);
  setNewFormation({ diplome: '', etablissement: '', localisation: '', dateDebut: '', dateFin: '', description: '' });
  setShowFormationForm(false);
};

const handleAddCompetence = (e) => {
  e.preventDefault();
  const newId = competences.length > 0 ? Math.max(...competences.map(comp => comp.id)) + 1 : 1;
  setCompetences([...competences, { ...newCompetence, id: newId }]);
  setNewCompetence({ nom: '', niveau: 50 });
  setShowCompetenceForm(false);
};

const handleAddLangue = (e) => {
  e.preventDefault();
  const newId = langues.length > 0 ? Math.max(...langues.map(lang => lang.id)) + 1 : 1;
  setLangues([...langues, { ...newLangue, id: newId }]);
  setNewLangue({ nom: '', niveau: 'Débutant' });
  setShowLangueForm(false);
};

// Fonctions pour supprimer des éléments
const handleDeleteExperience = (id) => {
  setExperiences(experiences.filter(exp => exp.id !== id));
};

const handleDeleteFormation = (id) => {
  setFormations(formations.filter(form => form.id !== id));
};

const handleDeleteCompetence = (id) => {
  setCompetences(competences.filter(comp => comp.id !== id));
};

const handleDeleteLangue = (id) => {
  setLangues(langues.filter(lang => lang.id !== id));
};

// Fonctions pour éditer des éléments
const handleEditExperience = (id) => {
  const expToEdit = experiences.find(exp => exp.id === id);
  setNewExperience(expToEdit);
  setEditingExperienceId(id);
  setShowExperienceForm(true);
};

const handleUpdateExperience = (e) => {
  e.preventDefault();
  setExperiences(experiences.map(exp => exp.id === editingExperienceId ? newExperience : exp));
  setNewExperience({ poste: '', entreprise: '', localisation: '', dateDebut: '', dateFin: '', description: '' });
  setEditingExperienceId(null);
  setShowExperienceForm(false);
};

const handleEditFormation = (id) => {
  const formToEdit = formations.find(form => form.id === id);
  setNewFormation(formToEdit);
  setEditingFormationId(id);
  setShowFormationForm(true);
};

const handleUpdateFormation = (e) => {
  e.preventDefault();
  setFormations(formations.map(form => form.id === editingFormationId ? newFormation : form));
  setNewFormation({ diplome: '', etablissement: '', localisation: '', dateDebut: '', dateFin: '', description: '' });
  setEditingFormationId(null);
  setShowFormationForm(false);
};

const handleEditCompetence = (id) => {
  const compToEdit = competences.find(comp => comp.id === id);
  setNewCompetence(compToEdit);
  setEditingCompetenceId(id);
  setShowCompetenceForm(true);
};

const handleUpdateCompetence = (e) => {
  e.preventDefault();
  setCompetences(competences.map(comp => comp.id === editingCompetenceId ? newCompetence : comp));
  setNewCompetence({ nom: '', niveau: 50 });
  setEditingCompetenceId(null);
  setShowCompetenceForm(false);
};

const handleEditLangue = (id) => {
  const langToEdit = langues.find(lang => lang.id === id);
  setNewLangue(langToEdit);
  setEditingLangueId(id);
  setShowLangueForm(true);
};

const handleUpdateLangue = (e) => {
  e.preventDefault();
  setLangues(langues.map(lang => lang.id === editingLangueId ? newLangue : lang));
  setNewLangue({ nom: '', niveau: 'Débutant' });
  setEditingLangueId(null);
  setShowLangueForm(false);
};
      
    return (
    <>
      <div className="dashboard-container">
        {/* Background stars */}
        <div className="stars">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{ left: star.left, top: star.top, width: star.size, height: star.size, animation: `twinkle ${star.duration} infinite` }}
            />
          ))}
        </div>

      {/* Top navigation */}
      <header className="dashboard-header">
        <div className="header-logo">
          <Link to="/" className="logo">
            <div className="logo-icon">TM</div>
            <span>TalentMatch</span>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/entreprises" className="nav-link">Entreprises</Link>
          <Link to="/offres" className="nav-link">Offres</Link>
          <Link to="/candidats" className="nav-link">Candidats</Link>
          <Link to="/conseils" className="nav-link">Conseils</Link>
        </nav>
        <div className="header-actions">

        <div className="notifications" onClick={toggleNotifications}>
         <div className="notification-icon">
               {notifications.length > 0 && (
      <span className="notification-badge">{notifications.length}</span> )}
      {showNotifications && (
  <div className="notification-dropdown">
    {notifications.map((notif) => (
      <div key={notif.id} className="notification-item">
        {notif.message}
      </div>
    ))}
  </div>
)}

    <i className="far fa-bell"></i>
  </div>
</div>

          <div className="user-avatar">
           {infoPerso.prenom.charAt(0).toUpperCase()}
           {infoPerso.nom.charAt(0).toUpperCase()}
          </div>

        </div>
      </header>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">PRINCIPAL</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to="/candidate-dashboard" className="sidebar-link">
                  <i className="sidebar-icon fas fa-chart-bar"></i>
                  <span>Tableau de bord</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/offres-emploi" className="sidebar-link">
                  <i className="sidebar-icon fas fa-briefcase"></i>
                  <span>Offres d'emploi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/mes-candidatures" className="sidebar-link">
                  <i className="sidebar-icon fas fa-file-alt"></i>
                  <span>Mes candidatures</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/messages" className="sidebar-link">
                  <i className="sidebar-icon fas fa-comment-alt"></i>
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">PROFIL</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item active">
                <Link to="/mon-profil" className="sidebar-link">
                  <i className="sidebar-icon fas fa-user"></i>
                  <span>Mon profil</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/parametres" className="sidebar-link">
                  <i className="sidebar-icon fas fa-cog"></i>
                  <span>Paramètres</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

       {/* Main profile */}
       <main className="dashboard-main">
          <div className="profile-container">
            {/* En-tête du profil */}
            <div className="profile-header">
              <div className="profile-photo">
                {infoPerso.photo ? (
                  <img src={infoPerso.photo} alt="Profile" className="profile-img" />
                ) : (
                  <div className="profile-initials">
                    {infoPerso.prenom.charAt(0)}{infoPerso.nom.charAt(0)}
                  </div>
                )}
              </div>
              <div className="profile-title">
                <h1 className="profile-name">{infoPerso.prenom} {infoPerso.nom}</h1>
                <p className="profile-poste">{infoPerso.poste}</p>
                <p className="profile-localisation">
                  <i className="fas fa-map-marker-alt"></i>
                  {infoPerso.localisation}
                </p>
              </div>
              <div className="profile-actions">
  {/* Input invisible */}
  <input type="file" accept=".pdf" ref={fileInputRef} style={{ display: 'none' }}
   onChange={(e) => setCVFile(e.target.files[0])} />

  <button className="profile-action-btn download-btn" onClick={handleClickUpload}>
    <i className="fas fa-download"></i>
    Télécharger CV
  </button>

  <button className="profile-action-btn share-btn" onClick={handleShare}>
    <i className="fas fa-share-alt"></i>
    Partager
  </button>
             <button className="profile-action-btn preview-btn" onClick={handlePreview}>
                <i className="fas fa-eye"></i>
                Aperçu public
             </button>
              </div>
            </div>
            </div>

            {/* Navigation du profil */}
            <div className="profile-nav">
              <button 
                className={`profile-nav-btn ${activeSection === 'infos' ? 'active' : ''}`}
                onClick={() => handleSectionChange('infos')}
              >
                <i className="fas fa-user"></i>
                Informations
              </button>
              <button 
                className={`profile-nav-btn ${activeSection === 'experiences' ? 'active' : ''}`}
                onClick={() => handleSectionChange('experiences')}
              >
                <i className="fas fa-briefcase"></i>
                Expériences
              </button>
              <button 
                className={`profile-nav-btn ${activeSection === 'formations' ? 'active' : ''}`}
                onClick={() => handleSectionChange('formations')}
              >
                <i className="fas fa-graduation-cap"></i>
                Formations
              </button>
              <button 
                className={`profile-nav-btn ${activeSection === 'competences' ? 'active' : ''}`}
                onClick={() => handleSectionChange('competences')}
              > 
                <i className="fas fa-code"></i>
                Compétences
              </button>
              <button 
                className={`profile-nav-btn ${activeSection === 'langues' ? 'active' : ''}`}
                onClick={() => handleSectionChange('langues')}
              >
                <i className="fas fa-language"></i>
                Langues
              </button>
              <button 
                className={`profile-nav-btn ${activeSection === 'visibilite' ? 'active' : ''}`}
                onClick={() => handleSectionChange('visibilite')}
              >
                <i className="fas fa-lock"></i>
                Visibilité
              </button>
            </div>
          
            {/* Contenu de la section active */}
            <div className="profile-content">
              {/* Section Expériences */}
              {activeSection === 'experiences' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Expériences professionnelles</h2>
                    <button className="add-btn" onClick={() => setShowExperienceForm(true)}>
                      <i className="fas fa-plus"></i>
                      Ajouter une expérience
                    </button>

                    {showExperienceForm && (
                      <form className="add-form" onSubmit={handleAddExperience}>
                        <h3 className="form-title">Ajouter une expérience</h3>
                        
                        <div className="form-group">
                          <label>Poste</label>
                          <input
                            type="text"
                            value={newExperience.poste}
                            onChange={(e) => setNewExperience({ ...newExperience, poste: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Entreprise</label>
                            <input
                              type="text"
                              value={newExperience.entreprise}
                              onChange={(e) => setNewExperience({ ...newExperience, entreprise: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Localisation</label>
                            <input
                              type="text"
                              value={newExperience.localisation}
                              onChange={(e) => setNewExperience({ ...newExperience, localisation: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Date de début</label>
                            <input
                              type="month"
                              value={newExperience.dateDebut}
                              onChange={(e) => setNewExperience({ ...newExperience, dateDebut: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Date de fin</label>
                            <input
                              type="month"
                              value={newExperience.dateFin}
                              onChange={(e) => setNewExperience({ ...newExperience, dateFin: e.target.value })}
                              placeholder="Laissez vide pour 'Présent'"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            rows="4"
                            value={newExperience.description}
                            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                            required
                          ></textarea>
                        </div>
                        
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={() => setShowExperienceForm(false)}>
                            Annuler
                          </button>
                          <button type="submit" className="save-btn">
                            Ajouter
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  <div className="experiences-list">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="experience-item">
                        <div className="experience-header">
                          <div className="experience-period">
                            {formatDate(exp.dateDebut)} - {formatDate(exp.dateFin)}
                          </div>
                          <div className="experience-actions">
                            <button className="action-icon edit-icon">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="action-icon delete-icon">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="experience-content">
                          <h3 className="experience-poste">{exp.poste}</h3>
                          <p className="experience-entreprise">{exp.entreprise} - {exp.localisation}</p>
                          <p className="experience-description">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Section Informations */}
{activeSection === 'infos' && (
  <div className="profile-section">
    <div className="section-header">
      <h2 className="section-title">Informations personnelles</h2>
      {mode === 'visualisation' ? (
        <button className="edit-btn" onClick={() => setMode('edition')}>
          <i className="fas fa-edit"></i>
          Modifier
        </button>
      ) : (
        <button className="cancel-btn" onClick={() => setMode('visualisation')}>
          <i className="fas fa-times"></i>
          Annuler
        </button>
      )}
    </div>
    
    {mode === 'visualisation' ? (
      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Prénom et Nom</div>
          <div className="info-value">{infoPerso.prenom} {infoPerso.nom}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Poste actuel</div>
          <div className="info-value">{infoPerso.poste || 'Non renseigné'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Email</div>
          <div className="info-value">{infoPerso.email || 'Non renseigné'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Téléphone</div>
          <div className="info-value">{infoPerso.telephone || 'Non renseigné'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Localisation</div>
          <div className="info-value">{infoPerso.localisation || 'Non renseigné'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Disponibilité</div>
          <div className="info-value">{infoPerso.disponibilite || 'Non renseigné'}</div>
        </div>
        <div className="info-item full-width">
          <div className="info-label">Site web</div>
          <div className="info-value">
            {infoPerso.siteWeb ? (
              <a href={infoPerso.siteWeb} target="_blank" rel="noopener noreferrer">
                {infoPerso.siteWeb}
              </a>
            ) : 'Non renseigné'}
          </div>
        </div>
        <div className="info-item">
          <div className="info-label">LinkedIn</div>
          <div className="info-value">
            {infoPerso.linkedin ? (
              <a href={infoPerso.linkedin} target="_blank" rel="noopener noreferrer">
                {infoPerso.linkedin}
              </a>
            ) : 'Non renseigné'}
          </div>
        </div>
        <div className="info-item">
          <div className="info-label">GitHub</div>
          <div className="info-value">
            {infoPerso.github ? (
              <a href={infoPerso.github} target="_blank" rel="noopener noreferrer">
                {infoPerso.github}
              </a>
            ) : 'Non renseigné'}
          </div>
        </div>
      </div>
    ) : (
      <form className="info-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={infoPerso.prenom}
              onChange={(e) => setInfoPerso({...infoPerso, prenom: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={infoPerso.nom}
              onChange={(e) => setInfoPerso({...infoPerso, nom: e.target.value})}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Poste actuel</label>
          <input
            type="text"
            value={infoPerso.poste}
            onChange={(e) => setInfoPerso({...infoPerso, poste: e.target.value})}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={infoPerso.email}
              onChange={(e) => setInfoPerso({...infoPerso, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              value={infoPerso.telephone}
              onChange={(e) => setInfoPerso({...infoPerso, telephone: e.target.value})}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Localisation</label>
            <input
              type="text"
              value={infoPerso.localisation}
              onChange={(e) => setInfoPerso({...infoPerso, localisation: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Disponibilité</label>
            <select
              value={infoPerso.disponibilite}
              onChange={(e) => setInfoPerso({...infoPerso, disponibilite: e.target.value})}
            >
              <option value="">Sélectionnez une option</option>
              <option value="Immédiate">Immédiate</option>
              <option value="1 mois">1 mois</option>
              <option value="2 mois">2 mois</option>
              <option value="3 mois">3 mois</option>
              <option value="Plus de 3 mois">Plus de 3 mois</option>
              <option value="En veille">En veille</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Site web</label>
          <input
            type="url"
            value={infoPerso.siteWeb}
            onChange={(e) => setInfoPerso({...infoPerso, siteWeb: e.target.value})}
            placeholder="https://..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              value={infoPerso.linkedin}
              onChange={(e) => setInfoPerso({...infoPerso, linkedin: e.target.value})}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              value={infoPerso.github}
              onChange={(e) => setInfoPerso({...infoPerso, github: e.target.value})}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
        <div className="form-group">
          <label>Photo de profil</label>
          <div className="photo-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setInfoPerso({...infoPerso, photo: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null})}
            />
            {infoPerso.photo && (
              <div className="photo-preview">
                <img src={infoPerso.photo} alt="Aperçu de la photo" />
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => setMode('visualisation')}>
            Annuler
          </button>
          <button type="submit" className="save-btn">
            Enregistrer
          </button>
        </div>
      </form>
    )}
  </div>
)}

              {/* Section Formations */}
              {activeSection === 'formations' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Formations</h2>
                    <button className="add-btn" onClick={() => setShowFormationForm(true)}>
                      <i className="fas fa-plus"></i>
                      Ajouter une formation
                    </button>

                    {showFormationForm && (
                      <form className="add-form" onSubmit={handleAddFormation}>
                        <h3 className="form-title">Ajouter une formation</h3>
                        
                        <div className="form-group">
                          <label>Diplôme</label>
                          <input
                            type="text"
                            value={newFormation.diplome}
                            onChange={(e) => setNewFormation({ ...newFormation, diplome: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Établissement</label>
                            <input
                              type="text"
                              value={newFormation.etablissement}
                              onChange={(e) => setNewFormation({ ...newFormation, etablissement: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Localisation</label>
                            <input
                              type="text"
                              value={newFormation.localisation}
                              onChange={(e) => setNewFormation({ ...newFormation, localisation: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Date de début</label>
                            <input
                              type="month"
                              value={newFormation.dateDebut}
                              onChange={(e) => setNewFormation({ ...newFormation, dateDebut: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Date de fin</label>
                            <input
                              type="month"
                              value={newFormation.dateFin}
                              onChange={(e) => setNewFormation({ ...newFormation, dateFin: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            rows="4"
                            value={newFormation.description}
                            onChange={(e) => setNewFormation({ ...newFormation, description: e.target.value })}
                          ></textarea>
                        </div>
                        
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={() => setShowFormationForm(false)}>
                            Annuler
                          </button>
                          <button type="submit" className="save-btn">
                            Ajouter
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

             {/* Section Compétences */}
{activeSection === 'competences' && (
  <div className="profile-section">
    <div className="section-header">
      <h2 className="section-title">Compétences techniques</h2>
      <button className="add-btn" onClick={() => setShowCompetenceForm(true)}>
        <i className="fas fa-plus"></i>
        Ajouter une compétence
      </button>
    </div>
    
    {showCompetenceForm && (
      <form className="add-form" onSubmit={handleAddCompetence}>
        <h3 className="form-title">Ajouter une compétence</h3>
        
        <div className="form-group">
          <label>Nom de la compétence</label>
          <input
            type="text"
            value={newCompetence.nom}
            onChange={(e) => setNewCompetence({ ...newCompetence, nom: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Niveau ({newCompetence.niveau}%)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={newCompetence.niveau}
            onChange={(e) => setNewCompetence({ ...newCompetence, niveau: parseInt(e.target.value) })}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => setShowCompetenceForm(false)}>
            Annuler
          </button>
          <button type="submit" className="save-btn">
            Ajouter
          </button>
        </div>
      </form>
    )}
    
    <div className="competences-grid">
      {competences.length > 0 ? (
        competences.map((competence) => (
          <div key={competence.id} className="competence-item">
            <div className="competence-header">
              <h3 className="competence-nom">{competence.nom}</h3>
              <div className="competence-actions">
                <button className="action-icon edit-icon" onClick={() => handleEditCompetence(competence.id)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-icon delete-icon" onClick={() => handleDeleteCompetence(competence.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div className="competence-niveau">
              <div className="niveau-bar">
                <div className="niveau-progress" style={{ width: `${competence.niveau}%` }}></div>
              </div>
              <span className="niveau-value">{competence.niveau}%</span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-section">
          <p>Vous n'avez pas encore ajouté de compétence technique.</p>
        </div>
      )}
    </div>
  </div>
)}

              {/* Section Langues */}
              {activeSection === 'langues' && (
  <div className="profile-section">
    <div className="section-header">
      <h2 className="section-title">Langues</h2>
      <button className="add-btn" onClick={() => setShowLangueForm(true)}>
        <i className="fas fa-plus"></i>
        Ajouter une langue
      </button>
    </div>
    
    {showLangueForm && (
      <form className="add-form" onSubmit={editingLangueId ? handleUpdateLangue : handleAddLangue}>
        <h3 className="form-title">
          {editingLangueId ? "Modifier une langue" : "Ajouter une langue"}
        </h3>
        
        <div className="form-group">
          <label>Nom de la langue</label>
          <input
            type="text"
            value={newLangue.nom}
            onChange={(e) => setNewLangue({ ...newLangue, nom: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Niveau</label>
          <select
            value={newLangue.niveau}
            onChange={(e) => setNewLangue({ ...newLangue, niveau: e.target.value })}
            required
          >
            <option value="">Sélectionnez un niveau</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
            <option value="Courant">Courant</option>
            <option value="Bilingue">Bilingue</option>
            <option value="Langue maternelle">Langue maternelle</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => {
            setShowLangueForm(false);
            setEditingLangueId(null);
            setNewLangue({ nom: '', niveau: 'Débutant' });
          }}>
            Annuler
          </button>
          <button type="submit" className="save-btn">
            {editingLangueId ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    )}
    
    <div className="langues-list">
      {langues.length > 0 ? (
        langues.map((langue) => (
          <div key={langue.id} className="langue-item">
            <h3 className="langue-nom">{langue.nom}</h3>
            <span className="langue-niveau">{langue.niveau}</span>
            <div className="langue-actions">
              <button 
                className="action-icon edit-icon" 
                onClick={() => handleEditLangue(langue.id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="action-icon delete-icon" 
                onClick={() => handleDeleteLangue(langue.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-section">
          <p>Vous n'avez pas encore ajouté de langues.</p>
        </div>
      )}
    </div>
  </div>
)}
              {/* Section Visibilité */}
              {activeSection === 'visibilite' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Paramètres de visibilité</h2>
                    <button className="save-btn">
                      <i className="fas fa-save"></i>
                      Enregistrer
                    </button>
                  </div>
                  
                  <div className="visibilite-options">
                    <div className="visibilite-item">
                      <div className="visibilite-info">
                        <h3 className="visibilite-titre">Profil</h3>
                        <p className="visibilite-description">Qui peut voir votre profil ?</p>
                      </div>
                      <div className="visibilite-control">
                        <select 
                          value={visibiliteParams.profil}
                          onChange={(e) => setVisibiliteParams({ ...visibiliteParams, profil: e.target.value })}
                        >
                          <option value="public">Tout le monde</option>
                          <option value="contacts">Mes contacts uniquement</option>
                          <option value="prive">Privé (Vous uniquement)</option>
                        </select>
                      </div>
                    </div>
                    <div className="visibilite-item">
                      <div className="visibilite-info">
                        <h3 className="visibilite-titre">Numéro de téléphone</h3>
                        <p className="visibilite-description">Qui peut voir votre numéro de téléphone ?</p>
                      </div>
                      <div className="visibilite-control">
                        <select 
                          value={visibiliteParams.telephone}
                          onChange={(e) => setVisibiliteParams({ ...visibiliteParams, telephone: e.target.value })}
                        >
                          <option value="public">Tout le monde</option>
                          <option value="contacts">Mes contacts uniquement</option>
                          <option value="prive">Privé (Vous uniquement)</option>
                        </select>
                      </div>
                    </div>
                    <div className="visibilite-item">
                      <div className="visibilite-info">
                        <h3 className="visibilite-titre">Adresse email</h3>
                        <p className="visibilite-description">Qui peut voir votre adresse email ?</p>
                      </div>
                      <div className="visibilite-control">
                        <select 
                          value={visibiliteParams.email}
                          onChange={(e) => setVisibiliteParams({ ...visibiliteParams, email: e.target.value })}
                        >
                          <option value="public">Tout le monde</option>
                          <option value="contacts">Mes contacts uniquement</option>
                          <option value="prive">Privé (Vous uniquement)</option>
                        </select>
                      </div>
                    </div>
                    <div className="visibilite-item">
                      <div className="visibilite-info">
                        <h3 className="visibilite-titre">Détails des expériences</h3>
                        <p className="visibilite-description">Qui peut voir les détails de vos expériences ?</p>
                      </div>
                      <div className="visibilite-control">
                        <select 
                          value={visibiliteParams.experiencesDetails}
                          onChange={(e) => setVisibiliteParams({ ...visibiliteParams, experiencesDetails: e.target.value })}
                        >
                          <option value="public">Tout le monde</option>
                          <option value="contacts">Mes contacts uniquement</option>
                          <option value="prive">Privé (Vous uniquement)</option>
                        </select>
                      </div>
                    </div>
                    <div className="visibilite-item">
                      <div className="visibilite-info">
                        <h3 className="visibilite-titre">Détails des formations</h3>
                        <p className="visibilite-description">Qui peut voir les détails de vos formations ?</p>
                      </div>
                      <div className="visibilite-control">
                        <select 
                          value={visibiliteParams.formationsDetails}
                          onChange={(e) => setVisibiliteParams({ ...visibiliteParams, formationsDetails: e.target.value })}
                        >
                          <option value="public">Tout le monde</option>
                          <option value="contacts">Mes contacts uniquement</option>
                          <option value="prive">Privé (Vous uniquement)</option>
                        </select>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
    )};
export default MonProfil;