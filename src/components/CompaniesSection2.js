import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompaniesSection2.css';

const companies = [
  {
    id: 1,
    name: "Stonal",
    sector: "Intelligence artificielle",
    location: "Paris, Toulouse",
    employees: "Entre 50 et 250 salariés",
    offers: 4,
    logo: "https://via.placeholder.com/80x80?text=S",
    description: "Stonal développe des solutions d'IA pour la gestion immobilière.",
  },
  {
    id: 2,
    name: "AlphaSights",
    sector: "Accompagnement d'entreprises",
    location: "London",
    employees: "Entre 250 et 2000 salariés",
    offers: 15,
    logo: "https://via.placeholder.com/80x80?text=A",
    description: "AlphaSights connecte les entreprises avec des experts du secteur.",
  },
  // Ajoute d'autres entreprises ici...
];

const CompaniesSection2 = () => {
  const [showDescriptionId, setShowDescriptionId] = useState(null);
  const timers = useRef({});
  const navigate = useNavigate();

  const handleMouseEnter = (id) => {
    timers.current[id] = setTimeout(() => {
      setShowDescriptionId(id);
    }, 3000);
  };

  const handleMouseLeave = (id) => {
    clearTimeout(timers.current[id]);
    setShowDescriptionId(null);
  };

  return (
    <section className="companies-section2">
      <div className="companies-section2-header">
        <h2>Entreprises du moment</h2>
        <button
          className="discover-btn-tm"
          onClick={() => navigate('/entreprises2')}
        >
          Découvrir
        </button>
      </div>
      <div className="companies-carousel2">
        {companies.map(company => (
          <div
            key={company.id}
            className="company-card2"
            onMouseEnter={() => handleMouseEnter(company.id)}
            onMouseLeave={() => handleMouseLeave(company.id)}
          >
            <img src={company.logo} alt={company.name} className="company-logo2" />
            <div className="company-info2">
              <div className="company-name2">{company.name}</div>
              <div className="company-sector2">{company.sector}</div>
              <div className="company-location2">{company.location}</div>
              <div className="company-employees2">{company.employees}</div>
              <div className="company-offers2">{company.offers} offres</div>
              <button className="follow-button2">Suivre</button>
            </div>
            {showDescriptionId === company.id && (
              <div className="company-description2">
                {company.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompaniesSection2;