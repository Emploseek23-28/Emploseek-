import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    
    // Vérifier si le contrat existe
    const contract = await db.collection('contracts').findOne({
      _id: new ObjectId(id)
    })
    
    if (!contract) {
      return new Response(
        JSON.stringify({ error: 'Contract not found' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Supprimer le contrat
    const result = await db.collection('contracts').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 1) {
      console.log(`Contract deleted: ${contract.reference}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contract deleted successfully' 
        }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to delete contract' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
  } catch (error) {
    console.error('Error deleting contract:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete contract' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Mettre à jour le contrat
    const result = await db.collection('contracts').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contract updated successfully' 
        }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Contract not found or not modified' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
  } catch (error) {
    console.error('Error updating contract:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update contract' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    
    // Récupérer le contrat avec les infos client
    const contract = await db.collection('contracts')
      .aggregate([
        {
          $match: { _id: new ObjectId(id) }
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
        JSON.stringify({ error: 'Contract not found' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(JSON.stringify(contract), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error fetching contract:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch contract' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
