export async function GET() {
  return Response.json({
    status: 'success',
    message: 'API Emploseek fonctionne',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
}
