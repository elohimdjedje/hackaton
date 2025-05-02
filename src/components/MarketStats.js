// Version simplifiée sans Recharts
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketStats = ({ jobTitle, jobSector }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Rechercher des statistiques par domaine/secteur
        const searchTerm = jobSector || jobTitle;
        const response = await axios.get(`/api/market-stats/${searchTerm}`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        setLoading(false);
        console.error("Erreur stats:", err);
      }
    };
    
    if (jobTitle || jobSector) {
      fetchStats();
    }
  }, [jobTitle, jobSector]);
  
  if (loading) return <div className="loading">Chargement des statistiques...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats || stats.length === 0) return <div className="no-stats">Pas de statistiques disponibles</div>;
  
  // Prendre le premier résultat comme référence
  const mainStat = stats[0];
  
  return (
    <div className="market-stats-container">
      <h2>Statistiques du marché</h2>
      
      <div className="stats-highlights">
        <div className="stat-card">
          <div className="stat-value">{mainStat.Offres_T4_2024}</div>
          <div className="stat-label">Offres disponibles</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{(mainStat.Evolution_sur_un_an * 100).toFixed(1)}%</div>
          <div className="stat-label">Évolution sur un an</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{(mainStat.Part_des_offres_durables * 100).toFixed(1)}%</div>
          <div className="stat-label">Offres durables</div>
        </div>
      </div>
      
      {stats.length > 1 && (
        <div className="stats-comparison">
          <h3>Comparaison dans le secteur</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Domaine</th>
                <th>Nombre d'offres</th>
                <th>Part d'offres durables</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.Domaine}</td>
                  <td>{stat.Offres_T4_2024}</td>
                  <td>{(stat.Part_des_offres_durables * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketStats;