import { query } from '@/lib/neon-db';

// PUT: Modifier une offre
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const { reference, title, company, location, salary, status } = data;
    
    // Version SANS updated_at dans le UPDATE (si colonne n'existe pas)
    const result = await query(
      `UPDATE jobs 
       SET reference = $1, title = $2, company = $3, 
           location = $4, salary = $5, status = $6
       WHERE id = $7 
       RETURNING *`,
      [reference, title, company, location, salary, status, id]
    );
    
    if (result.rows.length === 0) {
      return Response.json(
        { status: 'error', message: 'Offre non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json({
      status: 'success',
      message: 'Offre mise à jour',
      data: result.rows[0]
    });
    
  } catch (error) {
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
    
    return Response.json({
      status: 'success',
      message: 'Offre supprimée',
      data: result.rows[0]
    });
    
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
