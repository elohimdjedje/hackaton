import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const storedUserType = localStorage.getItem("userType");
        setUserType(storedUserType || null);
      } else {
        setCurrentUser(null);
        setUserType(null);
        localStorage.removeItem("jwt_token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setCurrentUser(user);

    // 🔑 Stocker le token Firebase pour les appels API protégés
    const token = await user.getIdToken();
    localStorage.setItem("jwt_token", token);

    // 💡 Déterminer le type (tu peux remplacer par une requête Firestore plus tard)
    const type = localStorage.getItem("userType") || "candidate";
    setUserType(type);
    localStorage.setItem("userType", type);

    return { type };
  };

  const signupCandidate = async ({ email, password, firstName, lastName }) => {
    // 🔐 Crée l'utilisateur dans Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setCurrentUser(user);
    const type = "candidate";
    setUserType(type);
    localStorage.setItem("userType", type);
  
    const token = await user.getIdToken();
    localStorage.setItem("jwt_token", token);
  
    // 🗃️ Enregistre aussi dans ta base de données MySQL via ton backend Node.js
    try {
      const res = await fetch('http://localhost:3000/candidats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prenom: firstName,
          nom: lastName,
          email: email,
          password: password,
          source: 'manual',
          linkedin_url: null
        })
      });
  
      if (!res.ok) {
        const errData = await res.json();
        console.error("❌ Erreur backend :", errData);
        throw new Error(errData.message || "Erreur lors de l'enregistrement backend");
      }
    } catch (err) {
      console.error("❌ Échec enregistrement candidat dans la BDD :", err);
      // optionnel : tu peux ici supprimer l'utilisateur de Firebase si tu veux gérer un rollback
    }
  
    return user;
  };

  const signupRecruiter = async ({ email, password, fullName, companyName, sector, companySize, phone, poste }) => {
    // 1. Création dans Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setCurrentUser(user);
  
    const type = "recruiter";
    setUserType(type);
    localStorage.setItem("userType", type);
  
    const token = await user.getIdToken();
    localStorage.setItem("jwt_token", token);
  
    // 2. Enregistrement dans ta BDD MySQL
    try {
      const [nom] = fullName.split(' '); // on sépare le nom complet (si nécessaire)
  
      await fetch('http://localhost:3000/recruteurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom_entreprise: companyName,
          secteur_activite: sector,
          taille_entreprise: companySize,
          site_web: null,
          nom: nom,
          poste: poste || null,
          email_pro: email,
          telephone: phone || null,
          mot_de_passe: password
        })
      });
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout du recruteur dans le backend :", err);
    }
  
    return user;
  };  

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("jwt_token");
  };

  const value = {
    currentUser,
    userType,
    loading,
    login,
    logout,
    signupCandidate,
    signupRecruiter,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
