// Fichier: lib/mongodb.js
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

// Fonction SIMPLE sans erreur
export async function connectToDatabase() {
  try {
    console.log('🔗 Tentative de connexion MongoDB...')
    console.log('URI:', MONGODB_URI ? 'Set' : 'Not set')
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 secondes timeout
      socketTimeoutMS: 45000,
    })
    
    await client.connect()
    console.log('✅ MongoDB connected!')
    
    const db = client.db('emploseek')
    return { client, db }
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    // Retourne une erreur propre
    throw new Error(`MongoDB connection failed: ${error.message}`)
  }
}
