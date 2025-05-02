// services/apiService.js

// Résoudre l'erreur ESLint "import/no-anonymous-default-export"
const companyServiceObj = {
  // Récupère toutes les entreprises
  getAllCompanies: async () => {
    try {
      const response = await fetch('/data/companies.json');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des entreprises');
      }
      
      const companies = await response.json();
      
      // Formatage des données pour correspondre à l'interface attendue
      return {
        companies: companies.map(company => ({
          id: company.id,
          name: company.name,
          logo: company.logo,
          coverImage: company.coverImage,
          industry: company.industry,
          location: company.location,
          size: company.size
        }))
      };
    } catch (error) {
      console.error('Erreur dans le service API:', error);
      throw error;
    }
  },
  
  // Récupère une entreprise par son ID
  getCompanyById: async (id) => {
    try {
      const response = await fetch('/data/companies.json');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'entreprise');
      }
      
      const companies = await response.json();
      const company = companies.find(c => c.id.toString() === id.toString());
      
      if (!company) {
        throw new Error('Entreprise non trouvée');
      }
      
      return { company };
    } catch (error) {
      console.error('Erreur dans le service API:', error);
      throw error;
    }
  },
  
  // Récupère les entreprises mises en avant (pour la démonstration, nous prenons les 3 premières)
  getFeaturedCompanies: async () => {
    try {
      const response = await fetch('/data/companies.json');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des entreprises mises en avant');
      }
      
      const companies = await response.json();
      
      // Pour la démo, considérons les 3 premières entreprises comme "mises en avant"
      return {
        companies: companies.slice(0, 3).map(company => ({
          id: company.id,
          name: company.name,
          logo: company.logo,
          coverImage: company.coverImage,
          industry: company.industry,
          location: company.location,
          size: company.size
        }))
      };
    } catch (error) {
      console.error('Erreur dans le service API:', error);
      throw error;
    }
  }
};

// Service pour les offres d'emploi
const jobServiceObj = {
  // Récupère toutes les offres d'emploi de toutes les entreprises
  getAllJobs: async () => {
    try {
      const response = await fetch('/data/companies.json');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const companies = await response.json();
      
      // Extraire toutes les offres d'emploi des entreprises
      let allJobs = [];
      
      companies.forEach(company => {
        if (company.jobs && Array.isArray(company.jobs)) {
          // Transformer chaque offre pour la rendre compatible avec le format attendu
          const companyJobs = company.jobs.map(job => ({
            id: job.id,
            titre: job.title,
            entreprise: company.name,
            localisation: job.location,
            typeContrat: job.type || job.contract || "CDI",
            experienceRequise: "2-5 ans", // Valeur par défaut
            salaire: "Selon profil",
            secteur: company.industry,
            description: `Rejoignez ${company.name} pour ce poste de ${job.title}. Nous recherchons un profil expérimenté pour renforcer notre équipe.`,
            competences: job.skills || [],
            datePublication: job.postedDate || "2025-04-15",
            matching: job.matching || Math.floor(70 + Math.random() * 25), // Valeur entre 70 et 95
            logo: company.logo || company.name.substring(0, 2).toUpperCase()
          }));
          
          allJobs = [...allJobs, ...companyJobs];
        }
      });
      
      return allJobs;
    } catch (error) {
      console.error('Erreur dans le service des offres:', error);
      return [];
    }
  },

  // Récupère une offre d'emploi par son ID
  getJobById: async (jobId) => {
    try {
      const response = await fetch('/data/companies.json');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const companies = await response.json();
      
      // Chercher l'offre dans toutes les entreprises
      let foundJob = null;
      let foundCompany = null;
      
      for (const company of companies) {
        if (company.jobs && Array.isArray(company.jobs)) {
          const job = company.jobs.find(j => j.id.toString() === jobId.toString());
          if (job) {
            foundJob = job;
            foundCompany = company;
            break;
          }
        }
      }
      
      if (!foundJob || !foundCompany) {
        return null;
      }
      
      // Transformer l'offre au format attendu par JobDetail
      return {
        id: foundJob.id,
        title: foundJob.title,
        company: foundCompany.name,
        companyLogo: foundCompany.logo || foundCompany.name.substring(0, 2).toUpperCase(),
        location: foundJob.location,
        type: foundJob.type || foundJob.contract || "CDI",
        category: foundCompany.industry,
        experience: "3-5 ans",
        salary: foundJob.salary || "Selon profil",
        matching: foundJob.matching || Math.floor(70 + Math.random() * 25),
        postedAt: foundJob.postedDate || "2025-04-15T10:00:00",
        description: `${foundCompany.name} recherche un(e) ${foundJob.title} talentueux(se) pour rejoindre notre équipe. Vous travaillerez sur des projets innovants dans le domaine ${foundCompany.industry}.`,
        missionsList: [
          `Développer des solutions dans le domaine ${foundCompany.industry}`,
          `Collaborer avec une équipe de professionnels expérimentés`,
          `Participer à l'innovation et au développement de nouveaux produits/services`,
          `Mettre en œuvre les compétences techniques en ${foundJob.skills ? foundJob.skills.join(', ') : 'développement'}`
        ],
        profileList: [
          "3-5 ans d'expérience dans un poste similaire",
          `Maîtrise des compétences : ${foundJob.skills ? foundJob.skills.join(', ') : 'techniques requises'}`,
          "Excellente capacité d'analyse et de résolution de problèmes",
          "Capacité à travailler en équipe et à communiquer efficacement"
        ],
        benefitsList: foundCompany.benefits || [
          "Télétravail partiel",
          "Horaires flexibles",
          "Tickets restaurant",
          "Mutuelle d'entreprise",
          "Budget formation annuel"
        ],
        applicationProcess: "Après avoir postulé, vous serez contacté par notre équipe RH pour un premier entretien. Ensuite, vous aurez un entretien technique suivi d'une rencontre avec l'équipe.",
        companyDescription: foundCompany.description || `${foundCompany.name} est une entreprise innovante dans le domaine ${foundCompany.industry}.`,
        companyValues: foundCompany.values ? foundCompany.values.map(v => v.title) : ["Innovation", "Excellence", "Collaboration"],
        companySize: foundCompany.size || "50-250 employés",
        companyWebsite: foundCompany.website || `https://www.${foundCompany.name.toLowerCase().replace(/\s+/g, '')}.fr`
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre d\'emploi:', error);
      return null;
    }
  },

  // Récupère des offres similaires basées sur une offre d'emploi
  getSimilarJobs: async (job, limit = 3) => {
    try {
      const allJobs = await jobServiceObj.getAllJobs();
      
      // Filtrer les offres similaires (même industrie, pas la même offre)
      const similarJobs = allJobs
        .filter(j => 
          j.secteur === job.category && 
          j.id.toString() !== job.id.toString()
        )
        .slice(0, limit)
        .map(j => ({
          id: j.id,
          title: j.titre,
          company: j.entreprise,
          location: j.localisation,
          matching: j.matching || Math.floor(65 + Math.random() * 20) // Un peu moins bon matching que l'offre principale
        }));
        
      return similarJobs;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres similaires:', error);
      return [];
    }
  },
  
  // Récupérer les offres d'emploi correspondant à un CV
  getMatchingJobs: async (cvId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cv/${cvId}/matching-jobs`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres correspondantes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur dans jobService.getMatchingJobs:', error);
      throw error;
    }
  }
};

// Autres services que vous pourriez avoir
const userServiceObj = {
  // Méthodes pour la gestion des utilisateurs
};

// CV service
const cvServiceObj = {
  // Analyser un CV
  analyzeCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse du CV');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse du CV:', error);
      throw error;
    }
  },
  
  // Trouver les offres correspondantes
  findMatchingJobs: async (cvData) => {
    try {
      const response = await fetch('http://localhost:5000/match-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche d\'offres correspondantes');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'offres:', error);
      throw error;
    }
  }
};

// Export complet pour le job service
export const jobService = {
  getAllJobs: jobServiceObj.getAllJobs,
  getJobById: jobServiceObj.getJobById,
  getSimilarJobs: jobServiceObj.getSimilarJobs,
  getMatchingJobs: jobServiceObj.getMatchingJobs,
  // Méthode pour JobSection.js
  getTrendingJobs: async (limit = 5) => {
    try {
      // Récupérer toutes les offres
      const allJobs = await jobServiceObj.getAllJobs();
      // Simuler des offres "trending" en prenant les premières
      return { jobs: allJobs.slice(0, limit) };
    } catch (error) {
      console.error('Erreur lors de la récupération des offres tendances:', error);
      return { jobs: [] };
    }
  }
};

// Exports nommés pour les autres services
export const companyService = companyServiceObj; 
export const userService = userServiceObj;
export const cvService = cvServiceObj;