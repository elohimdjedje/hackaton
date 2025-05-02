import React from 'react';
import silhouetteLogo from '../assets/images/silhouette-logo.png';

const Logo = ({ size = 'medium' }) => {
  const dimensions = {
    small: { width: '30px', height: '30px' },
    medium: { width: '50px', height: '50px' },
    large: { width: '80px', height: '80px' },
  };

  return (
    <div className="logo-container">
      <img 
        src={silhouetteLogo} 
        alt="TalentMatch Logo" 
        style={dimensions[size]} 
        className="logo-image"
      />
    </div>
  );
};

export default Logo;