import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [stars, setStars] = useState([]);

  // Données du tableau de bord (à remplacer par des données réelles de votre API)
  const dashboardData = {
    activeJobs: {
      count: 8,
      change: 2,
      period: 'cette semaine'
    },
    applications: {
      count: 42,
      change: 7,
      period: 'aujourd\'hui'
    },
    matchingRate: {
      value: 85,
      change: 3,
      period: 'ce mois'
    },
    unreadMessages: {
      count: 5,
      change: 2,
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
              <span className="notification-badge">1</span>
              <i className="far fa-bell"></i>
            </div>
          </div>
          <div className="user-profile" onClick={handleLogout}>
            <div className="user-avatar">MD</div>
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
                <Link to="/recruiter-dashboard">
                  <i className="sidebar-icon fas fa-chart-bar"></i>
                  <span>Tableau de bord</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'jobs' ? 'active' : ''}`} onClick={() => setActiveMenuItem('jobs')}>
                <Link to="/new-job-offer">
                  <i className="sidebar-icon fas fa-briefcase"></i>
                  <span>Gérer mes offres</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'candidates' ? 'active' : ''}`} onClick={() => setActiveMenuItem('candidates')}>
                <Link to="/applications-management">
                  <i className="sidebar-icon fas fa-users"></i>
                  <span>Candidatures</span>
                </Link>
              </li>
              <li className={`sidebar-item ${activeMenuItem === 'interviews' ? 'active' : ''}`} onClick={() => setActiveMenuItem('interviews')}>
                <Link to="/interview-calendar">
                  <i className="sidebar-icon fas fa-calendar-alt"></i>
                  <span>Entretiens</span>
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
            <h3 className="sidebar-heading">OUTILS</h3>
            <ul className="sidebar-menu">
              <li className={`sidebar-item ${activeMenuItem === 'stats' ? 'active' : ''}`} onClick={() => setActiveMenuItem('stats')}>
                <i className="sidebar-icon fas fa-chart-line"></i>
                <span>Statistiques</span>
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
              <button className="action-btn reports-btn">
                <i className="fas fa-chart-bar"></i>
                Rapports
              </button>
              <Link to="/new-job-offer" className="action-btn new-job-btn">
                <i className="fas fa-plus"></i>
                Nouvelle offre
              </Link>
            </div>
          </div>

          {/* Dashboard cards */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Offres actives</h3>
                <div className="card-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.activeJobs.count}</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.activeJobs.change} {dashboardData.activeJobs.period}
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Candidatures</h3>
                <div className="card-icon">
                  <i className="fas fa-users"></i>
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
                <h3 className="card-title">Messages non lus</h3>
                <div className="card-icon">
                  <i className="fas fa-comment-alt"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-value">{dashboardData.unreadMessages.count}</div>
                <div className="card-change positive">
                  <i className="fas fa-arrow-up"></i> {dashboardData.unreadMessages.change} {dashboardData.unreadMessages.period}
                </div>
              </div>
            </div>
          </div>

          {/* Recent job offers */}
          <div className="recent-jobs-section">
            <h2 className="section-title">Offres récentes</h2>
            <div className="recent-jobs-list">
              {/* Ajoutez ici vos offres récentes */}
              <div className="no-jobs-message">
                Aucune offre récente à afficher pour le moment. 
                <br />
                <Link to="/new-job-offer" className="action-btn new-job-btn" style={{marginTop: '1rem'}}>
                  <i className="fas fa-plus"></i>
                  Créer une offre
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;