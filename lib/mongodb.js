import { MongoClient } from 'mongodb'

// Fonction SIMPLE et ROBUSTE
export async function connectToDatabase() {
  try {
    // 1. Récupérer l'URI depuis l'environnement
    const uri = process.env.MONGODB_URI
    
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in environment variables')
      throw new Error('MongoDB connection string is not configured')
    }
    
    console.log('🔗 MongoDB URI detected, length:', uri.length)
    
    // 2. Validation basique
    if (!uri.includes('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format')
      throw new Error('Invalid MongoDB URI. Must start with mongodb+srv://')
    }
    
    if (!uri.includes('.mongodb.net')) {
      console.error('❌ Missing MongoDB hostname')
      throw new Error('MongoDB URI must include hostname (mongodb.net)')
    }
    
    // 3. Extraire le nom de la base
    const urlParts = uri.split('/')
    let dbName = 'emploseek' // par défaut
    
    if (urlParts.length >= 4) {
      dbName = urlParts[3].split('?')[0] || 'emploseek'
    } else {
      console.warn('⚠️ No database name in URI, using default: emploseek')
    }
    
    // 4. Se connecter
    console.log(`🔗 Connecting to MongoDB: ${uri.substring(0, 40)}...`)
    console.log(`📁 Using database: ${dbName}`)
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    })
    
    await client.connect()
    
    const db = client.db(dbName)
    
    console.log('✅ MongoDB connected successfully!')
    return { client, db }
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', {
      message: error.message,
      stack: error.stack
    })
    throw new Error(`Database connection failed: ${error.message}`)
  }
}
