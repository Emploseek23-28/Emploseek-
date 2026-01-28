import { query } from '@/lib/neon-db';

export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    const result = await query(
      'SELECT * FROM jobs WHERE reference = $1',
      [reference]
    );
    
    if (result.rows.length === 0) {
      return Response.json(
        { status: 'error', message: 'Not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      status: 'success',
      data: result.rows[0]
    });
    
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
