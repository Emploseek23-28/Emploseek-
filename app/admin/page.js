'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Charger les offres depuis l'API admin
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/jobs');
      const data = await response.json();
      
      if (data.status === 'success') {
        setJobs(data.data);
      } else {
        console.error('Erreur API:', data.message);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      // Fallback: testez si l'API existe
      console.log('Test URL: /api/admin/jobs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Supprimer une offre
  const deleteJob = async (id, reference) => {
    if (!confirm(`Supprimer l'offre ${reference} ?`)) return;
    
    try {
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        alert(`Offre ${reference} supprimée`);
        fetchJobs(); // Recharger
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Filtrer
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.reference.toLowerCase().includes(search.toLowerCase()) ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 Dashboard Admin - Emploseek</h1>
      
      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px' }}
        >
          <option value="all">Tous statuts</option>
          <option value="active">Active</option>
          <option value="published">Publiée</option>
          <option value="pending">En attente</option>
        </select>
        
        <a 
          href="/admin/create"
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
        >
          + Nouvelle offre
        </a>
        
        <button 
          onClick={fetchJobs}
          style={{ padding: '10px 20px', background: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '20px', background: '#e6f7ff', borderRadius: '8px' }}>
        <div>
          <h3 style={{ margin: 0 }}>{jobs.length}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total offres</p>
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{jobs.filter(j => j.status === 'active').length}</h3>
          <p style={{ margin: 0, color: '#666' }}>Actives</p>
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{jobs.filter(j => j.status === 'published').length}</h3>
          <p style={{ margin: 0, color: '#666' }}>Publiées</p>
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Chargement des offres...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Référence</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Titre</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Entreprise</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Localisation</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Salaire</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}><strong>{job.reference}</strong></td>
                  <td style={{ padding: '15px' }}>{job.title}</td>
                  <td style={{ padding: '15px' }}>{job.company}</td>
                  <td style={{ padding: '15px' }}>{job.location}</td>
                  <td style={{ padding: '15px' }}>{job.salary}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                      background: job.status === 'active' ? '#e6f7e6' : job.status === 'published' ? '#e6f0ff' : '#fff4e6',
                      color: job.status === 'active' ? '#00a000' : job.status === 'published' ? '#0066cc' : '#cc8400'
                    }}>
                      {job.status === 'active' ? 'ACTIVE' : job.status === 'published' ? 'PUBLIÉE' : 'EN ATTENTE'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a 
                        href={`/admin/edit/${job.id}`}
                        style={{ padding: '5px 10px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
                      >
                        ✏️ Modifier
                      </a>
                      <a 
                        href={`/api/check/${job.reference}`}
                        target="_blank"
                        style={{ padding: '5px 10px', background: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
                      >
                        👁️ Voir API
                      </a>
                      <button 
                        onClick={() => deleteJob(job.id, job.reference)}
                        style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredJobs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {jobs.length === 0 ? 'Aucune offre dans la base de données' : 'Aucun résultat'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
