import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const [
      totalContracts,
      activeContracts,
      totalClients,
      recentContracts
    ] = await Promise.all([
      db.collection('contracts').countDocuments(),
      db.collection('contracts').countDocuments({
        status: 'active',
        endDate: { $gte: new Date().toISOString() }
      }),
      db.collection('users').countDocuments(),
      db.collection('contracts')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
    ])
    
    const stats = {
      totalContracts,
      activeContracts,
      totalClients,
      recentContracts,
      updatedAt: new Date().toISOString()
    }
    
    return Response.json(stats, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}
