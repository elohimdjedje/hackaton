import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth();
  const [stars, setStars] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

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

  // Simuler le chargement des contacts et messages depuis une API
  useEffect(() => {
    // Données fictives des contacts
    const mockContacts = [
      {
        id: 1,
        nom: "Marie Laurent",
        poste: "Recruteuse",
        entreprise: "TechVision",
        photo: null,
        initiales: "ML",
        dernierMessage: "Bonjour Jean, je serais disponible pour un entretien demain à 14h. Est-ce que cela vous convient ?",
        dateMessage: "2025-03-20T14:35:00",
        nonLu: 1,
        enligne: false,
        derniereConnexion: "2025-03-20T15:00:00"
      },
      {
        id: 2,
        nom: "Thomas Dubois",
        poste: "Directeur Technique",
        entreprise: "DigitalSoft",
        photo: null,
        initiales: "TD",
        dernierMessage: "Nous avons bien reçu votre candidature. Merci pour votre intérêt.",
        dateMessage: "2025-03-19T09:12:00",
        nonLu: 0,
        enligne: true,
        derniereConnexion: null
      },
      {
        id: 3,
        nom: "Cécile Martin",
        poste: "Responsable RH",
        entreprise: "StartupInno",
        photo: null,
        initiales: "CM",
        dernierMessage: "Suite à notre entretien d'hier, j'ai le plaisir de vous informer que nous souhaitons poursuivre le processus.",
        dateMessage: "2025-03-18T17:45:00",
        nonLu: 0,
        enligne: false,
        derniereConnexion: "2025-03-20T10:30:00"
      },
      {
        id: 4,
        nom: "Nicolas Bernard",
        poste: "Lead Developer",
        entreprise: "DataInsight",
        photo: null,
        initiales: "NB",
        dernierMessage: "J'aimerais en savoir plus sur votre expérience avec React Native.",
        dateMessage: "2025-03-15T11:20:00",
        nonLu: 0,
        enligne: false,
        derniereConnexion: "2025-03-19T16:45:00"
      }
    ];
    
    setContacts(mockContacts);
    
    // Définir le premier contact comme actif par défaut
    if (mockContacts.length > 0 && !activeContact) {
      setActiveContact(mockContacts[0]);
      
      // Charger les messages pour ce contact
      const mockMessages = [
        {
          id: 1,
          contactId: 1,
          expediteur: "contact",
          contenu: "Bonjour Jean, je suis Marie Laurent, recruteuse chez TechVision. J'ai consulté votre profil et je suis intéressée par votre candidature pour le poste de Développeur Full Stack.",
          date: "2025-03-19T10:15:00",
          lu: true
        },
        {
          id: 2,
          contactId: 1,
          expediteur: "moi",
          contenu: "Bonjour Marie, merci pour votre message. Je suis très intéressé par cette opportunité.",
          date: "2025-03-19T10:30:00",
          lu: true
        },
        {
          id: 3,
          contactId: 1,
          expediteur: "contact",
          contenu: "Excellent ! Seriez-vous disponible pour un entretien visio cette semaine ?",
          date: "2025-03-19T10:45:00",
          lu: true
        },
        {
          id: 4,
          contactId: 1,
          expediteur: "moi",
          contenu: "Oui, bien sûr. Je suis disponible jeudi ou vendredi après-midi.",
          date: "2025-03-19T11:00:00",
          lu: true
        },
        {
          id: 5,
          contactId: 1,
          expediteur: "contact",
          contenu: "Parfait, je vous propose vendredi à 14h alors. Je vous enverrai un lien pour la visioconférence.",
          date: "2025-03-19T11:15:00",
          lu: true
        },
        {
          id: 6,
          contactId: 1,
          expediteur: "moi",
          contenu: "C'est noté, merci. À vendredi !",
          date: "2025-03-19T11:30:00",
          lu: true
        },
        {
          id: 7,
          contactId: 1,
          expediteur: "contact",
          contenu: "Bonjour Jean, je serais disponible pour un entretien demain à 14h. Est-ce que cela vous convient ?",
          date: "2025-03-20T14:35:00",
          lu: false
        }
      ];
      
      setMessages(mockMessages);
    }
  }, [activeContact]);

  // Défilement automatique vers le bas de la conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Charger les messages lorsqu'un nouveau contact est sélectionné
  useEffect(() => {
    if (activeContact) {
      // Simuler le chargement des messages pour ce contact
      const mockMessages = [
        // Messages pour le contact 1
        {
          id: 1,
          contactId: 1,
          expediteur: "contact",
          contenu: "Bonjour Jean, je suis Marie Laurent, recruteuse chez TechVision. J'ai consulté votre profil et je suis intéressée par votre candidature pour le poste de Développeur Full Stack.",
          date: "2025-03-19T10:15:00",
          lu: true
        },
        {
          id: 2,
          contactId: 1,
          expediteur: "moi",
          contenu: "Bonjour Marie, merci pour votre message. Je suis très intéressé par cette opportunité.",
          date: "2025-03-19T10:30:00",
          lu: true
        },
        {
          id: 3,
          contactId: 1,
          expediteur: "contact",
          contenu: "Excellent ! Seriez-vous disponible pour un entretien visio cette semaine ?",
          date: "2025-03-19T10:45:00",
          lu: true
        },
        {
          id: 4,
          contactId: 1,
          expediteur: "moi",
          contenu: "Oui, bien sûr. Je suis disponible jeudi ou vendredi après-midi.",
          date: "2025-03-19T11:00:00",
          lu: true
        },
        {
          id: 5,
          contactId: 1,
          expediteur: "contact",
          contenu: "Parfait, je vous propose vendredi à 14h alors. Je vous enverrai un lien pour la visioconférence.",
          date: "2025-03-19T11:15:00",
          lu: true
        },
        {
          id: 6,
          contactId: 1,
          expediteur: "moi",
          contenu: "C'est noté, merci. À vendredi !",
          date: "2025-03-19T11:30:00",
          lu: true
        },
        {
          id: 7,
          contactId: 1,
          expediteur: "contact",
          contenu: "Bonjour Jean, je serais disponible pour un entretien demain à 14h. Est-ce que cela vous convient ?",
          date: "2025-03-20T14:35:00",
          lu: false
        },
        
        // Messages pour le contact 2
        {
          id: 8,
          contactId: 2,
          expediteur: "contact",
          contenu: "Bonjour Jean, nous avons bien reçu votre candidature pour le poste de Développeur Frontend chez DigitalSoft.",
          date: "2025-03-18T14:20:00",
          lu: true
        },
        {
          id: 9,
          contactId: 2,
          expediteur: "moi",
          contenu: "Bonjour Thomas, merci pour votre retour. Je reste disponible pour toute information complémentaire.",
          date: "2025-03-18T15:05:00",
          lu: true
        },
        {
          id: 10,
          contactId: 2,
          expediteur: "contact",
          contenu: "Nous avons bien reçu votre candidature. Merci pour votre intérêt.",
          date: "2025-03-19T09:12:00",
          lu: true
        },
        
        // Messages pour le contact 3
        {
          id: 11,
          contactId: 3,
          expediteur: "contact",
          contenu: "Bonjour Jean, je suis Cécile Martin de StartupInno. Nous avons apprécié votre candidature et aimerions vous rencontrer.",
          date: "2025-03-17T09:30:00",
          lu: true
        },
        {
          id: 12,
          contactId: 3,
          expediteur: "moi",
          contenu: "Bonjour Cécile, je serais ravi d'en savoir plus sur cette opportunité.",
          date: "2025-03-17T10:00:00",
          lu: true
        },
        {
          id: 13,
          contactId: 3,
          expediteur: "contact",
          contenu: "Excellent ! Pouvons-nous prévoir un entretien demain à 11h ?",
          date: "2025-03-17T10:15:00",
          lu: true
        },
        {
          id: 14,
          contactId: 3,
          expediteur: "moi",
          contenu: "Oui, cela me convient parfaitement.",
          date: "2025-03-17T10:30:00",
          lu: true
        },
        {
          id: 15,
          contactId: 3,
          expediteur: "contact",
          contenu: "Suite à notre entretien d'hier, j'ai le plaisir de vous informer que nous souhaitons poursuivre le processus.",
          date: "2025-03-18T17:45:00",
          lu: true
        },
        
        // Messages pour le contact 4
        {
          id: 16,
          contactId: 4,
          expediteur: "contact",
          contenu: "Bonjour Jean, votre profil a attiré notre attention chez DataInsight. Nous recherchons un développeur avec vos compétences.",
          date: "2025-03-15T10:30:00",
          lu: true
        },
        {
          id: 17,
          contactId: 4,
          expediteur: "moi",
          contenu: "Bonjour Nicolas, merci pour votre message. Je suis intéressé par votre entreprise.",
          date: "2025-03-15T11:00:00",
          lu: true
        },
        {
          id: 18,
          contactId: 4,
          expediteur: "contact",
          contenu: "J'aimerais en savoir plus sur votre expérience avec React Native.",
          date: "2025-03-15T11:20:00",
          lu: true
        }
      ];
      
      // Filtrer les messages pour le contact actif
      const filteredMessages = mockMessages.filter(msg => msg.contactId === activeContact.id);
      setMessages(filteredMessages);
      
      // Marquer les messages non lus comme lus
      const updatedContacts = contacts.map(contact => {
        if (contact.id === activeContact.id) {
          return { ...contact, nonLu: 0 };
        }
        return contact;
      });
      setContacts(updatedContacts);
    }
  }, [activeContact, contacts]);

  // Gérer l'envoi d'un nouveau message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '' || !activeContact) return;
    
    // Créer un nouveau message
    const newMsg = {
      id: messages.length + 1,
      contactId: activeContact.id,
      expediteur: "moi",
      contenu: newMessage,
      date: new Date().toISOString(),
      lu: true
    };
    
    // Ajouter le message à la liste
    setMessages([...messages, newMsg]);
    
    // Mettre à jour le dernier message du contact
    const updatedContacts = contacts.map(contact => {
      if (contact.id === activeContact.id) {
        return {
          ...contact,
          dernierMessage: newMessage,
          dateMessage: new Date().toISOString()
        };
      }
      return contact;
    });
    setContacts(updatedContacts);
    
    // Réinitialiser le champ de texte
    setNewMessage('');
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Filtrer les contacts par la recherche
  const filteredContacts = contacts.filter(contact => 
    contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.entreprise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
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

      {/* Top navigation */}
      <header className="dashboard-header">
        <div className="header-logo">
          <Link to="/" className="logo">
            <div className="logo-icon">TM</div>
            <span>TalentMatch</span>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/entreprises" className="nav-link">Entreprises</Link>
          <Link to="/offres" className="nav-link">Offres</Link>
          <Link to="/candidats" className="nav-link">Candidats</Link>
          <Link to="/conseils" className="nav-link">Conseils</Link>
        </nav>
        <div className="header-actions">
          <div className="notifications">
            <div className="notification-icon">
              <span className="notification-badge">3</span>
              <i className="far fa-bell"></i>
            </div>
          </div>
          <div className="user-avatar">
            JD
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">PRINCIPAL</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to="/candidate-dashboard" className="sidebar-link">
                  <i className="sidebar-icon fas fa-chart-bar"></i>
                  <span>Tableau de bord</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/offres-emploi" className="sidebar-link">
                  <i className="sidebar-icon fas fa-briefcase"></i>
                  <span>Offres d'emploi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/mes-candidatures" className="sidebar-link">
                  <i className="sidebar-icon fas fa-file-alt"></i>
                  <span>Mes candidatures</span>
                </Link>
              </li>
              <li className="sidebar-item active">
                <Link to="/messages" className="sidebar-link">
                  <i className="sidebar-icon fas fa-comment-alt"></i>
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">PROFIL</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to="/mon-profil" className="sidebar-link">
                  <i className="sidebar-icon fas fa-user"></i>
                  <span>Mon profil</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/parametres" className="sidebar-link">
                  <i className="sidebar-icon fas fa-cog"></i>
                  <span>Paramètres</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main messages */}
        <main className="messages-main">
          <div className="messages-container">
            {/* Liste des contacts */}
            <div className="contacts-sidebar">
              <div className="contacts-header">
                <h2 className="contacts-title">Messages</h2>
                <button className="new-message-btn">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <div className="contacts-list">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
                      onClick={() => setActiveContact(contact)}
                    >
                      <div className="contact-avatar">
                        {contact.photo ? (
                          <img src={contact.photo} alt={contact.nom} className="avatar-img" />
                        ) : (
                          <div className="avatar-initials">{contact.initiales}</div>
                        )}
                        {contact.enligne && <div className="online-indicator"></div>}
                      </div>
                      <div className="contact-info">
                        <div className="contact-header">
                          <h3 className="contact-name">{contact.nom}</h3>
                          <span className="message-time">{formatDate(contact.dateMessage)}</span>
                        </div>
                        <p className="contact-poste">{contact.poste} - {contact.entreprise}</p>
                        <p className="contact-preview">{contact.dernierMessage}</p>
                      </div>
                      {contact.nonLu > 0 && (
                        <div className="unread-badge">{contact.nonLu}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-contacts">
                    <p>Aucun contact trouvé</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation */}
            {activeContact ? (
              <div className="conversation">
                <div className="conversation-header">
                  <div className="contact-avatar">
                    {activeContact.photo ? (
                      <img src={activeContact.photo} alt={activeContact.nom} className="avatar-img" />
                    ) : (
                      <div className="avatar-initials">{activeContact.initiales}</div>
                    )}
                    {activeContact.enligne && <div className="online-indicator"></div>}
                  </div>
                  <div className="contact-info">
                    <h3 className="contact-name">{activeContact.nom}</h3>
                    <p className="contact-poste">{activeContact.poste} - {activeContact.entreprise}</p>
                    <p className="contact-status">
                      {activeContact.enligne ? (
                        <span className="online-status">En ligne</span>
                      ) : (
                        <span className="offline-status">
                          Vu pour la dernière fois {formatDate(activeContact.derniereConnexion)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="conversation-actions">
                    <button className="action-btn profile-btn">
                      <i className="fas fa-user"></i>
                    </button>
                    <button className="action-btn more-btn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div className="messages-list">
                  {messages.map((message, index) => {
                    // Vérifier si on doit afficher la date
                    const showDate = index === 0 || 
                      new Date(message.date).toDateString() !== new Date(messages[index - 1].date).toDateString();
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDate && (
                          <div className="date-separator">
                            <span className="date-text">
                              {new Date(message.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`message ${message.expediteur === 'moi' ? 'sent' : 'received'}`}>
                          <div className="message-content">{message.contenu}</div>
                          <div className="message-time">
                            {formatDate(message.date)}
                            {message.expediteur === 'moi' && (
                              <i className={`status-icon ${message.lu ? 'fas fa-check-double' : 'fas fa-check'}`}></i>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                <form className="message-form" onSubmit={handleSendMessage}>
                  <div className="form-actions">
                    <button type="button" className="action-btn attach-btn">
                      <i className="fas fa-paperclip"></i>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tapez votre message..." 
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="send-btn" disabled={newMessage.trim() === ''}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            ) : (
              <div className="no-conversation">
                <div className="no-conversation-content">
                  <i className="fas fa-comments no-conversation-icon"></i>
                  <h3>Sélectionnez une conversation</h3>
                  <p>Choisissez un contact pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;