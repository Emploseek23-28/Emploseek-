export async function GET() {
  // Liste toutes les variables d'environnement (sans valeurs sensibles)
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    MONGODB_URI_SET: !!process.env.MONGODB_URI,
    MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
    MONGODB_URI_PREVIEW: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 30) + '...' : 'Not set',
    ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
  }
  
  return Response.json({
    status: 'debug',
    environment: env,
    issues: [
      !process.env.MONGODB_URI ? '❌ MONGODB_URI is not set' : '✅ MONGODB_URI is set',
      process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('.mongodb.net/') ? 
        '❌ MONGODB_URI missing database' : '✅ URI format OK',
    ],
    timestamp: new Date().toISOString(),
    help: 'Check Vercel Environment Variables and ensure MONGODB_URI is correctly set'
  })
}
