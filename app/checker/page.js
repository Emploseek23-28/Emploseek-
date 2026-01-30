'use client';
import { useState } from 'react';

export default function CheckerPage() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkReference = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/check/${reference}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: 'error', 
        message: 'Erreur de connexion au serveur' 
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#0070f3' }}>🔍 Vérificateur d'offres Emploseek</h1>
      <p>Vérifiez la validité d'une offre d'emploi avec son code de référence</p>
      
      <form onSubmit={checkReference} style={{ margin: '30px 0' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ex: DEV001, MKT001, etc."
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            style={{ 
              padding: '12px',
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: result.status === 'success' ? '#f0fff0' : '#fff0f0',
          border: `2px solid ${result.status === 'success' ? '#00cc00' : '#ff3333'}`,
          borderRadius: '8px'
        }}>
          {result.status === 'success' ? (
            <>
              <h2 style={{ color: '#00cc00', marginTop: 0 }}>✅ OFFRE VALIDE</h2>
              <div style={{ marginTop: '15px' }}>
                <p><strong>Référence :</strong> {result.data.reference}</p>
                <p><strong>Titre du poste :</strong> {result.data.title}</p>
                <p><strong>Entreprise :</strong> {result.data.company}</p>
                <p><strong>Lieu :</strong> {result.data.location}</p>
                <p><strong>Salaire :</strong> {result.data.salary}</p>
                <p>
                  <strong>Statut :</strong> 
                  <span style={{ 
                    color: result.data.status === 'published' ? 'green' : 'orange',
                    fontWeight: 'bold',
                    marginLeft: '10px'
                  }}>
                    {result.data.status === 'published' ? 'PUBLIÉE' : 'EN ATTENTE'}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ color: '#ff3333', marginTop: 0 }}>❌ RÉFÉRENCE INVALIDE</h2>
              <p>La référence <strong>{result.reference || reference}</strong> n'a pas été trouvée.</p>
              <p>Veuillez vérifier le code et réessayer.</p>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Exemples de références à tester :</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <a href="/api/check/DEV001" style={{ color: '#0070f3', textDecoration: 'none' }}>
              🔗 DEV001 - Développeur FullStack (publiée)
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a href="/api/check/DEV002" style={{ color: '#0070f3', textDecoration: 'none' }}>
              🔗 DEV002 - Développeur Frontend (en attente)
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a href="/api/check/MKT001" style={{ color: '#0070f3', textDecoration: 'none' }}>
              🔗 MKT001 - Marketing Manager (publiée)
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a href="/api/check/ABC123" style={{ color: '#0070f3', textDecoration: 'none' }}>
              🔗 ABC123 - Référence inexistante (test d'erreur)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
