import React from 'react';
import Navbar from '../components/Navbar';
import './AllCompaniesPage2.css';

const companies = [
  {
    id: 1,
    name: "Eklo Hotels",
    sector: "Hôtellerie, Loisirs, Tourisme",
    location: "Bordeaux, Clermont-Ferrand, Le Havre",
    employees: "Entre 250 et 2000 salariés",
    offers: 8,
    logo: "https://via.placeholder.com/80x80?text=E",
  },
  {
    id: 2,
    name: "Koncrete",
    sector: "Bâtiment / Travaux publics, Environnement",
    location: "Paris",
    employees: "< 15 salariés",
    offers: 8,
    logo: "https://via.placeholder.com/80x80?text=K",
  },
  {
    id: 3,
    name: "SNCF RETAIL & CONNEXIONS",
    sector: "Immobilier commercial",
    location: "Paris",
    employees: "Entre 50 et 250 salariés",
    offers: 6,
    logo: "https://via.placeholder.com/80x80?text=SNCF",
    description: "Retail & Connexions est la filiale du groupe SNCF chargée de développer le commerce en gare...",
  },
  {
    id: 4,
    name: "Circle Mobility",
    sector: "Automobile, Logiciels, Mobilité",
    location: "Paris",
    employees: "Entre 15 et 50 salariés",
    offers: 4,
    logo: "https://via.placeholder.com/80x80?text=C",
  },
  // Ajoute d'autres entreprises fictives ici
];

const AllCompaniesPage2 = () => {
  return (
    <div className="all-companies-bg">
      <Navbar />
      <div className="all-companies-container">
        <h1 className="all-companies-title">4 319 entreprises à découvrir</h1>
        <div className="all-companies-grid">
          {companies.map(company => (
            <div key={company.id} className="all-company-card">
              <div className="all-company-logo">
                <img src={company.logo} alt={company.name} />
              </div>
              <div className="all-company-info">
                <div className="all-company-name">{company.name}</div>
                <div className="all-company-sector">{company.sector}</div>
                <div className="all-company-location">{company.location}</div>
                <div className="all-company-employees">{company.employees}</div>
                {company.description && (
                  <div className="all-company-description">{company.description}</div>
                )}
              </div>
              <div className="all-company-footer">
                <span className="all-company-offers">{company.offers} offres</span>
                <button className="all-follow-btn">Suivre</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCompaniesPage2;