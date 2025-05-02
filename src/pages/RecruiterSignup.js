import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const RecruiterSignup = () => {
  const navigate = useNavigate();
  const { signupRecruiter } = useAuth();
  const [activeTab, setActiveTab] = useState('recruteur');
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    companySize: '',
    website: '',
    fullName: '',
    position: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    termsAccepted: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [stars, setStars] = useState([]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Réinitialiser l'erreur de mot de passe lors de la modification des champs
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    // Validation du formulaire
    if (!formData.companyName || !formData.fullName || !formData.email) {
      setPasswordError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    if (formData.password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (!formData.termsAccepted) {
      setPasswordError('Vous devez accepter les conditions générales');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation avant soumission
    if (!validateForm()) {
      return;
    }
  
    try {
      // Préparer les données du recruteur
      const recruiterData = {
        companyName: formData.companyName,
        sector: formData.sector,
        companySize: formData.companySize,
        website: formData.website,
        fullName: formData.fullName,
        position: formData.position,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        type: 'recruiter'
      };
  
      // 💾 Envoi des infos dans la BDD MySQL via ton backend
      const response = await fetch("http://localhost:3000/recruteurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom_entreprise: formData.companyName,
          secteur_activite: formData.sector,
          taille_entreprise: formData.companySize,
          site_web: formData.website,
          nom: formData.fullName,
          poste: formData.position,
          email_pro: formData.email
        })
      });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       alert("Recruteur créé avec succès ✅");
  //     } else {
  //       alert("Erreur côté serveur ❌");
  //       console.error(data);
  //     }
  //   } catch (error) {
  //     console.error("Erreur Firebase :", error);
  //     alert("Erreur lors de l'inscription ❌");
  //   }
  // };
  
  // return (

  await signupRecruiter(recruiterData);
      
      // Rediriger vers le tableau de bord recruteur
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setPasswordError('Erreur lors de la création du compte');
    }
  };

  return ( 
    <>
    <Navbar />
    
    {/* Stars background */}
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
    
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-left">
          <div className="tabs">
            <Link 
              to="/login" 
              className={`tab ${activeTab === 'connexion' ? 'active' : ''}`}
            >
              Connexion
            </Link>
            <button 
              className={`tab ${activeTab === 'recruteur' ? 'active' : ''}`}
              onClick={() => setActiveTab('recruteur')}
            >
              Recruteur
            </button>
            <Link 
              to="/candidate-signup" 
              className={`tab ${activeTab === 'candidat' ? 'active' : ''}`}
            >
              Candidat
            </Link>
          </div>
          
          <h2>Créer un compte Recruteur</h2>
          
          {passwordError && (
            <div className="login-error">
              {passwordError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Informations de l'entreprise</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom de l'entreprise *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Secteur d'activité</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez un secteur</option>
                    <option value="tech">Technologie</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Taille de l'entreprise</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez une taille</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-500">201-500 employés</option>
                    <option value="501+">501+ employés</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Site web</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Informations personnelles</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Poste</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email professionnel *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Sécurité</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Mot de passe *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmer le mot de passe *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                <label htmlFor="termsAccepted">
                  J'accepte les <a href="/terms">conditions générales</a> et la <a href="/privacy">politique de confidentialité</a>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="signup-btn"
              disabled={!formData.termsAccepted}
            >
              Créer mon compte
            </button>
          </form>
        </div>
        
        <div className="signup-right">
          <h2>Avantages Recruteur</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Matching IA de précision</h4>
                <p>Notre algorithme trouve les meilleurs candidats pour vos postes.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Gain de temps considérable</h4>
                <p>Réduisez votre temps de recrutement de 60% en moyenne.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Filtrage intelligent des candidats</h4>
                <p>Des profils classés en fonction des compétences requises.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Gestion complète des entretiens</h4>
                <p>Planifiez et suivez facilement vos rendez-vous.</p>
              </div>
            </div>
          </div>
          
          <div className="matching-rate">
            <span className="rate-value">95%</span>
            <p className="rate-description">de satisfaction des recruteurs utilisant notre plateforme</p>
          </div>
          
          {/* Bouton "Voir démo" supprimé */}
        </div>
      </div>
    </div>
  </>
);
};

export default RecruiterSignup;