import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/apiService';
import '../jobdetail.css';

const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  
  // État pour suivre la position de défilement
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Utilisation du service API pour récupérer les offres d'emploi
        const data = await jobService.getTrendingJobs();
        setJobs(data.jobs);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des offres d\'emploi:', err);
        setError('Impossible de charger les offres d\'emploi');
        setLoading(false);
        
        // Données de démonstration à utiliser en cas d'erreur ou pendant le développement
        setJobs([
          {
            id: 1,
            title: 'Magasinier H/F',
            company: 'BUT',
            companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Logo_BUT.svg/1200px-Logo_BUT.svg.png',
            location: 'Dreux - 28',
            contractType: 'CDI',
            postedDate: new Date(Date.now() - 17 * 60 * 60 * 1000), // il y a 17 heures
            matchingRate: 85,
            color: '#ff6b6b'
          },
          {
            id: 2,
            title: 'UX/UI Designer',
            company: 'DesignStudio',
            companyLogo: 'https://example.com/designstudio-logo.png', // Ajout d'une URL pour le logo
            location: 'Lyon',
            contractType: 'CDI',
            postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // il y a 2 jours
            matchingRate: 80,
            color: '#4cd137'
          },
          {
            id: 3,
            title: 'Data Scientist',
            company: 'DataCorp',
            companyLogo: 'https://example.com/datacorp-logo.png', // Ajout d'une URL pour le logo
            location: 'Remote',
            contractType: 'CDI',
            postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // il y a 5 jours
            matchingRate: 82,
            color: '#3498db'
          }
        ]);
      }
    };

    fetchJobs();
  }, []);

  // Fonction pour formater la date relative
  const getRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  // Fonctions pour le défilement du carrousel
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = 350; // Augmenté pour un défilement plus significatif
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = 350; // Augmenté pour un défilement plus significatif
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Surveiller le défilement pour afficher/masquer les flèches
  const handleScroll = () => {
    if (carouselRef.current) {
      const position = carouselRef.current.scrollLeft;
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      
      setScrollPosition(position);
      setShowLeftArrow(position > 0);
      setShowRightArrow(position < maxScroll - 10);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Vérifier si le défilement est nécessaire
      handleScroll();
      
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [jobs]);

  if (loading && jobs.length === 0) {
    return (
      <section className="featured-jobs-section">
        <div className="section-header">
          <h2 className="section-title">Offres en vedette</h2>
          <p className="section-subtitle">Découvrez les offres avec le meilleur matching IA</p>
        </div>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des offres d'emploi...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-jobs-section">
      <div className="section-header">
        <h2 className="section-title">Offres en vedette</h2>
        <p className="section-subtitle">Découvrez les offres avec le meilleur matching IA</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="jobs-carousel-container">
        {/* Toujours afficher la flèche gauche, mais la désactiver si nécessaire */}
        <button 
          className={`carousel-arrow carousel-arrow-left ${!showLeftArrow ? 'disabled' : ''}`} 
          onClick={scrollLeft}
          style={{ opacity: showLeftArrow ? 0.8 : 0.3, pointerEvents: showLeftArrow ? 'auto' : 'none' }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="jobs-carousel" ref={carouselRef}>
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-logo-container">
                {job.companyLogo ? (
                  <div className="job-logo">
                    <img src={job.companyLogo} alt={job.company} onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = job.company.substring(0, 2).toUpperCase();
                    }} />
                  </div>
                ) : (
                  <div className="job-logo">
                    <div className="placeholder-logo">
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                
                <div className="job-meta">
                  <span className="job-location">{job.location}</span>
                  <span className="job-contract">{job.contractType}</span>
                  <span className="job-posted">{getRelativeTime(job.postedDate)}</span>
                </div>
              </div>
              
              <div className="job-actions">
                <Link to={`/offres-emploi/${job.id}`} className="view-offer-btn">
                  Voir l'offre
                </Link>
                <button className="favorite-btn">
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Toujours afficher la flèche droite, mais la désactiver si nécessaire */}
        <button 
          className={`carousel-arrow carousel-arrow-right ${!showRightArrow ? 'disabled' : ''}`} 
          onClick={scrollRight}
          style={{ opacity: showRightArrow ? 0.8 : 0.3, pointerEvents: showRightArrow ? 'auto' : 'none' }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="view-all-container">
        <Link to="/offres-emploi" className="view-all-link">
          Voir toutes les offres
        </Link>
      </div>
    </section>
  );
};

export default JobSection;