import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Récupérer tous les contrats avec les infos client
    const contracts = await db.collection('contracts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    // Pour chaque contrat, récupérer les infos client
    const contractsWithClient = await Promise.all(
      contracts.map(async (contract) => {
        const client = await db.collection('users').findOne({
          _id: contract.clientId
        })
        
        return {
          ...contract,
          client: client ? {
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email
          } : null
        }
      })
    )
    
    return Response.json(contractsWithClient, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Validation
    if (!data.clientId || !data.company || !data.country) {
      return Response.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }
    
    // Générer une référence unique
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await db.collection('contracts').countDocuments()
    const referenceNumber = String(count + 1).padStart(4, '0')
    
    let prefix = 'EMP'
    if (data.type === 'Internship') prefix = 'INT'
    if (data.type === 'Language Stay') prefix = 'LANG'
    if (data.type === 'CDD') prefix = 'TEMP'
    
    const reference = `${prefix}${year}${month}${referenceNumber}`
    
    // Créer le contrat
    const contract = {
      ...data,
      reference,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }
    
    const result = await db.collection('contracts').insertOne(contract)
    
    // Mettre à jour le client
    await db.collection('users').updateOne(
      { _id: data.clientId },
      { $set: { updatedAt: new Date() } }
    )
    
    return Response.json({
      success: true,
      message: 'Contract created successfully',
      contractId: result.insertedId,
      reference: reference
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Failed to create contract' }, { status: 500 })
  }
}
