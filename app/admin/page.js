'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setJobs(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteJob = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    
    const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    const data = await res.json();
    
    if (data.status === 'success') {
      alert('Supprimé !');
      // Recharger
      window.location.reload();
    } else {
      alert('Erreur: ' + data.message);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Chargement...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin Dashboard</h1>
      <p>Total: {jobs.length} offre(s)</p>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Référence</th>
            <th style={{ padding: '10px' }}>Titre</th>
            <th style={{ padding: '10px' }}>Entreprise</th>
            <th style={{ padding: '10px' }}>Statut</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td style={{ padding: '10px' }}>{job.id}</td>
              <td style={{ padding: '10px' }}><strong>{job.reference}</strong></td>
              <td style={{ padding: '10px' }}>{job.title}</td>
              <td style={{ padding: '10px' }}>{job.company}</td>
              <td style={{ padding: '10px' }}>{job.status}</td>
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => deleteJob(job.id)}
                  style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none' }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {jobs.length === 0 && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
          Aucune offre dans la base de données
        </div>
      )}
    </div>
  );
}
