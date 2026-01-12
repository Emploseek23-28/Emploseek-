// API TEST pour MongoDB
export async function GET() {
  try {
    // Test simple sans MongoDB d'abord
    return Response.json({
      status: 'API working',
      mongodb: process.env.MONGODB_URI ? 'URI is set' : 'URI NOT SET',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return Response.json({
      error: error.message
    }, { status: 500 })
  }
}
