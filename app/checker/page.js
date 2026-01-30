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
        message: 'Erreur de connexion' 
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🔍 Vérificateur Emploseek</h1>
      <p>Entrez une référence d'offre (ex: DEV001)</p>
      
      <form onSubmit={checkReference}>
        <input
          type="text"
          placeholder="Référence..."
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          style={{ padding: '10px', width: '200px', marginRight: '10px' }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}
        >
          {loading ? 'Vérification...' : 'Vérifier'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: result.status === 'success' ? '#e6ffe6' : '#ffe6e6' }}>
          {result.status === 'success' ? (
            <>
              <h3>✅ Offre trouvée</h3>
              <p><strong>Titre :</strong> {result.data.title}</p>
              <p><strong>Entreprise :</strong> {result.data.company}</p>
              <p><strong>Statut :</strong> {result.data.status}</p>
            </>
          ) : (
            <>
              <h3>❌ Non trouvée</h3>
              <p>{result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
