// SUPPRESSION CORRIGÉE
const deleteJob = async (id, reference) => {
  if (!confirm(`VRAIMENT supprimer l'offre ${reference} ? Cette action est irréversible.`)) {
    return;
  }
  
  try {
    console.log('Tentative suppression ID:', id);
    
    const response = await fetch(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Réponse suppression:', data);
    
    if (data.status === 'success') {
      alert(`✅ Offre ${reference} supprimée avec succès !`);
      // Recharger la liste
      fetchJobs();
    } else {
      alert(`❌ Erreur: ${data.message}`);
    }
    
  } catch (error) {
    console.error('Erreur suppression:', error);
    alert('❌ Erreur de connexion au serveur');
  }
};
