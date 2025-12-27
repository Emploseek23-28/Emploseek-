import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    
    // Supprimer le contrat
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
    console.error('Error deleting contract:', error)
    return Response.json({ error: 'Failed to delete contract' }, { status: 500 })
  }
}

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
    
    return Response.json(contract, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching contract:', error)
    return Response.json({ error: 'Failed to fetch contract' }, { status: 500 })
  }
}
