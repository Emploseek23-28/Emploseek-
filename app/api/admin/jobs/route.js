import { query } from '@/lib/neon-db';

// GET: Récupérer toutes les offres
export async function GET() {
  try {
    console.log('Admin API: Fetching all jobs');
    
    // Version SANS updated_at
    const result = await query(`
      SELECT id, reference, title, company, location, salary, status, 
             created_at 
      FROM jobs 
      ORDER BY created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} jobs`);
    
    return Response.json({
      status: 'success',
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Admin API Error:', error);
    return Response.json(
      { 
        status: 'error', 
        message: error.message
      },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle offre
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Admin API: Creating job:', data);
    
    const { reference, title, company, location, salary, status } = data;
    
    // Validation
    if (!reference || !title) {
      return Response.json(
        { status: 'error', message: 'Reference et titre requis' },
        { status: 400 }
      );
    }
    
    // Version SANS updated_at dans l'INSERT
    const result = await query(
      `INSERT INTO jobs (reference, title, company, location, salary, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, reference, title, company, location, salary, status, created_at`,
      [reference, title, company, location, salary, status || 'active']
    );
    
    console.log('Job created:', result.rows[0]);
    
    return Response.json({
      status: 'success',
      message: 'Offre créée',
      data: result.rows[0]
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create job error:', error);
    
    if (error.code === '23505') { // Doublon référence
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
