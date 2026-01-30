export async function GET(request, { params }) {
  const { reference } = params;
  
  // Simulation de données pour tester
  const mockData = {
    'DEV001': { 
      status: 'published', 
      title: 'Développeur FullStack',
      company: 'TechCorp',
      location: 'Paris'
    },
    'DEV002': { 
      status: 'pending', 
      title: 'Développeur Frontend',
      company: 'StartupXYZ',
      location: 'Remote'
    }
  };
  
  const job = mockData[reference];
  
  if (!job) {
    return Response.json(
      { status: 'error', message: 'Référence introuvable' },
      { status: 404 }
    );
  }
  
  return Response.json({
    status: 'success',
    reference: reference,
    data: job
  });
}
