'use client';
import { useState, useEffect, useRef } from 'react';

// Fonction de traduction des statuts
const translateStatus = (status) => {
  const statusMap = {
    'pending': { 
      text: '⏳ En attente de validation', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      description: 'Votre demande est en cours de traitement par notre équipe.'
    },
    'active': { 
      text: '✅ Contrat validé et actif', 
      color: '#10b981',
      bgColor: '#f0fdf4',
      description: 'Votre contrat a été validé et est maintenant actif.'
    },
    'published': { 
      text: '📢 Contrat publié', 
      color: '#3b82f6',
      bgColor: '#eff6ff',
      description: 'Votre contrat est publié et visible publiquement.'
    },
    'closed': { 
      text: '🔒 Contrat clôturé', 
      color: '#6b7280',
      bgColor: '#f3f4f6',
      description: 'Ce contrat a été clôturé.'
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
    description: 'Statut en cours de vérification'
  };
};

export default function CheckerPage() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forceRefresh, setForceRefresh] = useState(0);
  
  // Référence pour stocker le timestamp
  const requestTimestamp = useRef(Date.now());

  const checkReference = async (e) => {
    if (e) e.preventDefault();
    
    if (!reference.trim()) {
      setError('Veuillez entrer une référence');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // AJOUT D'UN TIMESTAMP UNIQUE POUR CHAQUE REQUÊTE
      requestTimestamp.current = Date.now();
      const uniqueParam = `_t=${requestTimestamp.current}`;
      
      console.log(`🔄 Requête API avec timestamp: ${requestTimestamp.current}`);
      
      const response = await fetch(`/api/check/${reference.trim().toUpperCase()}?${uniqueParam}`, {
        // OPTION POUR ÉVITER LE CACHE
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // FORCER LE RAFRAÎCHISSEMENT
        cache: 'no-store'
      });
      
      const data = await response.json();
      console.log('📦 Données reçues:', data);
      
      if (data.status === 'success') {
        setResult(data);
        console.log(`✅ Statut actuel: ${data.data.status}`);
      } else {
        setError(data.message || 'Référence non trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur fetch:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setReference('');
    setResult(null);
    setError('');
    setForceRefresh(prev => prev + 1);
  };

  // Forcer le rafraîchissement des données
  const refreshData = () => {
    if (reference.trim()) {
      console.log('🔄 Forçage du rafraîchissement des données');
      checkReference();
    }
  };

  // Exemples de références pré-remplies
  const exampleReferences = [
    { ref: '28LM23', desc: 'Test - Vérifier mise à jour' },
    { ref: 'TW238', desc: 'Agent traveler' },
    { ref: 'DEV001', desc: 'Développeur FullStack' },
    { ref: 'MKT001', desc: 'Marketing Manager' }
  ];

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
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            🔍 Vérificateur Emploseek
          </h1>
          <p style={{ margin: '0', fontSize: '1.1rem', opacity: '0.9' }}>
            Données en temps réel • Mise à jour instantanée
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '40px 30px' }}>
          
          {/* Search Form */}
          <div style={{
            background: '#f8fafc',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: '0', color: '#1e293b', fontSize: '1.5rem' }}>
                Rechercher un contrat
              </h2>
              
              {result && result.status === 'success' && (
                <button
                  onClick={refreshData}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔄 Actualiser les données
                </button>
              )}
            </div>
            
            <form onSubmit={checkReference}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Exemple : 28LM23, TW238, DEV001..."
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
                    <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '0.95rem' }}>
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
                    <>🔍 Vérifier</>
                  )}
                </button>
              </div>
              
              <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#64748b' }}>
                <p style={{ margin: '0' }}>
                  <strong>💡 Conseil :</strong> Les modifications dans l'admin sont visibles immédiatement ici.
                </p>
              </div>
            </form>
            
            {/* Quick Reference Buttons */}
            <div style={{ marginTop: '25px' }}>
              <div style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '10px' }}>
                Références de test :
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {exampleReferences.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReference(example.ref);
                      setTimeout(() => checkReference(), 100);
                    }}
                    style={{
                      padding: '10px 15px',
                      background: '#e2e8f0',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#cbd5e1'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  >
                    {example.ref}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && result.status === 'success' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                background: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '15px',
                padding: '35px',
                marginBottom: '30px'
              }}>
                {/* Status Header */}
                {(() => {
                  const statusInfo = translateStatus(result.data.status);
                  return (
                    <div style={{
                      background: statusInfo.bgColor,
                      border: `2px solid ${statusInfo.color}`,
                      borderRadius: '12px',
                      padding: '25px',
                      marginBottom: '30px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                        {statusInfo.text.split(' ')[0]}
                      </div>
                      <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: statusInfo.color,
                        marginBottom: '10px'
                      }}>
                        {statusInfo.text.substring(statusInfo.text.indexOf(' ') + 1)}
                      </div>
                      <div style={{ color: '#475569', fontSize: '1.1rem' }}>
                        {statusInfo.description}
                      </div>
                      
                      {/* Timestamp */}
                      <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#64748b'
                      }}>
                        ⏱️ Dernière vérification : {new Date().toLocaleTimeString('fr-FR')}
                      </div>
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
                  <DetailCard 
                    icon="📋" 
                    label="Référence" 
                    value={result.data.reference}
                  />
                  <DetailCard 
                    icon="👤" 
                    label="Titre" 
                    value={result.data.title || 'Non spécifié'}
                  />
                  <DetailCard 
                    icon="🏢" 
                    label="Entreprise" 
                    value={result.data.company || 'Non spécifiée'}
                  />
                  <DetailCard 
                    icon="📍" 
                    label="Localisation" 
                    value={result.data.location || 'Non spécifiée'}
                  />
                  {result.data.salary && (
                    <DetailCard 
                      icon="💰" 
                      label="Salaire" 
                      value={result.data.salary}
                    />
                  )}
                  {result.data.created_at && (
                    <DetailCard 
                      icon="📅" 
                      label="Créé le" 
                      value={new Date(result.data.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    />
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
                    onClick={refreshData}
                    style={{
                      padding: '15px 30px',
                      background: '#3b82f6',
                      color: 'white',
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
                    🔄 Actualiser les données
                  </button>
                  
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
                    🔍 Nouvelle recherche
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && result?.status === 'error' && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '15px',
              padding: '40px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#ef4444' }}>
                ❌
              </div>
              <h2 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>
                Contrat Non Trouvé
              </h2>
              <p style={{ margin: '0 0 25px 0', color: '#991b1b', fontSize: '1.1rem' }}>
                {error}
              </p>
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
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '25px 30px',
          background: '#1e293b',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
            © {new Date().getFullYear()} Emploseek • Données en temps réel
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', opacity: '0.6' }}>
            Mise à jour instantanée • Pas de cache • Support technique
          </div>
        </div>
      </div>

      {/* Component pour les cartes de détails */}
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

// Composant pour les cartes de détails
function DetailCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '5px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b' }}>
        {value}
      </div>
    </div>
  );
}
