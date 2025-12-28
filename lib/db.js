// Simple database connection
export async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  return client.db('emploseek')
}
