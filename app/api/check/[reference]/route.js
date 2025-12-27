import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const { reference } = params
    const { db } = await connectToDatabase()
    
    // Rechercher le contrat par référence
    const contract = await db.collection('contracts')
      .aggregate([
        {
          $match: { reference: reference.toUpperCase() }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'clientId',
            foreignField: '_id',
            as: 'clientInfo'
          }
        },
        {
          $unwind: '$clientInfo'
        }
      ])
      .next()
    
    if (!contract) {
      return new Response(
        JSON.stringify({ 
          error: 'Contract not found',
          valid: false 
        }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Vérifier si le contrat est expiré
    const isExpired = new Date(contract.endDate) < new Date()
    
    if (isExpired) {
      return new Response(
        JSON.stringify({ 
          error: 'Contract has expired',
          valid: false,
          reference: contract.reference
        }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Retourner les informations du contrat et du client
    const response = {
      valid: true,
      reference: contract.reference,
      client: {
        firstName: contract.clientInfo.firstName,
        lastName: contract.clientInfo.lastName,
        email: contract.clientInfo.email,
        phone: contract.clientInfo.phone,
        birthDate: contract.clientInfo.birthDate,
        nationality: contract.clientInfo.nationality,
        passportNumber: contract.clientInfo.passportNumber
      },
      contract: {
        type: contract.type,
        company: contract.company,
        country: contract.country,
        position: contract.position,
        salary: contract.salary,
        startDate: contract.startDate,
        endDate: contract.endDate,
        description: contract.description,
        pdfUrl: contract.pdfUrl,
        status: contract.status,
        verifiedAt: new Date().toISOString()
      }
    }
    
    // Enregistrer la vérification dans l'historique
    await db.collection('verifications').insertOne({
      reference: contract.reference,
      checkedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
      result: 'valid'
    })
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
    
  } catch (error) {
    console.error('Error checking reference:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to check reference',
        valid: false 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
