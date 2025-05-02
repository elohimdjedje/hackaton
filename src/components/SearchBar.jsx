import React, { useState, useRef, useEffect } from 'react';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [whatQuery, setWhatQuery] = useState('');
  const [whereQuery, setWhereQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const filterMenuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recherche:', { what: whatQuery, where: whereQuery });
    // window.location.href = `/recherche?what=${encodeURIComponent(whatQuery)}&where=${encodeURIComponent(whereQuery)}`;
  };

  const toggleFilter = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-inputs">
          <div className="search-input-group">
            <label htmlFor="what-input">QUOI ?</label>
            <input
              id="what-input"
              type="text"
              placeholder="Métier, entreprise, compétence"
              value={whatQuery}
              onChange={(e) => setWhatQuery(e.target.value)}
            />
          </div>
          <div className="search-input-group">
            <label htmlFor="where-input">OÙ ?</label>
            <input
              id="where-input"
              type="text"
              placeholder="Ville, département, code postal"
              value={whereQuery}
              onChange={(e) => setWhereQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>

      <div className="filter-bar" ref={filterMenuRef}>
        <div className="filter-buttons-wrapper">
          <button 
            className={`filter-main-button ${activeFilter === 'main' ? 'active' : ''}`}
            onClick={() => toggleFilter('main')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Filtres</span>
          </button>
          
          <button 
            className={`filter-button ${activeFilter === 'contrats' ? 'active' : ''}`}
            onClick={() => toggleFilter('contrats')}
          >
            <span>Contrats</span>
            <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <button 
            className={`filter-button salary-button ${activeFilter === 'salaire' ? 'active' : ''}`}
            onClick={() => toggleFilter('salaire')}
          >
            <span>Salaire</span>
            <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <button 
            className={`filter-button recruiter-button ${activeFilter === 'recruteur' ? 'active' : ''}`}
            onClick={() => toggleFilter('recruteur')}
          >
            <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
            </svg>
            <span>Super recruteur</span>
          </button>
        </div>
        
        <button className="alert-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>Créer mon alerte</span>
        </button>
        
        {activeFilter === 'main' && (
          <div className="filter-dropdown main-dropdown">
            <div className="dropdown-header">
              <h3>Filtres</h3>
              <button className="close-dropdown" onClick={() => setActiveFilter(null)}>×</button>
            </div>
            <div className="dropdown-content">
              <div className="filter-section">
                <h4>Type de contrat</h4>
                <div className="contract-options">
                  <button className="contract-option">CDI</button>
                  <button className="contract-option">CDD</button>
                  <button className="contract-option">Intérim</button>
                  <button className="contract-option">Stage</button>
                  <button className="contract-option">Alternance</button>
                  <button className="contract-option">Freelance</button>
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Salaire minimum</h4>
                <div className="salary-toggle">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <span>Afficher uniquement les offres avec un salaire</span>
                </div>
                <div className="salary-slider">
                  <input type="range" min="0" max="100" defaultValue="50" />
                  <div className="salary-value">30 000 € / an</div>
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Super recruteur</h4>
                <div className="recruiter-toggle">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <span>Afficher uniquement les offres Super recruteur</span>
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Date de publication</h4>
                <div className="date-options">
                  <button className="date-option active">Toutes</button>
                  <button className="date-option">Depuis 24h</button>
                  <button className="date-option">Depuis 3 jours</button>
                  <button className="date-option">Depuis 1 semaine</button>
                </div>
              </div>
            </div>
            <div className="dropdown-footer">
              <button className="reset-button">Tout effacer</button>
              <button className="apply-button">Appliquer</button>
            </div>
          </div>
        )}
        
        {activeFilter === 'contrats' && (
          <div className="filter-dropdown contracts-dropdown">
            <div className="dropdown-header">
              <h3>Type de contrat</h3>
              <button className="close-dropdown" onClick={() => setActiveFilter(null)}>×</button>
            </div>
            <div className="dropdown-content">
              <div className="contract-options">
                <button className="contract-option">CDI</button>
                <button className="contract-option">CDD</button>
                <button className="contract-option">Intérim</button>
                <button className="contract-option">Stage</button>
                <button className="contract-option">Alternance</button>
                <button className="contract-option">Freelance</button>
                <button className="contract-option">Indépendant</button>
                <button className="contract-option">Franchise</button>
                <button className="contract-option">Associé</button>
                <button className="contract-option">Fonctionnaire</button>
              </div>
            </div>
            <div className="dropdown-footer">
              <button className="reset-button">Réinitialiser</button>
              <button className="apply-button">Appliquer</button>
            </div>
          </div>
        )}
        
        {activeFilter === 'salaire' && (
          <div className="filter-dropdown salary-dropdown">
            <div className="dropdown-header">
              <h3>Salaire minimum</h3>
              <button className="close-dropdown" onClick={() => setActiveFilter(null)}>×</button>
            </div>
            <div className="dropdown-content">
              <div className="salary-toggle">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
                <span>Afficher uniquement les offres avec un salaire</span>
              </div>
              <div className="salary-options">
                <div className="salary-option-group">
                  <label>Annuel</label>
                  <div className="salary-input">21000 €</div>
                </div>
                <div className="salary-option-group">
                  <label>Mensuel</label>
                  <div className="salary-input">1750 €</div>
                </div>
                <div className="salary-option-group">
                  <label>Horaire</label>
                  <div className="salary-input">11,54 €</div>
                </div>
              </div>
              <div className="salary-info">Estimation salaire brut 35h/sem.</div>
              <div className="salary-slider">
                <input type="range" min="0" max="100" defaultValue="50" />
              </div>
            </div>
            <div className="dropdown-footer">
              <button className="reset-button">Réinitialiser</button>
              <button className="apply-button">Appliquer</button>
            </div>
          </div>
        )}
        
        {activeFilter === 'recruteur' && (
          <div className="filter-dropdown recruiter-dropdown">
            <div className="dropdown-header">
              <h3>Super recruteur</h3>
              <button className="close-dropdown" onClick={() => setActiveFilter(null)}>×</button>
            </div>
            <div className="dropdown-content">
              <div className="recruiter-toggle">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
                <span>Afficher uniquement les offres Super recruteur</span>
              </div>
              <p className="recruiter-info">
                Le badge Super recruteur atteste que les entreprises s'engagent avec HelloWork sur la transparence et la communication auprès des candidats. Les entreprises ne paient pas pour ce badge.
              </p>
              <a href="#" className="learn-more">En savoir plus</a>
            </div>
            <div className="dropdown-footer">
              <button className="reset-button">Réinitialiser</button>
              <button className="apply-button">Appliquer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;