import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Connexion DIRECTE avec Firebase (sans passer par useAuth)
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Stocker les informations d'authentification
      const token = await user.getIdToken();
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("userEmail", user.email);
      
      console.log("Authentification réussie:", user);
      
      // Synchronisation avec la base de données
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firebase_uid: user.uid,
            email: user.email
          })
        });
        
        if (!response.ok) {
          console.warn("Problème avec l'API, mais l'authentification a réussi");
          // On continue quand même car l'authentification a fonctionné
        }
        
        // Essayer de lire la réponse si possible
        try {
          const userData = await response.json();
          // Redirection basée sur le type d'utilisateur
          if (userData.userType === 'recruiter') {
            navigate('/recruiter-dashboard');
          } else {
            navigate('/candidate-dashboard');
          }
        } catch (jsonError) {
          console.warn("Impossible de lire la réponse JSON, redirection par défaut");
          navigate('/candidate-dashboard'); // Redirection par défaut
        }
      } catch (apiError) {
        console.error("Erreur API:", apiError);
        // On continue quand même car l'authentification a fonctionné
        navigate('/candidate-dashboard'); // Redirection par défaut
      }
      
    } catch (error) {
      console.error("Erreur d'authentification:", error.code, error.message);
      
      // Messages d'erreur plus explicites
      if (error.code === 'auth/invalid-login-credentials' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/user-not-found') {
        setError("Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Format d'email invalide. Veuillez entrer un email valide.");
      } else if (error.code === 'auth/too-many-requests') {
        setError("Trop de tentatives. Veuillez réessayer plus tard ou réinitialisez votre mot de passe.");
      } else {
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("userEmail", user.email);

      // Synchroniser dans users
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: user.email
        })
      });

      // Rediriger
      navigate("/candidate-dashboard");

    } catch (error) {
      console.error("Erreur Google Login:", error);
      setError("Problème avec la connexion Google. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-right">
      <h2>Connexion à votre compte</h2>

      {error && (
        <div className="login-error" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Se souvenir de moi
          </label>
          <a href="/forgot-password" className="forgot-password">Mot de passe oublié?</a>
        </div>

        <button 
          type="submit" 
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="login-divider">
        <span>Ou se connecter avec</span>
      </div>

      <div className="social-login">
        <button className="social-btn facebook-btn">
          <i className="fab fa-facebook-f"></i>
        </button>
        <button className="social-btn twitter-btn">
          <i className="fab fa-twitter"></i>
        </button>
        <button className="social-btn google-btn" onClick={handleGoogleLogin}>
         <i className="fab fa-google"></i>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
