export async function GET() {
  return Response.json({
    status: 'healthy',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}
