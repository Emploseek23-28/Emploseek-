export async function GET(request, { params }) {
  const { reference } = params;
  
  // Données mockées pour tester - SIMPLE
  const mockJobs = {
    'DEV001': {
      id: 1,
      reference: 'DEV001',
      title: 'Développeur FullStack',
      company: 'TechCorp',
      location: 'Paris',
      salary: '45-55k€',
      status: 'published'
    },
    'DEV002': {
      id: 2,
      reference: 'DEV002',
      title: 'Développeur Frontend',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '50-60k€',
      status: 'pending'
    },
    'MKT001': {
      id: 3,
      reference: 'MKT001',
      title: 'Marketing Manager',
      company: 'MarketingPro',
      location: 'Lyon',
      salary: '40-50k€',
      status: 'published'
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
    data: job
  });
}
