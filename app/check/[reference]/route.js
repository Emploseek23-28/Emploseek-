import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    // Essayer la base de données réelle
    let result;
    try {
      result = await query(
        'SELECT reference, title, company, location, salary, status FROM jobs WHERE reference = $1',
        [reference]
      );
    } catch (dbError) {
      console.log('Database not ready, using mock data:', dbError.message);
      
      // Fallback: données mockées
      const mockJobs = {
        'DEV001': {
          reference: 'DEV001',
          title: 'Développeur FullStack',
          company: 'TechCorp',
          location: 'Paris',
          salary: '45-55k€',
          status: 'published',
          source: 'mock'
        },
        'DEV002': {
          reference: 'DEV002',
          title: 'Développeur Frontend',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '50-60k€',
          status: 'pending',
          source: 'mock'
        }
      };
      
      const job = mockJobs[reference];
      
      if (!job) {
        return Response.json(
          {
            status: 'error',
            message: 'Référence non trouvée',
            reference: reference
          },
          { status: 404 }
        );
      }
      
      return Response.json({
        status: 'success',
        data: job,
        source: 'mock'
      });
    }
    
    // Si on arrive ici, la base de données a répondu
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
    
    return Response.json({
      status: 'success',
      data: result.rows[0],
      source: 'database'
    });
    
  } catch (error) {
    console.error('API Error:', error);
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
