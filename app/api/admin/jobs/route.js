import { query } from '@/lib/neon-db';

// GET: Récupérer TOUTES les offres (pour l'admin)
export async function GET(request) {
  try {
    // ICI: Ajouter une vérification d'authentification admin plus tard
    
    const result = await query(`
      SELECT id, reference, title, company, location, salary, status, 
             created_at, updated_at 
      FROM jobs 
      ORDER BY created_at DESC
    `);
    
    return Response.json({
      status: 'success',
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Admin API Error:', error);
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle offre
export async function POST(request) {
  try {
    const data = await request.json();
    
    const { reference, title, company, location, salary, status } = data;
    
    // Validation basique
    if (!reference || !title) {
      return Response.json(
        { status: 'error', message: 'Reference et titre requis' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO jobs (reference, title, company, location, salary, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, reference, title`,
      [reference, title, company, location, salary, status || 'active']
    );
    
    return Response.json({
      status: 'success',
      message: 'Offre créée',
      data: result.rows[0]
    }, { status: 201 });
    
  } catch (error) {
    // Gérer les doublons de référence
    if (error.code === '23505') { // Code d'erreur PostgreSQL pour unique violation
      return Response.json(
        { status: 'error', message: 'Cette référence existe déjà' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
