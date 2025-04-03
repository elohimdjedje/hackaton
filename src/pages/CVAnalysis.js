import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const CVAnalysis = () => {
  const navigate = useNavigate();
  const { completeProfile } = useAuth();
  const [stars, setStars] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
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

  // Simuler l'analyse du CV lorsqu'un fichier est téléchargé
  useEffect(() => {
    if (uploadedFile && analyzing) {
      // Simuler la progression de l'analyse
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      // Simuler la fin de l'analyse après 5 secondes
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisComplete(true);
        clearInterval(interval);
        setAnalysisProgress(100);
        
        // Simuler des compétences extraites du CV
        setExtractedSkills([
          { id: 1, name: 'React', level: 90 },
          { id: 2, name: 'JavaScript', level: 85 },
          { id: 3, name: 'Node.js', level: 80 },
          { id: 4, name: 'HTML/CSS', level: 95 },
          { id: 5, name: 'MongoDB', level: 75 },
          { id: 6, name: 'Git', level: 85 },
        ]);
        
        // Simuler des offres d'emploi correspondantes
        setMatchingJobs([
          {
            id: 1,
            titre: 'Développeur Full Stack React/Node',
            entreprise: 'TechVision',
            localisation: 'Paris, France',
            matching: 92
          },
          {
            id: 2,
            titre: 'Développeur Frontend React',
            entreprise: 'StartupInno',
            localisation: 'Lyon, France',
            matching: 88
          },
          {
            id: 3,
            titre: 'Lead Developer JavaScript',
            entreprise: 'DigitalSoft',
            localisation: 'Marseille, France',
            matching: 85
          }
        ]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [uploadedFile, analyzing]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAnalyzing(true);
    }
  };

  const handleConfirm = () => {
    // Simuler la sauvegarde des données de profil
    completeProfile({
      skills: extractedSkills,
      profileCompleted: true
    });
    
    // Rediriger vers le tableau de bord candidat
    navigate('/candidate-dashboard');
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
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

      {/* Main content */}
      <div className="cv-analysis-container">
        <div className="cv-analysis-card">
          <h2>Analyse de votre CV</h2>
          
          {!uploadedFile && !analyzing && !analysisComplete && (
            <div className="upload-section">
              <p className="upload-description">
                Téléchargez votre CV pour que notre IA puisse extraire vos compétences 
                et vous proposer des offres correspondant à votre profil.
              </p>
              
              <div className="upload-box">
                <input 
                  type="file" 
                  id="cv-upload" 
                  className="hidden-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <label htmlFor="cv-upload" className="upload-btn">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Télécharger votre CV</span>
                </label>
                <p className="upload-formats">Formats acceptés: PDF, DOC, DOCX</p>
              </div>
              
              <div className="alternative-options">
                <p>Ou utilisez ces alternatives:</p>
                <div className="options-buttons">
                  <button className="option-btn linkedin-btn" onClick={() => navigate('/linkedin-callback')}>
                    <i className="fab fa-linkedin"></i>
                    <span>Importer depuis LinkedIn</span>
                  </button>
                  <button className="option-btn manual-btn" onClick={() => navigate('/mon-profil')}>
                    <i className="fas fa-edit"></i>
                    <span>Remplir manuellement</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {analyzing && (
            <div className="analysis-progress">
              <h3>Analyse en cours...</h3>
              
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${analysisProgress}%` }}></div>
              </div>
              
              <div className="analysis-details">
                <p className="analysis-step">
                  {analysisProgress < 30 && "Extraction des données du CV..."}
                  {analysisProgress >= 30 && analysisProgress < 60 && "Identification des compétences..."}
                  {analysisProgress >= 60 && analysisProgress < 90 && "Recherche d'offres correspondantes..."}
                  {analysisProgress >= 90 && "Finalisation de l'analyse..."}
                </p>
                <p className="analysis-percentage">{analysisProgress}%</p>
              </div>
            </div>
          )}
          
          {analysisComplete && (
            <div className="analysis-results">
              <div className="analysis-success">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Analyse complétée avec succès!</h3>
              </div>
              
              <div className="skills-section">
                <h4>Compétences identifiées</h4>
                <div className="skills-grid">
                  {extractedSkills.map(skill => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="matching-jobs-section">
                <h4>Offres d'emploi correspondantes</h4>
                <div className="matching-jobs-list">
                  {matchingJobs.map(job => (
                    <div key={job.id} className="matching-job-item">
                      <div className="job-info">
                        <h5 className="job-title">{job.titre}</h5>
                        <p className="job-company">{job.entreprise}</p>
                        <p className="job-location">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{job.localisation}</span>
                        </p>
                      </div>
                      <div className="job-matching">
                        <div className="matching-badge">{job.matching}%</div>
                        <span>Matching</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analysis-actions">
                <button 
                  className="action-btn modify-btn"
                  onClick={() => {
                    setAnalysisComplete(false);
                    setUploadedFile(null);
                  }}
                >
                  <i className="fas fa-redo"></i>
                  <span>Recommencer</span>
                </button>
                <button 
                  className="action-btn confirm-btn"
                  onClick={handleConfirm}
                >
                  <i className="fas fa-check"></i>
                  <span>Confirmer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalysis;