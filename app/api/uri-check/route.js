export async function GET() {
  const uri = process.env.MONGODB_URI
  
  return Response.json({
    uri_exists: !!uri,
    uri_preview: uri ? uri.substring(0, 50) + '...' : 'none',
    uri_length: uri ? uri.length : 0,
    analysis: {
      starts_with_mongodb: uri ? uri.startsWith('mongodb') : false,
      has_srv: uri ? uri.includes('mongodb+srv://') : false,
      has_username: uri ? uri.includes('emploseek_admin') : false,
      has_password: uri ? uri.includes('Admin123456') : false,
      has_hostname: uri ? uri.includes('.mongodb.net') : false,
      has_database: uri ? uri.split('/').length >= 4 : false,
      database_name: uri ? (uri.split('/').length >= 4 ? uri.split('/')[3].split('?')[0] : 'none') : 'none',
      has_query_params: uri ? uri.includes('?') : false
    },
    error_message: !uri ? 'URI is not set' :
                   !uri.includes('.mongodb.net') ? 'Missing hostname' :
                   uri.split('/').length < 4 ? 'Missing database name' : 'URI looks OK',
    timestamp: new Date().toISOString()
  })
}
