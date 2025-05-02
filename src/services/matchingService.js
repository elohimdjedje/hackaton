// services/matchingService.js
import { jobService } from './apiService';

export const matchingService = {
  // Calculer le pourcentage de matching entre un CV et une offre
  calculateMatchingScore: (cv, job) => {
    let totalPoints = 0;
    let scoredPoints = 0;
    
    // Matching sur compétences (fort coefficient)
    const cvSkills = cv.skills.map(skill => skill.toLowerCase());
    let jobSkills = [];
    
    // Extraire les compétences des exigences du poste
    if (job.profileList) {
      job.profileList.forEach(item => {
        // Analyse de texte pour extraire les compétences
        const extractedSkills = extractSkillsFromText(item);
        jobSkills = [...jobSkills, ...extractedSkills];
      });
    }
    
    // Normaliser les compétences de l'offre
    jobSkills = jobSkills.map(skill => skill.toLowerCase());
    
    // Points pour les compétences (forte pondération)
    totalPoints += jobSkills.length * 3;
    jobSkills.forEach(skill => {
      if (cvSkills.some(cvSkill => cvSkill.includes(skill) || skill.includes(cvSkill))) {
        scoredPoints += 3;
      }
    });
    
    // Matching sur l'expérience
    const expMatch = matchExperience(cv.experience, job.experience);
    totalPoints += 10;
    scoredPoints += expMatch * 10;
    
    // Matching sur le secteur
    const sectorMatch = cv.sectors.some(sector => 
      sector.toLowerCase() === job.secteur.toLowerCase() || 
      sector.toLowerCase() === job.category.toLowerCase()
    );
    totalPoints += 5;
    scoredPoints += sectorMatch ? 5 : 0;
    
    // Matching sur la localisation
    let locationMatch = 0;
    if (cv.preferedLocations.some(loc => job.location.includes(loc))) {
      locationMatch = 1;
    } else if (job.location.includes('Remote') && cv.remoteWork) {
      locationMatch = 1;
    }
    totalPoints += 5;
    scoredPoints += locationMatch * 5;
    
    // Calculer le score final (pourcentage)
    const matchingScore = Math.round((scoredPoints / totalPoints) * 100);
    
    return Math.min(matchingScore, 100); // Plafonner à 100%
  },
  
  // Trouver les meilleures offres pour un CV
  findMatchingJobs: async (cv, limit = 10) => {
    try {
      // Récupérer toutes les offres
      const allJobs = await jobService.getAllJobs();
      
      // Calculer le score de matching pour chaque offre
      const jobsWithScore = allJobs.map(job => ({
        ...job,
        matchingScore: matchingService.calculateMatchingScore(cv, job)
      }));
      
      // Trier par score de matching (descendant)
      const sortedJobs = jobsWithScore.sort((a, b) => b.matchingScore - a.matchingScore);
      
      // Retourner les meilleures correspondances
      return sortedJobs.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la recherche des offres correspondantes:', error);
      return [];
    }
  },
  
  // Suggérer des améliorations pour un CV basées sur les offres cibles
  suggestCVImprovements: async (cv, targetJobTitles = []) => {
    try {
      // Récupérer les offres correspondant aux titres cibles
      const allJobs = await jobService.getAllJobs();
      let targetJobs = allJobs;
      
      if (targetJobTitles.length > 0) {
        targetJobs = allJobs.filter(job => 
          targetJobTitles.some(title => 
            job.title.toLowerCase().includes(title.toLowerCase())
          )
        );
      }
      
      if (targetJobs.length === 0) {
        return { message: "Aucune offre cible trouvée" };
      }
      
      // Analyser les compétences les plus demandées
      const skillsCount = {};
      targetJobs.forEach(job => {
        if (job.profileList) {
          job.profileList.forEach(item => {
            const extractedSkills = extractSkillsFromText(item);
            extractedSkills.forEach(skill => {
              skillsCount[skill] = (skillsCount[skill] || 0) + 1;
            });
          });
        }
      });
      
      // Convertir en tableau et trier par fréquence
      const sortedSkills = Object.entries(skillsCount)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);
      
      // Identifier les compétences manquantes
      const cvSkills = cv.skills.map(skill => skill.toLowerCase());
      const missingSkills = sortedSkills
        .filter(({ skill }) => !cvSkills.some(cvSkill => 
          cvSkill.includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(cvSkill)
        ))
        .slice(0, 5);
      
      return {
        missingTopSkills: missingSkills,
        suggestedExperience: getMostCommonExperience(targetJobs),
        suggestedJobTitles: getRelatedJobTitles(targetJobs)
      };
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      return { message: "Erreur lors de l'analyse" };
    }
  }
};

// Fonctions utilitaires
function extractSkillsFromText(text) {
  // Version simple : recherche de mots clés
  const commonSkills = [
    'javascript', 'react', 'node', 'python', 'java', 'sql', 'nosql',
    'aws', 'devops', 'agile', 'scrum', 'ui', 'ux', 'design', 'marketing',
    'communication', 'management', 'leadership', 'analyse', 'data'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill)
  );
}

function matchExperience(cvExperience, jobExperience) {
  // Convertir l'expérience en années
  const cvYears = parseExperienceToYears(cvExperience);
  const jobYears = parseExperienceToYears(jobExperience);
  
  // Si l'expérience du CV est supérieure ou égale à celle demandée
  if (cvYears >= jobYears) {
    return 1;
  }
  
  // Matching partiel
  return Math.max(0, cvYears / jobYears);
}

function parseExperienceToYears(expString) {
  if (!expString) return 0;
  
  const lowerExp = expString.toLowerCase();
  
  if (lowerExp.includes('0-2') || lowerExp.includes('débutant')) {
    return 1;
  } else if (lowerExp.includes('2-5') || lowerExp.includes('intermédiaire')) {
    return 3;
  } else if (lowerExp.includes('5+') || lowerExp.includes('senior')) {
    return 6;
  } else if (lowerExp.includes('10+') || lowerExp.includes('expert')) {
    return 10;
  }
  
  // Extraction de chiffres si format non standard
  const numbers = lowerExp.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return Math.max(...numbers.map(n => parseInt(n)));
  }
  
  return 0;
}

function getMostCommonExperience(jobs) {
  const expCount = {};
  
  jobs.forEach(job => {
    if (job.experience) {
      expCount[job.experience] = (expCount[job.experience] || 0) + 1;
    }
  });
  
  return Object.entries(expCount)
    .sort((a, b) => b[1] - a[1])
    .map(([exp]) => exp)[0] || "Non spécifié";
}

function getRelatedJobTitles(jobs) {
  // Regrouper les titres similaires
  const titleGroups = {};
  
  jobs.forEach(job => {
    const keywords = job.title.toLowerCase().split(' ');
    keywords.forEach(keyword => {
      if (keyword.length > 3) { // Ignorer les mots courts
        if (!titleGroups[keyword]) {
          titleGroups[keyword] = [];
        }
        if (!titleGroups[keyword].includes(job.title)) {
          titleGroups[keyword].push(job.title);
        }
      }
    });
  });
  
  // Trier par nombre de titres associés
  return Object.entries(titleGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .flatMap(([, titles]) => titles.slice(0, 2));
}