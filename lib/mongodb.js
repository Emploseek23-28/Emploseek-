import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db('emploseek')
    
    // Créer les collections si elles n'existent pas
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users')
      await db.collection('users').createIndex({ email: 1 }, { unique: true })
      console.log('✅ Collection users créée')
    }
    
    if (!collectionNames.includes('contracts')) {
      await db.createCollection('contracts')
      await db.collection('contracts').createIndex({ reference: 1 }, { unique: true })
      await db.collection('contracts').createIndex({ clientId: 1 })
      console.log('✅ Collection contracts créée')
    }
    
    if (!collectionNames.includes('verifications')) {
      await db.createCollection('verifications')
      await db.collection('verifications').createIndex({ reference: 1 })
      console.log('✅ Collection verifications créée')
    }
    
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export default clientPromise
