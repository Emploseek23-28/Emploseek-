import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    console.log('Recherche référence:', reference); // Pour debug
    
    // 1. Chercher dans la table 'jobs' (pas 'job_offers')
    const result = await query(
      'SELECT * FROM jobs WHERE reference = $1',
      [reference]
    );
    
    // 2. Vérifier le résultat
    console.log('Résultat:', result.rows); // Pour debug
    
    if (result.rows.length === 0) {
      return Response.json(
        { 
          status: 'error',
          message: 'Référence non trouvée',
          reference: reference
        },
        { status: 404 }
      );
    }
    
    // 3. Retourner les données
    return Response.json({
      status: 'success',
      data: result.rows[0],
      source: 'database'
    });
    
  } catch (error) {
    console.error('Erreur API:', error);
    return Response.json(
      { 
        status: 'error',
        message: 'Erreur serveur',
        details: error.message
      },
      { status: 500 }
    );
  }
}
