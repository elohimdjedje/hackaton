import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [stars, setStars] = useState([]);

  // Données du tableau de bord (à remplacer par des données réelles de votre API)
  const dashboardData = {
    applications: {
      count: 12,
      change: 3,
      period: 'cette semaine'
    },
    interviews: {
      count: 4,
      change: 1,
      period: 'à venir'
    },
    matchingRate: {
      value: 78,
      change: 5,
      period: 'ce mois'
    },
    savedJobs: {
      count: 15,
      change: 7,
      period: 'nouveaux'
    }
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
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
          <div className="user-profile" onClick={handleLogout}>
            <div className="user-avatar">JD</div>
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
              <li className={`sidebar-item ${activeMenuItem === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenuItem('dashboard')}>
                <Link to="/candidate-dashboard">
                  <i className="sidebar-icon fas fa-chart-bar"></i>
                  <span>Tableau de bord</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'jobs' ? 'active' : ''}`} onClick={() => setActiveMenuItem('jobs')}>
                <Link to="/offres-emploi">
                  <i className="sidebar-icon fas fa-briefcase"></i>
                  <span>Offres d'emploi</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'applications' ? 'active' : ''}`} onClick={() => setActiveMenuItem('applications')}>
                <Link to="/mes-candidatures">
                  <i className="sidebar-icon fas fa-file-alt"></i>
                  <span>Mes candidatures</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'messages' ? 'active' : ''}`} onClick={() => setActiveMenuItem('messages')}>
                <Link to="/messages">
                  <i className="sidebar-icon fas fa-comment-alt"></i>
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">PROFIL</h3>
            <ul className="sidebar-menu">
              <li className={`sidebar-item ${activeMenuItem === 'profile' ? 'active' : ''}`} onClick={() => setActiveMenuItem('profile')}>
                <Link to="/mon-profil">
                  <i className="sidebar-icon fas fa-user"></i>
                  <span>Mon profil</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'settings' ? 'active' : ''}`} onClick={() => setActiveMenuItem('settings')}>
                <i className="sidebar-icon fas fa-cog"></i>
                <span>Paramètres</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main dashboard */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Tableau de bord</h1>
            <div className="dashboard-actions">
              <Link to="/offres-emploi" className="action-btn new-job-btn">
                <i className="fas fa-search"></i>
                Rechercher des offres
              </Link>
            </div>
          </div>

          {/* Dashboard cards */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Mes candidatures</h3>
                <div className="card-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.applications.count}</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.applications.change} {dashboardData.applications.period}
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Entretiens</h3>
                <div className="card-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.interviews.count}</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.interviews.change} {dashboardData.interviews.period}
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Taux de matching</h3>
                <div className="card-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.matchingRate.value}%</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.matchingRate.change}% {dashboardData.matchingRate.period}
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Offres enregistrées</h3>
                <div className="card-icon">
                  <i className="fas fa-bookmark"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.savedJobs.count}</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.savedJobs.change} {dashboardData.savedJobs.period}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended jobs */}
          <div className="recent-jobs-section">
            <h2 className="section-title">Offres recommandées</h2>
            <div className="recent-jobs-list">
              {/* Ajoutez ici vos offres recommandées */}
              <div className="no-jobs-message">
                Aucune offre recommandée à afficher pour le moment. Complétez votre profil pour recevoir des recommandations personnalisées.
                <br />
                <Link to="/cv-analysis" className="action-btn new-job-btn" style={{marginTop: '1rem'}}>
                  <i className="fas fa-upload"></i>
                  Télécharger mon CV
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;