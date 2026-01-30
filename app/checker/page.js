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
      setResult({ status: 'error', message: 'Erreur de connexion' });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>✅ Vérificateur d'offres d'emploi</h1>
      <p>Entrez le code de référence reçu par email</p>
      
      <form onSubmit={checkReference}>
        <input
          type="text"
          placeholder="Ex: DEV001"
          value={reference}
          onChange={(e) => setReference(e.target.value.toUpperCase())}
          style={{ padding: '12px', width: '200px', fontSize: '16px', marginRight: '10px' }}
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
              <h2 style={{ color: '#00cc00' }}>✅ OFFRE VALIDE</h2>
              <div style={{ marginTop: '20px' }}>
                <p><strong>Référence :</strong> {result.data.reference}</p>
                <p><strong>Titre du poste :</strong> {result.data.title}</p>
                <p><strong>Entreprise :</strong> {result.data.company}</p>
                <p><strong>Lieu :</strong> {result.data.location}</p>
                <p><strong>Salaire :</strong> {result.data.salary}</p>
                <p><strong>Statut :</strong> 
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
              <h2 style={{ color: '#ff3333' }}>❌ RÉFÉRENCE INVALIDE</h2>
              <p>La référence <strong>{result.reference}</strong> n'a pas été trouvée.</p>
              <p>Vérifiez le code et réessayez.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
