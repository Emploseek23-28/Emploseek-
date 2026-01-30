'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Nouvelle offre
  const [newJob, setNewJob] = useState({
    reference: '',
    title: '',
    company: '',
    location: '',
    salary: '',
    status: 'active',
    description: '',
    requirements: ''
  });

  // Vérifier l'authentification
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  // Charger les offres
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/jobs');
      const data = await response.json();
      if (data.status === 'success') {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // CRÉER une nouvelle offre
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        alert('✅ Offre créée avec succès !');
        setShowCreateForm(false);
        setNewJob({
          reference: '',
          title: '',
          company: '',
          location: '',
          salary: '',
          status: 'active',
          description: '',
          requirements: ''
        });
        fetchJobs();
      } else {
        alert('❌ Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  // MODIFIER le statut d'une offre
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Récupérer l'offre actuelle
      const currentJob = jobs.find(job => job.id === id);
      if (!currentJob) return;
      
      const updatedJob = { ...currentJob, status: newStatus };
      
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        alert('✅ Statut mis à jour !');
        fetchJobs();
      } else {
        alert('❌ Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  // SUPPRIMER une offre
  const handleDeleteJob = async (id, reference) => {
    if (!confirm(`⚠️ Supprimer définitivement l'offre "${reference}" ?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        alert('✅ Offre supprimée !');
        fetchJobs();
      } else {
        alert('❌ Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  // Filtrer les offres
  const filteredJobs = jobs.filter(job =>
    job.reference.toLowerCase().includes(search.toLowerCase()) ||
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Chargement...</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* En-tête */}
      <header style={{
        background: 'white',
        padding: '20px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#4f46e5' }}>🏢 Dashboard Admin</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Connecté en tant que: <strong>Roqma</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚪 Déconnexion
        </button>
      </header>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Barre d'outils */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="🔍 Rechercher par référence, titre ou entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                padding: '12px 25px',
                background: showCreateForm ? '#6b7280' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {showCreateForm ? '✕ Annuler' : '➕ Nouvelle offre'}
            </button>
          </div>

          {/* Statistiques */}
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4f46e5' }}>
                {jobs.length}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Total offres</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                {jobs.filter(j => j.status === 'active').length}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Actives</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                {jobs.filter(j => j.status === 'published').length}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Publiées</div>
            </div>
          </div>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '25px' }}>📝 Créer une nouvelle offre</h2>
            
            <form onSubmit={handleCreateJob}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Référence *
                  </label>
                  <input
                    type="text"
                    value={newJob.reference}
                    onChange={(e) => setNewJob({...newJob, reference: e.target.value.toUpperCase()})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="TW238, DEV001, etc."
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Statut initial
                  </label>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({...newJob, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="published">Publiée</option>
                    <option value="pending">En attente</option>
                    <option value="closed">Terminée</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Titre du poste *
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                  placeholder="Agent traveler, Développeur, etc."
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    placeholder="Ville, Pays, ou Remote"
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Salaire
                </label>
                <input
                  type="text"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                  placeholder="3K€/M, 45-55k€, etc."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 30px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Créer l'offre
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '12px 30px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tableau des offres */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Référence</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Titre / Client</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Entreprise</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Localisation</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Salaire</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Statut</th>
                <th style={{ padding: '18px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                      {job.reference}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      ID: {job.id}
                    </div>
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: '500' }}>{job.title}</div>
                    {job.description && (
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {job.description.substring(0, 60)}...
                      </div>
                    )}
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    {job.company || '-'}
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    {job.location || '-'}
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    {job.salary || '-'}
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    <select
                      value={job.status}
                      onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: 
                          job.status === 'active' ? '#f0fdf4' :
                          job.status === 'published' ? '#eff6ff' :
                          job.status === 'pending' ? '#fffbeb' : '#f1f5f9',
                        color: 
                          job.status === 'active' ? '#166534' :
                          job.status === 'published' : '#1e40af' :
                          job.status === 'pending' ? '#92400e' : '#475569',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="published">Publiée</option>
                      <option value="pending">En attente</option>
                      <option value="closed">Terminée</option>
                    </select>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {new Date(job.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  
                  <td style={{ padding: '18px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateStatus(job.id, 
                          job.status === 'published' ? 'active' : 'published'
                        )}
                        style={{
                          padding: '8px 12px',
                          background: job.status === 'published' ? '#f1f5f9' : '#3b82f6',
                          color: job.status === 'published' ? '#475569' : 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {job.status === 'published' ? '👁️ Masquer' : '👁️ Publier'}
                      </button>
                      
                      <a
                        href={`/api/check/${job.reference}`}
                        target="_blank"
                        style={{
                          padding: '8px 12px',
                          background: '#10b981',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          textAlign: 'center',
                          display: 'block'
                        }}
                      >
                        🌐 Voir publique
                      </a>
                      
                      <button
                        onClick={() => handleDeleteJob(job.id, job.reference)}
                        style={{
                          padding: '8px 12px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
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
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#475569' }}>
                {jobs.length === 0 ? 'Aucune offre créée' : 'Aucun résultat'}
              </h3>
              <p style={{ margin: 0 }}>
                {jobs.length === 0 
                  ? 'Commencez par créer votre première offre' 
                  : 'Essayez une autre recherche'}
              </p>
            </div>
          )}
        </div>
        
        {/* Pied de page */}
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '14px'
        }}>
          <p>© 2024 Emploseek Admin - {jobs.length} offre(s) en base de données</p>
          <p style={{ marginTop: '10px' }}>
            <a 
              href="/checker" 
              target="_blank"
              style={{ color: '#4f46e5', textDecoration: 'none' }}
            >
              👉 Voir le vérificateur public
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
