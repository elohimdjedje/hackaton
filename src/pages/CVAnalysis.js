import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/apiService'; // Importez votre service d'offres d'emploi
import Navbar from '../components/Navbar';
import '../styles/CVAnalysis.css'; // Importez le fichier CSS

// Fonction utilitaire pour extraire les compétences d'un fichier CV
const extractSkillsFromCV = (fileContent) => {
  // Liste de compétences courantes à rechercher dans le CV
  const commonSkills = [
    { id: 1, name: 'JavaScript', level: 85 },
    { id: 2, name: 'React', level: 80 },
    { id: 3, name: 'HTML/CSS', level: 90 },
    { id: 4, name: 'Node.js', level: 75 },
    { id: 5, name: 'Python', level: 70 },
    { id: 6, name: 'Java', level: 65 },
    { id: 7, name: 'SQL', level: 80 },
    { id: 8, name: 'Git', level: 85 },
    { id: 9, name: 'Docker', level: 60 },
    { id: 10, name: 'AWS', level: 65 }
  ];
  
  // Dans une implémentation réelle, vous analyseriez le texte du CV
  // pour extraire les compétences mentionnées
  // Pour cet exemple, nous renvoyons quelques compétences aléatoires
  return commonSkills.filter(() => Math.random() > 0.5);
};

// Fonction pour calculer le taux de matching entre un CV et une offre
const calculateMatchingScore = (cvSkills, job) => {
  // Si pas de compétences extraites, retourner un score par défaut
  if (!cvSkills || cvSkills.length === 0) return Math.floor(Math.random() * 30) + 50; // Score entre 50 et 80
  
  // Obtenir les noms des compétences du CV
  const cvSkillNames = cvSkills.map(skill => skill.name.toLowerCase());
  
  // Analyser la description et les exigences de l'offre
  const jobText = `${job.description || ''} ${job.profileList ? job.profileList.join(' ') : ''} ${job.missionsList ? job.missionsList.join(' ') : ''}`.toLowerCase();
  
  // Compter combien de compétences du CV correspondent à l'offre
  let matchCount = 0;
  cvSkillNames.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchCount++;
    }
  });
  
  // Calculer le score de matching avec une part d'aléatoire pour diversifier les résultats
  // Base: 50% + jusqu'à 50% selon les compétences correspondantes + facteur aléatoire de ±5%
  const baseScore = 50;
  const skillScore = Math.floor((matchCount / cvSkillNames.length) * 45);
  const randomFactor = Math.floor(Math.random() * 10) - 5;
  
  const matchingScore = Math.min(100, Math.max(40, baseScore + skillScore + randomFactor));
  
  return matchingScore;
};

// Données fictives pour les offres d'emploi (à remplacer par des données réelles)
const mockJobs = [
  {
    id: 1,
    title: "Développeur Full Stack React/Node.js",
    company: "TechInnovate",
    location: "Paris, France",
    contractType: "CDI",
    description: "Nous recherchons un développeur full stack maîtrisant React, Node.js et les bases de données SQL.",
    profileList: ["JavaScript", "React", "Node.js", "SQL", "Git"]
  },
  {
    id: 2,
    title: "Ingénieur DevOps",
    company: "CloudSolutions",
    location: "Lyon, France",
    contractType: "CDI",
    description: "Rejoignez notre équipe pour gérer notre infrastructure cloud et nos pipelines CI/CD.",
    profileList: ["Docker", "AWS", "Kubernetes", "Jenkins", "Git"]
  },
  {
    id: 3,
    title: "Développeur Frontend React",
    company: "DigitalExperience",
    location: "Bordeaux, France",
    contractType: "CDD - 12 mois",
    description: "Création d'interfaces utilisateur modernes et réactives pour nos clients.",
    profileList: ["JavaScript", "React", "HTML/CSS", "Redux"]
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataInsight",
    location: "Toulouse, France",
    contractType: "CDI",
    description: "Analyse de données et création de modèles prédictifs pour nos clients.",
    profileList: ["Python", "SQL", "Machine Learning", "Statistiques"]
  },
  {
    id: 5,
    title: "Développeur Backend Java",
    company: "EnterpriseSystem",
    location: "Nantes, France",
    contractType: "CDI",
    description: "Développement et maintenance de nos systèmes backend critiques.",
    profileList: ["Java", "Spring", "SQL", "Microservices"]
  },
  {
    id: 6,
    title: "Architecte Cloud",
    company: "InfrastructureModerne",
    location: "Lille, France",
    contractType: "Freelance",
    description: "Conception et implémentation d'architectures cloud scalables et sécurisées.",
    profileList: ["AWS", "Azure", "Docker", "Terraform"]
  }
];

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

  // Fonction pour analyser le CV et trouver des offres correspondantes
  const analyzeCV = async (file) => {
    try {
      setAnalyzing(true);
      setAnalysisProgress(0);
      
      // Simuler la progression
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Lire le contenu du fichier (dans un environnement réel, utilisez une API)
      const fileContent = await readFileAsText(file);
      
      // Extraire les compétences du CV
      const skills = extractSkillsFromCV(fileContent);
      setExtractedSkills(skills);
      
      // Dans un environnement réel, récupérer les offres depuis l'API
      // const allJobs = await jobService.getAllJobs();
      // Pour l'exemple, utiliser les données fictives
      const allJobs = mockJobs;
      
      // Calculer le score de matching pour chaque offre
      const jobsWithMatching = allJobs.map(job => ({
        id: job.id,
        titre: job.title,
        entreprise: job.company,
        localisation: job.location,
        typeContrat: job.contractType,
        description: job.description,
        matching: calculateMatchingScore(skills, job)
      }));
      
      // Trier les offres par score de matching et garder les meilleures
      const bestMatches = jobsWithMatching
        .sort((a, b) => b.matching - a.matching)
        .slice(0, 5);
      
      // Mettre à jour l'état avec les offres correspondantes
      setMatchingJobs(bestMatches);
      
      // Terminer l'analyse
      setAnalysisProgress(100);
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisComplete(true);
      }, 500);
      
      return skills;
    } catch (error) {
      console.error("Erreur lors de l'analyse du CV:", error);
      setAnalyzing(false);
      return [];
    }
  };
  
  // Fonction pour lire le contenu d'un fichier
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // Cette fonction sera appelée lors du téléchargement du CV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      analyzeCV(file);
    }
  };

  const handleConfirm = async () => {
    try {
      // Sauvegarder les résultats d'analyse dans la base de données
      const saveResponse = await fetch('http://localhost:5000/api/cv/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidatId: completeProfile.id, // Assurez-vous que cette valeur existe
          skills: extractedSkills,
          matchingJobs: matchingJobs
        })
      });
      
      if (!saveResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde des résultats');
      }
      
      // Mettre à jour le profil avec les compétences extraites
      await completeProfile({
        skills: extractedSkills,
        profileCompleted: true
      });
      
      // Rediriger vers le tableau de bord candidat
      navigate('/candidate-dashboard');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
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
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                />
                <label htmlFor="cv-upload" className="upload-btn">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Télécharger votre CV</span>
                </label>
                <p className="upload-formats">Formats acceptés: PDF, DOC, DOCX, TXT</p>
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
                  {matchingJobs.length > 0 ? (
                    matchingJobs.map(job => (
                      <div key={job.id} className="matching-job-item">
                        <div className="job-info">
                          <h5 className="job-title">{job.titre}</h5>
                          <p className="job-company">{job.entreprise}</p>
                          <div className="job-details">
                            <p className="job-location">
                              <i className="fas fa-map-marker-alt"></i>
                              <span>{job.localisation}</span>
                            </p>
                            <p className="job-contract">
                              <i className="fas fa-file-contract"></i>
                              <span>{job.typeContrat}</span>
                            </p>
                          </div>
                          <p className="job-description">{job.description}</p>
                        </div>
                        <div className="job-matching">
                          <div className="matching-badge">{job.matching}%</div>
                          <span>Matching</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucune offre correspondante trouvée.</p>
                  )}
                </div>
              </div>
              
              <div className="analysis-actions">
                <div className="action-buttons-container">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalysis;