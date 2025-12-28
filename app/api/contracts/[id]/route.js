import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Créer les collections si elles n'existent pas (AUTO-CRÉATION)
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users')
      await db.collection('users').createIndex({ email: 1 }, { unique: true })
      console.log('Collection users créée')
    }
    
    if (!collectionNames.includes('contracts')) {
      await db.createCollection('contracts')
      await db.collection('contracts').createIndex({ reference: 1 }, { unique: true })
      await db.collection('contracts').createIndex({ clientId: 1 })
      console.log('Collection contracts créée')
    }
    
    if (!collectionNames.includes('verifications')) {
      await db.createCollection('verifications')
      console.log('Collection verifications créée')
    }
    
    // Maintenant, récupérer les contrats
    const contracts = await db.collection('contracts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return Response.json(contracts, { status: 200 })
    
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}
