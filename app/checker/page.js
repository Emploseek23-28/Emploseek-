'use client';
import { useState } from 'react';

// Fonction de traduction des statuts
const translateStatus = (status) => {
  const statusMap = {
    'pending': { 
      text: '⏳ En attente de validation', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      description: 'Votre demande est en cours de traitement par notre équipe.'
    },
    'published': { 
      text: '✅ Contrat validé et publié', 
      color: '#10b981',
      bgColor: '#f0fdf4',
      description: 'Votre contrat a été approuvé et est maintenant actif.'
    },
    'active': { 
      text: '🟢 Contrat actif', 
      color: '#10b981',
      bgColor: '#f0fdf4',
      description: 'Votre contrat est actuellement en cours.'
    },
    'closed': { 
      text: '🔒 Offre clôturée', 
      color: '#6b7280',
      bgColor: '#f3f4f6',
      description: 'Cette offre n\'est plus disponible.'
    },
    'rejected': { 
      text: '❌ Contrat refusé', 
      color: '#ef4444',
      bgColor: '#fef2f2',
      description: 'Votre demande n\'a pas été acceptée.'
    }
  };
  
  return statusMap[status] || { 
    text: status, 
    color: '#6b7280', 
    bgColor: '#f3f4f6',
    description: 'Statut non défini'
  };
};

export default function CheckerPage() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkReference = async (e) => {
    e.preventDefault();
    if (!reference.trim()) {
      setError('Veuillez entrer une référence');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch(`/api/check/${reference.trim().toUpperCase()}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data);
      } else {
        setError(data.message || 'Référence non trouvée');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser
  const resetSearch = () => {
    setReference('');
    setResult(null);
    setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        minHeight: '90vh'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '2.5rem',
            fontWeight: '800'
          }}>
            🔍 Vérificateur Emploseek
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '1.1rem',
            opacity: '0.9'
          }}>
            Vérifiez en temps réel le statut de votre contrat
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '40px 30px' }}>
          
          {/* Search Form */}
          <div style={{
            background: '#f8fafc',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '40px'
          }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#1e293b',
              fontSize: '1.5rem'
            }}>
              Rechercher un contrat
            </h2>
            
            <form onSubmit={checkReference}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Exemple : TW238, DEV001, MKT001..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      background: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    disabled={loading}
                  />
                  {error && !result && (
                    <div style={{
                      color: '#ef4444',
                      marginTop: '10px',
                      fontSize: '0.95rem'
                    }}>
                      ⚠️ {error}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '18px 35px',
                    background: loading ? '#94a3b8' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                      Vérification...
                    </>
                  ) : (
                    <>
                      🔍 Vérifier
                    </>
                  )}
                </button>
              </div>
              
              <div style={{ 
                marginTop: '20px', 
                fontSize: '0.95rem',
                color: '#64748b'
              }}>
                <p style={{ margin: '0' }}>
                  <strong>Astuce :</strong> La référence vous a été fournie par email ou dans votre contrat.
                </p>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {result && result.status === 'success' && (
            <div style={{
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{
                background: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '15px',
                padding: '35px',
                marginBottom: '30px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '25px'
                }}>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                  <div>
                    <h2 style={{ 
                      margin: '0', 
                      color: '#065f46',
                      fontSize: '1.8rem'
                    }}>
                      Contrat Trouvé !
                    </h2>
                    <p style={{ 
                      margin: '5px 0 0 0', 
                      color: '#047857',
                      fontSize: '1.1rem'
                    }}>
                      Voici les détails de votre contrat
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                {(() => {
                  const statusInfo = translateStatus(result.data.status);
                  return (
                    <div style={{
                      background: statusInfo.bgColor,
                      border: `2px solid ${statusInfo.color}`,
                      borderRadius: '10px',
                      padding: '20px',
                      marginBottom: '25px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '10px'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {statusInfo.text.split(' ')[0]}
                        </span>
                        <span style={{
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          color: statusInfo.color
                        }}>
                          {statusInfo.text.substring(statusInfo.text.indexOf(' ') + 1)}
                        </span>
                      </div>
                      <p style={{ 
                        margin: '0', 
                        color: '#475569',
                        fontSize: '1rem'
                      }}>
                        {statusInfo.description}
                      </p>
                    </div>
                  );
                })()}
                
                {/* Contract Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      color: '#64748b', 
                      fontSize: '0.95rem',
                      marginBottom: '5px'
                    }}>
                      📋 Référence
                    </div>
                    <div style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>
                      {result.data.reference}
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      color: '#64748b', 
                      fontSize: '0.95rem',
                      marginBottom: '5px'
                    }}>
                      👤 Titre du poste
                    </div>
                    <div style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>
                      {result.data.title || 'Non spécifié'}
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      color: '#64748b', 
                      fontSize: '0.95rem',
                      marginBottom: '5px'
                    }}>
                      🏢 Entreprise
                    </div>
                    <div style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>
                      {result.data.company || 'Non spécifiée'}
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      color: '#64748b', 
                      fontSize: '0.95rem',
                      marginBottom: '5px'
                    }}>
                      📍 Localisation
                    </div>
                    <div style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>
                      {result.data.location || 'Non spécifiée'}
                    </div>
                  </div>
                  
                  {result.data.salary && (
                    <div style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        color: '#64748b', 
                        fontSize: '0.95rem',
                        marginBottom: '5px'
                      }}>
                        💰 Salaire
                      </div>
                      <div style={{ 
                        fontSize: '1.3rem', 
                        fontWeight: '700',
                        color: '#1e293b'
                      }}>
                        {result.data.salary}
                      </div>
                    </div>
                  )}
                  
                  {result.data.created_at && (
                    <div style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        color: '#64748b', 
                        fontSize: '0.95rem',
                        marginBottom: '5px'
                      }}>
                        📅 Date de création
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        {new Date(result.data.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={resetSearch}
                    style={{
                      padding: '15px 30px',
                      background: '#e2e8f0',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s'
                    }}
                  >
                    🔄 Nouvelle recherche
                  </button>
                  
                  <a
                    href={`/api/check/${result.data.reference}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '15px 30px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s'
                    }}
                  >
                    📄 Voir les données brutes
                  </a>
                </div>
              </div>
              
              {/* Help Section */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#1e293b',
                  fontSize: '1.2rem'
                }}>
                  📋 Que faire ensuite ?
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  <div style={{ padding: '10px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#475569',
                      marginBottom: '5px'
                    }}>
                      Si "En attente"
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      Votre contrat est en cours de validation par notre équipe.
                    </div>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#475569',
                      marginBottom: '5px'
                    }}>
                      Si "Contrat validé"
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      Votre contrat est actif. Consultez vos emails pour les prochaines étapes.
                    </div>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#475569',
                      marginBottom: '5px'
                    }}>
                      Besoin d'aide ?
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      Contactez-nous à support@emploseek.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Results Message (error) */}
          {error && result?.status === 'error' && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '15px',
              padding: '40px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '20px',
                color: '#ef4444'
              }}>
                ❌
              </div>
              <h2 style={{ 
                margin: '0 0 10px 0', 
                color: '#dc2626'
              }}>
                Contrat Non Trouvé
              </h2>
              <p style={{ 
                margin: '0 0 25px 0', 
                color: '#991b1b',
                fontSize: '1.1rem'
              }}>
                {error}
              </p>
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={resetSearch}
                  style={{
                    padding: '15px 30px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Réessayer avec une autre référence
                </button>
              </div>
            </div>
          )}

          {/* Examples Section */}
          {!result && !loading && (
            <div style={{
              marginTop: '40px',
              padding: '25px',
              background: '#f8fafc',
              borderRadius: '15px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: '#1e293b',
                fontSize: '1.2rem'
              }}>
                📝 Exemples de références (test)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {[
                  { ref: 'TW238', desc: 'Agent traveler - Active' },
                  { ref: 'DEV001', desc: 'Développeur - Publiée' },
                  { ref: 'TEST001', desc: 'Offre de test - En attente' },
                  { ref: 'MKT001', desc: 'Marketing - Validée' }
                ].map((example, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setReference(example.ref);
                      setTimeout(() => {
                        document.querySelector('button[type="submit"]').click();
                      }, 100);
                    }}
                    style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#4f46e5',
                      marginBottom: '5px',
                      fontSize: '1.1rem'
                    }}>
                      {example.ref}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#64748b'
                    }}>
                      {example.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '25px 30px',
          background: '#1e293b',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '0.9rem',
            opacity: '0.8'
          }}>
            © {new Date().getFullYear()} Emploseek - Vérificateur de contrats
          </div>
          <div style={{ 
            marginTop: '10px',
            fontSize: '0.8rem',
            opacity: '0.6'
          }}>
            Service sécurisé • Données en temps réel • Support 24/7
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
