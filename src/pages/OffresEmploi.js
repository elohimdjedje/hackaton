import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jobService } from '../services/apiService';
import '../jobdetail.css';

const OffresEmploi = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les paramètres de recherche depuis l'URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('query') || '';
  const locationParam = searchParams.get('location') || '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Utiliser les paramètres de recherche pour filtrer les offres
        const data = await jobService.searchJobs(queryParam, locationParam);
        setJobs(data.jobs);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des offres d\'emploi:', err);
        setError('Impossible de charger les offres d\'emploi');
        setLoading(false);
        
        // Données de démonstration
        setJobs([
          // ... vos données de démonstration
        ]);
      }
    };

    fetchJobs();
  }, [queryParam, locationParam]);

  // ... le reste de votre composant
};

export default OffresEmploi;