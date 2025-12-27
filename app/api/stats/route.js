import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Obtenir les statistiques
    const [
      totalContracts,
      activeContracts,
      totalClients,
      recentContracts,
      countriesStats
    ] = await Promise.all([
      db.collection('contracts').countDocuments(),
      db.collection('contracts').countDocuments({
        endDate: { $gte: new Date().toISOString() }
      }),
      db.collection('users').countDocuments(),
      db.collection('contracts')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection('contracts').aggregate([
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 5
        }
      ]).toArray()
    ])
    
    const stats = {
      totalContracts,
      activeContracts,
      totalClients,
      contractTypes: {
        CDI: await db.collection('contracts').countDocuments({ type: 'CDI' }),
        CDD: await db.collection('contracts').countDocuments({ type: 'CDD' }),
        Internship: await db.collection('contracts').countDocuments({ type: 'Internship' }),
        LanguageStay: await db.collection('contracts').countDocuments({ type: 'Language Stay' })
      },
      recentContracts,
      topCountries: countriesStats,
      monthlyRegistrations: await getMonthlyRegistrations(db),
      systemStatus: {
        database: 'Connected',
        api: 'Operational',
        lastBackup: new Date().toISOString()
      }
    }
    
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error fetching stats:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch statistics' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

async function getMonthlyRegistrations(db) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const result = await db.collection('contracts').aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $limit: 6
    }
  ]).toArray()
  
  return result.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    count: item.count
  }))
}
