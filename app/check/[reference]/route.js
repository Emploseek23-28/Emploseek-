import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    // Test simple de connexion d'abord
    const testResult = await query('SELECT NOW() as time');
    console.log('Database time:', testResult.rows[0].time);
    
    // Chercher l'offre
    const result = await query(
      'SELECT * FROM jobs WHERE reference = $1',
      [reference]
    );
    
    if (result.rows.length === 0) {
      return Response.json(
        { 
          status: 'error',
          message: 'Référence introuvable',
          reference: reference
        },
        { status: 404 }
      );
    }
    
    const job = result.rows[0];
    
    return Response.json({
      status: 'success',
      data: job,
      tested_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return Response.json(
      { 
        status: 'error',
        message: 'Erreur serveur',
        error: error.message
      },
      { status: 500 }
    );
  }
}
