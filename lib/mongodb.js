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
  // En développement, utilise une variable globale pour préserver la connexion
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En production, crée une nouvelle connexion
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db('emploseek')
    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default clientPromise
