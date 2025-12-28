// Fichier: lib/mongodb.js à la RACINE du projet
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = 'emploseek'

if (!MONGODB_URI) {
  throw new Error('Define the MONGODB_URI environmental variable')
}

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  // Check the cache
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  // Set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI, opts)
  await client.connect()
  let db = client.db(MONGODB_DB)

  // Set cache
  cachedClient = client
  cachedDb = db

  return {
    client: cachedClient,
    db: cachedDb,
  }
}
