import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="wttj-search-container">
      <div className="wttj-left-section">
        <div className="wttj-logo">
          <span className="tm-logo">TM</span>
          <span className="tm-text">TalentMatch</span>
        </div>
        <div className="wttj-nav-links">
          <Link to="/offres-emploi" className="wttj-nav-link">Trouver un job</Link>
          <Link to="/entreprises2" className="wttj-nav-link">Trouver une entreprise</Link>
        </div>
      </div>
      <div className="wttj-right-section">
        <Link to="/home-page" className="wttj-nav-link wttj-nav-link-button">Accueil</Link>
        <Link to="/candidate-signup" className="wttj-nav-link">Candidatures</Link>
        <Link to="/recruiter-signup" className="wttj-nav-link">Employeurs</Link>
        <Link to="/login" className="wttj-nav-link">Se connecter</Link>
      </div>
    </div>
  );
};

export default Navbar;