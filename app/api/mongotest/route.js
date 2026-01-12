import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    // TESTS avec différentes URI
    const testUris = [
      // Ton URI de base
      'mongodb+srv://emploseek_admin:Roqma@2823#@emploseek-cluster.gng4ygz.mongodb.net/?appName=emploseek-cluster',
      
      // Avec database
      'mongodb+srv://emploseek_admin:Roqma@2823#@emploseek-cluster.gng4ygz.mongodb.net/emploseek?appName=emploseek-cluster',
      
      // Simple
      'mongodb+srv://emploseek_admin:Roqma@2823#@emploseek-cluster.gng4ygz.mongodb.net/emploseek',
      
      // De Vercel env
      process.env.MONGODB_URI
    ]
    
    const results = []
    
    for (const uri of testUris) {
      if (!uri) continue
      
      try {
        console.log(`Testing URI: ${uri.substring(0, 50)}...`)
        
        const client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 5000
        })
        
        await client.connect()
        
        // Vérifier quelle base est disponible
        const adminDb = client.db().admin()
        const dbList = await adminDb.listDatabases()
        
        // Essayer 'emploseek' ou la première base disponible
        let dbName = 'emploseek'
        if (!dbList.databases.some(db => db.name === 'emploseek')) {
          dbName = dbList.databases[0]?.name || 'admin'
        }
        
        const db = client.db(dbName)
        await db.command({ ping: 1 })
        
        // Lister les collections
        const collections = await db.listCollections().toArray()
        
        await client.close()
        
        results.push({
          uri: uri.substring(0, 30) + '...',
          success: true,
          database: dbName,
          collections: collections.map(c => c.name),
          availableDatabases: dbList.databases.map(d => d.name)
        })
        
      } catch (error) {
        results.push({
          uri: uri.substring(0, 30) + '...',
          success: false,
          error: error.message
        })
      }
    }
    
    return Response.json({
      timestamp: new Date().toISOString(),
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Not set',
        length: process.env.MONGODB_URI?.length || 0
      },
      testResults: results,
      recommendation: 'Use the second URI with /emploseek'
    })
    
  } catch (error) {
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
