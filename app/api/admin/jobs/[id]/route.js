import { query } from '@/lib/neon-db';

// PUT: Modifier une offre
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    console.log(`🔄 Mise à jour offre ID ${id}:`, data);
    
    const { reference, title, company, location, salary, status } = data;
    
    // METTRE À JOUR AVEC TIMESTAMP ACTUEL
    const result = await query(
      `UPDATE jobs 
       SET reference = $1, title = $2, company = $3, 
           location = $4, salary = $5, status = $6,
           updated_at = NOW()  -- FORCER LA MISE À JOUR DU TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [reference, title, company, location, salary, status, id]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Offre ID ${id} non trouvée pour mise à jour`);
      return Response.json(
        { status: 'error', message: 'Offre non trouvée' },
        { status: 404 }
      );
    }
    
    const updatedJob = result.rows[0];
    console.log(`✅ Offre ${updatedJob.reference} mise à jour. Nouveau statut: ${updatedJob.status}`);
    
    return Response.json({
      status: 'success',
      message: 'Offre mise à jour',
      data: updatedJob,
      timestamp: new Date().toISOString()
    }, {
      // HEADERS POUR ÉVITER LE CACHE
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour:', error);
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer une offre
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    console.log(`🗑️ Suppression offre ID ${id}`);
    
    const result = await query(
      'DELETE FROM jobs WHERE id = $1 RETURNING id, reference',
      [id]
    );
    
    if (result.rows.length === 0) {
      return Response.json(
        { status: 'error', message: 'Offre non trouvée' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Offre ${result.rows[0].reference} supprimée`);
    
    return Response.json({
      status: 'success',
      message: 'Offre supprimée',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erreur suppression:', error);
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
