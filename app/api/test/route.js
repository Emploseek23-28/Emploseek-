export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'API fonctionne',
    timestamp: new Date().toISOString()
  });
}
