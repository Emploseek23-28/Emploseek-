export async function GET(request, { params }) {
  try {
    const { reference } = params;
    
    // Pour l'instant, retournez une réponse simple
    return Response.json({
      status: 'success',
      reference: reference,
      message: 'API endpoint working',
      note: 'Database connection will be added next'
    });
    
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
