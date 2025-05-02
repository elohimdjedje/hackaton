import axios from 'axios';

/**
 * Module pour récupérer des données d'entreprises et d'emplois depuis des API externes
 * Cet exemple montre comment intégrer des données depuis des API de job boards populaires
 */

// Configuration des endpoints API externes (à adapter selon vos besoins)
const API_ENDPOINTS = {
  // API Indeed ou équivalent
  INDEED: {
    BASE_URL: 'https://indeed-api.example.com/api/v1',
    JOBS: '/jobs',
    COMPANIES: '/companies'
  },
  // API LinkedIn ou équivalent
  LINKEDIN: {
    BASE_URL: 'https://linkedin-api.example.com/api/v2',
    JOBS: '/job-postings',
    COMPANIES: '/organizations'
  },
  // API Welcome to the Jungle ou équivalent français
  WTTJ: {
    BASE_URL: 'https://wttj-api.example.com/api/v3',
    JOBS: '/jobs',
    COMPANIES: '/companies'
  }
};

// Configuration des clés API (à stocker dans des variables d'environnement en production)
const API_KEYS = {
  INDEED: process.env.REACT_APP_INDEED_API_KEY || 'votre_clé_indeed_ici',
  LINKEDIN: process.env.REACT_APP_LINKEDIN_API_KEY || 'votre_clé_linkedin_ici',
  WTTJ: process.env.REACT_APP_WTTJ_API_KEY || 'votre_clé_wttj_ici'
};

/**
 * Adaptateur pour uniformiser les données d'entreprises venant de différentes sources
 * @param {Object} company - Données brutes de l'entreprise
 * @param {String} source - Source des données (INDEED, LINKEDIN, WTTJ)
 * @returns {Object} Données d'entreprise au format TalentMatch
 */
const adaptCompanyData = (company, source) => {
  switch (source) {
    case 'INDEED':
      return {
        id: company.id || `indeed-${company.employer_id}`,
        name: company.name || company.employer_name,
        logo: company.logo_url || null,
        industry: company.industry || 'Non spécifié',
        location: company.headquarters_location || company.location || 'Non spécifié',
        jobsCount: company.jobs_count || 0,
        rating: company.rating || null,
        featured: company.is_featured || false,
        description: company.description || '',
        website: company.website_url || '',
        size: company.company_size || 'Non spécifié',
        source: 'Indeed'
      };
    
    case 'LINKEDIN':
      return {
        id: company.id || `linkedin-${company.organization_id}`,
        name: company.name || company.display_name,
        logo: company.logo_url || company.image_url || null,
        industry: company.industry || company.field || 'Non spécifié',
        location: company.location || company.headquarters || 'Non spécifié',
        jobsCount: company.job_posting_count || 0,
        rating: company.rating || null,
        featured: company.is_featured || false,
        description: company.description || '',
        website: company.website || '',
        size: company.employee_count_range || 'Non spécifié',
        source: 'LinkedIn'
      };
    
    case 'WTTJ':
      return {
        id: company.id || `wttj-${company.company_id}`,
        name: company.name || company.title,
        logo: company.logo || null,
        industry: company.sector || company.industry || 'Non spécifié',
        location: company.location || company.address || 'Non spécifié',
        jobsCount: company.jobs_count || 0,
        rating: company.rating || null,
        featured: company.featured || false,
        description: company.description || '',
        website: company.website || '',
        size: company.size || 'Non spécifié',
        source: 'Welcome to the Jungle'
      };
    
    default:
      return company;
  }
};

/**
 * Adaptateur pour uniformiser les données d'offres d'emploi venant de différentes sources
 * @param {Object} job - Données brutes de l'offre d'emploi
 * @param {String} source - Source des données (INDEED, LINKEDIN, WTTJ)
 * @returns {Object} Données d'offre d'emploi au format TalentMatch
 */
const adaptJobData = (job, source) => {
  switch (source) {
    case 'INDEED':
      return {
        id: job.id || `indeed-${job.job_id}`,
        title: job.title || job.job_title,
        company: job.company_name || job.employer_name,
        companyLogo: job.company_logo_url || null,
        location: job.location || 'Non spécifié',
        salary: job.salary_range || job.salary || 'Non spécifié',
        contractType: job.job_type || job.contract_type || 'Non spécifié',
        matchingRate: null, // À calculer côté TalentMatch
        remote: job.is_remote || false,
        postedDate: new Date(job.posted_date || job.date_posted || Date.now()),
        isFeatured: job.is_featured || false,
        description: job.description || '',
        requirements: job.requirements || '',
        benefits: job.benefits || '',
        source: 'Indeed'
      };
    
    case 'LINKEDIN':
      let remoteStatus = false;
      if (job.work_type === 'REMOTE' || job.remote_allowed === true) {
        remoteStatus = true;
      } else if (job.work_type === 'HYBRID') {
        remoteStatus = 'Hybride';
      }
      
      return {
        id: job.id || `linkedin-${job.job_posting_id}`,
        title: job.title || job.position_title,
        company: job.company_name || job.organization_name,
        companyLogo: job.company_logo_url || job.organization_image_url || null,
        location: job.location || 'Non spécifié',
        salary: job.salary_range || job.compensation || 'Non spécifié',
        contractType: job.employment_type || job.contract_type || 'Non spécifié',
        matchingRate: null, // À calculer côté TalentMatch
        remote: remoteStatus,
        postedDate: new Date(job.posted_date || job.listing_date || Date.now()),
        isFeatured: job.is_featured || false,
        description: job.description || '',
        requirements: job.qualifications || '',
        benefits: job.benefits || '',
        source: 'LinkedIn'
      };
    
    case 'WTTJ':
      let wttjRemoteStatus = false;
      if (job.remote_status === 'full') {
        wttjRemoteStatus = true;
      } else if (job.remote_status === 'partial') {
        wttjRemoteStatus = 'Hybride';
      }
      
      return {
        id: job.id || `wttj-${job.job_id}`,
        title: job.title || job.name,
        company: job.company_name || job.organization || '',
        companyLogo: job.company_logo || null,
        location: job.location || job.office_location || 'Non spécifié',
        salary: job.salary || 'Non spécifié',
        contractType: job.contract_type || 'Non spécifié',
        matchingRate: null, // À calculer côté TalentMatch
        remote: wttjRemoteStatus,
        postedDate: new Date(job.published_at || job.created_at || Date.now()),
        isFeatured: job.highlighted || false,
        description: job.description || '',
        requirements: job.profile || '',
        benefits: job.recruitment_process || '',
        source: 'Welcome to the Jungle'
      };
    
    default:
      return job;
  }
};

/**
 * Service pour récupérer des données depuis les API externes
 */
export const externalApiService = {
  /**
   * Récupère les entreprises mises en avant depuis plusieurs sources
   * @param {Number} limit - Nombre maximum d'entreprises à récupérer
   * @returns {Promise<Array>} Liste des entreprises adaptées au format TalentMatch
   */
  getFeaturedCompanies: async (limit = 10) => {
    try {
      // Tableau pour stocker les promesses de requêtes API
      const requests = [];
      
      // Requête API Indeed
      requests.push(
        axios.get(`${API_ENDPOINTS.INDEED.BASE_URL}${API_ENDPOINTS.INDEED.COMPANIES}/featured`, {
          params: { limit, api_key: API_KEYS.INDEED }
        }).catch(err => {
          console.warn('Erreur API Indeed (entreprises):', err.message);
          return { data: { companies: [] } };
        })
      );
      
      // Requête API LinkedIn
      requests.push(
        axios.get(`${API_ENDPOINTS.LINKEDIN.BASE_URL}${API_ENDPOINTS.LINKEDIN.COMPANIES}/featured`, {
          params: { limit, api_key: API_KEYS.LINKEDIN }
        }).catch(err => {
          console.warn('Erreur API LinkedIn (entreprises):', err.message);
          return { data: { companies: [] } };
        })
      );
      
      // Requête API Welcome to the Jungle
      requests.push(
        axios.get(`${API_ENDPOINTS.WTTJ.BASE_URL}${API_ENDPOINTS.WTTJ.COMPANIES}/featured`, {
          params: { limit, api_key: API_KEYS.WTTJ }
        }).catch(err => {
          console.warn('Erreur API WTTJ (entreprises):', err.message);
          return { data: { companies: [] } };
        })
      );
      
      // Exécuter toutes les requêtes en parallèle
      const responses = await Promise.all(requests);
      
      // Récupérer et adapter les données
      const indeedCompanies = (responses[0].data.companies || []).map(company => 
        adaptCompanyData(company, 'INDEED')
      );
      
      const linkedinCompanies = (responses[1].data.companies || []).map(company => 
        adaptCompanyData(company, 'LINKEDIN')
      );
      
      const wttjCompanies = (responses[2].data.companies || []).map(company => 
        adaptCompanyData(company, 'WTTJ')
      );
      
      // Combiner et trier les résultats
      const allCompanies = [...indeedCompanies, ...linkedinCompanies, ...wttjCompanies];
      
      // Trier par featured puis par nombre d'offres
      const sortedCompanies = allCompanies.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return b.jobsCount - a.jobsCount;
      });
      
      // Limiter le nombre d'entreprises retournées
      return { 
        companies: sortedCompanies.slice(0, limit),
        sources: {
          indeed: indeedCompanies.length,
          linkedin: linkedinCompanies.length,
          wttj: wttjCompanies.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises externes:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les offres d'emploi tendances depuis plusieurs sources
   * @param {Number} limit - Nombre maximum d'offres à récupérer
   * @returns {Promise<Array>} Liste des offres adaptées au format TalentMatch
   */
  getTrendingJobs: async (limit = 10) => {
    try {
      // Tableau pour stocker les promesses de requêtes API
      const requests = [];
      
      // Requête API Indeed
      requests.push(
        axios.get(`${API_ENDPOINTS.INDEED.BASE_URL}${API_ENDPOINTS.INDEED.JOBS}/trending`, {
          params: { limit, api_key: API_KEYS.INDEED }
        }).catch(err => {
          console.warn('Erreur API Indeed (offres):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Requête API LinkedIn
      requests.push(
        axios.get(`${API_ENDPOINTS.LINKEDIN.BASE_URL}${API_ENDPOINTS.LINKEDIN.JOBS}/trending`, {
          params: { limit, api_key: API_KEYS.LINKEDIN }
        }).catch(err => {
          console.warn('Erreur API LinkedIn (offres):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Requête API Welcome to the Jungle
      requests.push(
        axios.get(`${API_ENDPOINTS.WTTJ.BASE_URL}${API_ENDPOINTS.WTTJ.JOBS}/trending`, {
          params: { limit, api_key: API_KEYS.WTTJ }
        }).catch(err => {
          console.warn('Erreur API WTTJ (offres):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Exécuter toutes les requêtes en parallèle
      const responses = await Promise.all(requests);
      
      // Récupérer et adapter les données
      const indeedJobs = (responses[0].data.jobs || []).map(job => 
        adaptJobData(job, 'INDEED')
      );
      
      const linkedinJobs = (responses[1].data.jobs || []).map(job => 
        adaptJobData(job, 'LINKEDIN')
      );
      
      const wttjJobs = (responses[2].data.jobs || []).map(job => 
        adaptJobData(job, 'WTTJ')
      );
      
      // Combiner tous les jobs
      const allJobs = [...indeedJobs, ...linkedinJobs, ...wttjJobs];
      
      // Simuler un score de matching aléatoire entre 70 et 99%
      const jobsWithMatchingRate = allJobs.map(job => ({
        ...job,
        matchingRate: Math.floor(Math.random() * 30) + 70
      }));
      
      // Trier par date (les plus récents d'abord) et featured
      const sortedJobs = jobsWithMatchingRate.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        return b.postedDate - a.postedDate;
      });
      
      // Limiter le nombre d'offres retournées
      return { 
        jobs: sortedJobs.slice(0, limit),
        sources: {
          indeed: indeedJobs.length,
          linkedin: linkedinJobs.length,
          wttj: wttjJobs.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des offres externes:', error);
      throw error;
    }
  },
  
  /**
   * Recherche des offres d'emploi avec un terme de recherche
   * @param {String} query - Terme de recherche
   * @param {Object} filters - Filtres supplémentaires (location, contractType, etc.)
   * @param {Number} limit - Nombre maximum d'offres à récupérer
   * @returns {Promise<Array>} Liste des offres correspondantes
   */
  searchJobs: async (query, filters = {}, limit = 20) => {
    try {
      // Configuration des paramètres de recherche
      const searchParams = {
        q: query,
        limit,
        ...filters
      };
      
      // Tableau pour stocker les promesses de requêtes API
      const requests = [];
      
      // Requête API Indeed
      requests.push(
        axios.get(`${API_ENDPOINTS.INDEED.BASE_URL}${API_ENDPOINTS.INDEED.JOBS}/search`, {
          params: { ...searchParams, api_key: API_KEYS.INDEED }
        }).catch(err => {
          console.warn('Erreur API Indeed (recherche):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Requête API LinkedIn
      requests.push(
        axios.get(`${API_ENDPOINTS.LINKEDIN.BASE_URL}${API_ENDPOINTS.LINKEDIN.JOBS}/search`, {
          params: { ...searchParams, api_key: API_KEYS.LINKEDIN }
        }).catch(err => {
          console.warn('Erreur API LinkedIn (recherche):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Requête API Welcome to the Jungle
      requests.push(
        axios.get(`${API_ENDPOINTS.WTTJ.BASE_URL}${API_ENDPOINTS.WTTJ.JOBS}/search`, {
          params: { ...searchParams, api_key: API_KEYS.WTTJ }
        }).catch(err => {
          console.warn('Erreur API WTTJ (recherche):', err.message);
          return { data: { jobs: [] } };
        })
      );
      
      // Exécuter toutes les requêtes en parallèle
      const responses = await Promise.all(requests);
      
      // Récupérer et adapter les données
      const indeedJobs = (responses[0].data.jobs || []).map(job => 
        adaptJobData(job, 'INDEED')
      );
      
      const linkedinJobs = (responses[1].data.jobs || []).map(job => 
        adaptJobData(job, 'LINKEDIN')
      );
      
      const wttjJobs = (responses[2].data.jobs || []).map(job => 
        adaptJobData(job, 'WTTJ')
      );
      
      // Combiner et ajouter un score de matching
      const allJobs = [...indeedJobs, ...linkedinJobs, ...wttjJobs].map(job => ({
        ...job,
        matchingRate: Math.floor(Math.random() * 30) + 70
      }));
      
      // Trier par pertinence (score de matching)
      const sortedJobs = allJobs.sort((a, b) => b.matchingRate - a.matchingRate);
      
      return { 
        jobs: sortedJobs.slice(0, limit),
        total: sortedJobs.length,
        sources: {
          indeed: indeedJobs.length,
          linkedin: linkedinJobs.length,
          wttj: wttjJobs.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la recherche d\'offres:', error);
      throw error;
    }
  }
};

export default externalApiService;