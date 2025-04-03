import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">TM</div>
        TalentMatch
      </Link>
      <div className="nav-links">
        <Link to="/entreprises" className="nav-link">Entreprises</Link>
        <Link to="/offres" className="nav-link">Offres</Link>
        <Link to="/candidats" className="nav-link">Candidats</Link>
        <Link to="/conseils" className="nav-link">Conseils</Link>
      </div>
    </nav>
  );
};

export default Navbar;