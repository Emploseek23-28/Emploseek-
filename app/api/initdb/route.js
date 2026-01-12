import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    // Utilise l'URI SANS nom de base d'abord
    const baseUri = 'mongodb+srv://emploseek_admin:Admin123456@emploseek-cluster.gng4ygz.mongodb.net/?appName=emploseek-cluster'
    
    const client = new MongoClient(baseUri)
    await client.connect()
    
    // 1. Vérifier les bases existantes
    const adminDb = client.db().admin()
    const databases = await adminDb.listDatabases()
    
    console.log('Existing databases:', databases.databases.map(d => d.name))
    
    // 2. Créer la base 'emploseek' si elle n'existe pas
    if (!databases.databases.some(db => db.name === 'emploseek')) {
      console.log('Creating emploseek database...')
      
      // Créer la base en créant une collection
      const newDb = client.db('emploseek')
      await newDb.createCollection('init')
      await newDb.collection('init').insertOne({ 
        initialized: true, 
        timestamp: new Date() 
      })
      
      // Créer les collections principales
      await newDb.createCollection('users')
      await newDb.createCollection('contracts')
      await newDb.createCollection('verifications')
      
      console.log('✅ Database emploseek created with 3 collections')
    }
    
    // 3. Maintenant connecter à emploseek
    const db = client.db('emploseek')
    const collections = await db.listCollections().toArray()
    
    await client.close()
    
    return Response.json({
      success: true,
      message: 'Database initialized successfully',
      database: 'emploseek',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      help: 'Check MongoDB credentials and network access',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
