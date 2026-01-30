export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
}
