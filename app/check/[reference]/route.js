import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request, { params }) {
  try {
    const { reference } = params
    const { db } = await connectToDatabase()
    
    // Rechercher le contrat
    const contract = await db.collection('contracts').findOne({
      reference: reference.toUpperCase()
    })
    
    if (!contract) {
      return Response.json({
        valid: false,
        error: 'Reference not found'
      }, { status: 200 })
    }
    
    // Récupérer les infos client
    const client = await db.collection('users').findOne({
      _id: contract.clientId
    })
    
    if (!client) {
      return Response.json({
        valid: false,
        error: 'Client information not found'
      }, { status: 200 })
    }
    
    // Vérifier si le contrat est expiré
    const isExpired = new Date(contract.endDate) < new Date()
    
    // Enregistrer la vérification
    await db.collection('verifications').insertOne({
      reference: reference,
      checkedAt: new Date(),
      result: isExpired ? 'expired' : 'valid',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    })
    
    if (isExpired) {
      return Response.json({
        valid: false,
        error: 'Contract has expired',
        reference: contract.reference
      }, { status: 200 })
    }
    
    // Retourner les données
    return Response.json({
      valid: true,
      reference: contract.reference,
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        birthDate: client.birthDate,
        nationality: client.nationality,
        passportNumber: client.passportNumber
      },
      contract: {
        type: contract.type,
        company: contract.company,
        country: contract.country,
        position: contract.position,
        salary: contract.salary,
        startDate: contract.startDate,
        endDate: contract.endDate,
        pdfUrl: contract.pdfUrl,
        status: contract.status
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ 
      valid: false,
      error: 'Server error' 
    }, { status: 500 })
  }
}
