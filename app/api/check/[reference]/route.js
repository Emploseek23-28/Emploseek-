import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    console.log('=== API CALL START ===');
    console.log('Reference:', params.reference);
    console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
    
    const { reference } = params;
    
    // Test simple d'abord
    const testQuery = await query('SELECT NOW() as current_time');
    console.log('Database time:', testQuery.rows[0].current_time);
    
    // Chercher l'offre
    const result = await query(
      'SELECT * FROM jobs WHERE reference = $1',
      [reference]
    );
    
    console.log('Found rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('Reference not found');
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
    console.log('Job found:', job);
    
    return Response.json({
      status: 'success',
      data: job,
      tested_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return Response.json(
      { 
        status: 'error',
        message: 'Erreur serveur',
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
