import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MonProfil = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth();
  const [stars, setStars] = useState([]);
  const [activeSection, setActiveSection] = useState('infos');
  const [infoPerso, setInfoPerso] = useState({
    prenom: 'Jean',
    nom: 'Dupont',
    poste: 'Développeur Full Stack',
    email: 'jean.dupont@example.com',
    telephone: '+33 6 12 34 56 78',
    localisation: 'Paris, France',
    disponibilite: 'Immédiate',
    siteWeb: 'jeandupont.fr',
    linkedin: 'linkedin.com/in/jeandupont',
    github: 'github.com/jeandupont',
    photo: null
  });
  const [mode, setMode] = useState('visualisation');
  
  // eslint-disable-next-line no-unused-vars
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      poste: 'Développeur Full Stack',
      entreprise: 'TechVision',
      localisation: 'Paris, France',
      dateDebut: '2023-01',
      dateFin: null,
      description: "Développement d'applications web en utilisant React, Node.js et MongoDB. Mise en place de CI/CD avec GitHub Actions. Participation à la conception de l'architecture technique."
    },
    {
      id: 2,
      poste: 'Développeur Frontend',
      entreprise: 'DigitalSoft',
      localisation: 'Lyon, France',
      dateDebut: '2021-03',
      dateFin: '2022-12',
      description: "Développement d'interfaces utilisateur avec React et Redux. Collaboration avec l'équipe design pour implémenter les maquettes. Optimisation des performances des applications."
    },
    {
      id: 3,
      poste: 'Développeur Web Junior',
      entreprise: 'StartupInno',
      localisation: 'Bordeaux, France',
      dateDebut: '2019-09',
      dateFin: '2021-02',
      description: "Développement de sites web responsifs en utilisant HTML, CSS et JavaScript. Intégration de CMS comme WordPress."
    }
  ]);
  
  // eslint-disable-next-line no-unused-vars
  const [formations, setFormations] = useState([
    {
      id: 1,
      diplome: "Master en Développement Web",
      etablissement: "Université Paris Tech",
      localisation: "Paris, France",
      dateDebut: "2017-09",
      dateFin: "2019-07",
      description: "Spécialisation en développement web et applications mobiles."
    },
    {
      id: 2,
      diplome: "Licence Informatique",
      etablissement: "Université de Bordeaux",
      localisation: "Bordeaux, France",
      dateDebut: "2014-09",
      dateFin: "2017-06",
      description: "Formation généraliste en informatique, algorithmes et programmation."
    }
  ]);
  
  // eslint-disable-next-line no-unused-vars
  const [competences, setCompetences] = useState([
    { id: 1, nom: "JavaScript", niveau: 90 },
    { id: 2, nom: "React", niveau: 85 },
    { id: 3, nom: "Node.js", niveau: 80 },
    { id: 4, nom: "MongoDB", niveau: 75 },
    { id: 5, nom: "Express", niveau: 80 },
    { id: 6, nom: "HTML/CSS", niveau: 90 },
    { id: 7, nom: "Git", niveau: 85 },
    { id: 8, nom: "Docker", niveau: 70 },
    { id: 9, nom: "AWS", niveau: 65 },
    { id: 10, nom: "TypeScript", niveau: 75 }
  ]);
  
  // eslint-disable-next-line no-unused-vars
  const [langues, setLangues] = useState([
    { id: 1, nom: "Français", niveau: "Langue maternelle" },
    { id: 2, nom: "Anglais", niveau: "Courant" },
    { id: 3, nom: "Espagnol", niveau: "Intermédiaire" }
  ]);
  
  const [visibiliteParams, setVisibiliteParams] = useState({
    profil: 'public',
    telephone: 'contacts',
    email: 'public',
    experiencesDetails: 'public',
    formationsDetails: 'public'
  });

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

  return (
    <div className="dashboard-container">
      {/* Background stars */}
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration} infinite`
            }}
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
          <div className="notifications">
            <div className="notification-icon">
              <span className="notification-badge">3</span>
              <i className="far fa-bell"></i>
            </div>
          </div>
          <div className="user-avatar">
            JD
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
                <button className="profile-action-btn download-btn">
                  <i className="fas fa-download"></i>
                  Télécharger CV
                </button>
                <button className="profile-action-btn share-btn">
                  <i className="fas fa-share-alt"></i>
                  Partager
                </button>
                <button className="profile-action-btn preview-btn">
                  <i className="fas fa-eye"></i>
                  Aperçu public
                </button>
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

            {/* Contenu du profil */}
            <div className="profile-content">
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
                      <div className="edit-actions">
                        <button className="cancel-btn" onClick={() => setMode('visualisation')}>
                          Annuler
                        </button>
                        <button className="save-btn" onClick={handleSubmit}>
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {mode === 'visualisation' ? (
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Prénom</span>
                        <span className="info-value">{infoPerso.prenom}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Nom</span>
                        <span className="info-value">{infoPerso.nom}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Poste actuel</span>
                        <span className="info-value">{infoPerso.poste}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{infoPerso.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Téléphone</span>
                        <span className="info-value">{infoPerso.telephone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Localisation</span>
                        <span className="info-value">{infoPerso.localisation}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Disponibilité</span>
                        <span className="info-value">{infoPerso.disponibilite}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Site web</span>
                        <span className="info-value">{infoPerso.siteWeb}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">LinkedIn</span>
                        <span className="info-value">{infoPerso.linkedin}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">GitHub</span>
                        <span className="info-value">{infoPerso.github}</span>
                      </div>
                    </div>
                  ) : (
                    <form className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Prénom</label>
                          <input
                            type="text"
                            value={infoPerso.prenom}
                            onChange={(e) => setInfoPerso({ ...infoPerso, prenom: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Nom</label>
                          <input
                            type="text"
                            value={infoPerso.nom}
                            onChange={(e) => setInfoPerso({ ...infoPerso, nom: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Poste actuel</label>
                        <input
                          type="text"
                          value={infoPerso.poste}
                          onChange={(e) => setInfoPerso({ ...infoPerso, poste: e.target.value })}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={infoPerso.email}
                            onChange={(e) => setInfoPerso({ ...infoPerso, email: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Téléphone</label>
                          <input
                            type="tel"
                            value={infoPerso.telephone}
                            onChange={(e) => setInfoPerso({ ...infoPerso, telephone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Localisation</label>
                          <input
                            type="text"
                            value={infoPerso.localisation}
                            onChange={(e) => setInfoPerso({ ...infoPerso, localisation: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Disponibilité</label>
                          <select
                            value={infoPerso.disponibilite}
                            onChange={(e) => setInfoPerso({ ...infoPerso, disponibilite: e.target.value })}
                          >
                            <option value="Immédiate">Immédiate</option>
                            <option value="Sous 1 mois">Sous 1 mois</option>
                            <option value="Sous 3 mois">Sous 3 mois</option>
                            <option value="Non disponible">Non disponible</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Site web</label>
                          <input
                            type="url"
                            value={infoPerso.siteWeb}
                            onChange={(e) => setInfoPerso({ ...infoPerso, siteWeb: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>LinkedIn</label>
                          <input
                            type="url"
                            value={infoPerso.linkedin}
                            onChange={(e) => setInfoPerso({ ...infoPerso, linkedin: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>GitHub</label>
                        <input
                          type="url"
                          value={infoPerso.github}
                          onChange={(e) => setInfoPerso({ ...infoPerso, github: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Photo de profil</label>
                        <div className="photo-upload">
                          <input type="file" id="photo-upload" className="hidden-input" />
                          <label htmlFor="photo-upload" className="upload-btn">
                            <i className="fas fa-upload"></i>
                            Choisir une photo
                          </label>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Section Expériences */}
              {activeSection === 'experiences' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Expériences professionnelles</h2>
                    <button className="add-btn">
                      <i className="fas fa-plus"></i>
                      Ajouter une expérience
                    </button>
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

              {/* Section Formations */}
              {activeSection === 'formations' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Formations</h2>
                    <button className="add-btn">
                      <i className="fas fa-plus"></i>
                      Ajouter une formation
                    </button>
                  </div>
                  
                  <div className="formations-list">
                    {formations.map((formation) => (
                      <div key={formation.id} className="formation-item">
                        <div className="formation-header">
                          <div className="formation-period">
                            {formatDate(formation.dateDebut)} - {formatDate(formation.dateFin)}
                          </div>
                          <div className="formation-actions">
                            <button className="action-icon edit-icon">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="action-icon delete-icon">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="formation-content">
                          <h3 className="formation-diplome">{formation.diplome}</h3>
                          <p className="formation-etablissement">{formation.etablissement} - {formation.localisation}</p>
                          <p className="formation-description">{formation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Compétences */}
              {activeSection === 'competences' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Compétences techniques</h2>
                    <button className="add-btn">
                      <i className="fas fa-plus"></i>
                      Ajouter une compétence
                    </button>
                  </div>
                  
                  <div className="competences-grid">
                    {competences.map((competence) => (
                      <div key={competence.id} className="competence-item">
                        <div className="competence-header">
                          <h3 className="competence-nom">{competence.nom}</h3>
                          <div className="competence-actions">
                            <button className="action-icon edit-icon">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="action-icon delete-icon">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="competence-niveau">
                          <div className="niveau-bar">
                            <div 
                              className="niveau-progress" 
                              style={{ width: `${competence.niveau}%` }}
                            ></div>
                          </div>
                          <span className="niveau-value">{competence.niveau}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Langues */}
              {activeSection === 'langues' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">Langues</h2>
                    <button className="add-btn">
                      <i className="fas fa-plus"></i>
                      Ajouter une langue
                    </button>
                  </div>
                  
                  <div className="langues-list">
                    {langues.map((langue) => (
                      <div key={langue.id} className="langue-item">
                        <h3 className="langue-nom">{langue.nom}</h3>
                        <span className="langue-niveau">{langue.niveau}</span>
                        <div className="langue-actions">
                          <button className="action-icon edit-icon">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="action-icon delete-icon">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonProfil;