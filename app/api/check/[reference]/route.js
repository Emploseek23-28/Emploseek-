import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    console.log(`🔍 API Check appelée pour: ${reference} à ${new Date().toISOString()}`);
    
    const result = await query(
      'SELECT id, reference, title, company, location, salary, status, created_at FROM jobs WHERE reference = $1',
      [reference]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Référence non trouvée: ${reference}`);
      return Response.json(
        { 
          status: 'error', 
          message: 'Référence non trouvée',
          reference: reference 
        },
        { 
          status: 404,
          // HEADERS ANTI-CACHE
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );
    }
    
    const job = result.rows[0];
    console.log(`✅ Référence trouvée: ${reference}, Statut: ${job.status}`);
    
    // RÉPONSE AVEC HEADERS ANTI-CACHE
    return Response.json({
      status: 'success',
      data: job,
      timestamp: new Date().toISOString(),
      cache: 'disabled'
    }, {
      // HEADERS CRITIQUES POUR ÉVITER LE CACHE
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'Vary': '*',
        'Last-Modified': new Date().toUTCString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur API Check:', error);
    return Response.json(
      { 
        status: 'error', 
        message: 'Erreur serveur',
        details: error.message 
      },
      { 
        status: 500,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }
}
