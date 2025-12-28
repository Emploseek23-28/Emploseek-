import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    
    const contract = await db.collection('contracts').findOne({
      _id: new ObjectId(id)
    })
    
    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }
    
    // Récupérer les infos client
    const client = await db.collection('users').findOne({
      _id: contract.clientId
    })
    
    const contractWithClient = {
      ...contract,
      client: client ? {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        birthDate: client.birthDate,
        nationality: client.nationality
      } : null
    }
    
    return Response.json(contractWithClient, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    
    const result = await db.collection('contracts').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 1) {
      return Response.json({ 
        success: true, 
        message: 'Contract deleted successfully' 
      }, { status: 200 })
    } else {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Failed to delete contract' }, { status: 500 })
  }
}
