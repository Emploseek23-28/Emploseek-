import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection('users').find({}).toArray()
    return Response.json(users, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Vérifier si l'email existe déjà
    const existingUser = await db.collection('users').findOne({ 
      email: data.email 
    })
    
    if (existingUser) {
      return Response.json({ 
        error: 'Email already registered',
        userId: existingUser._id 
      }, { status: 400 })
    }
    
    // Créer l'utilisateur
    const user = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }
    
    const result = await db.collection('users').insertOne(user)
    
    return Response.json({
      success: true,
      message: 'User registered successfully',
      userId: result.insertedId
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Failed to register user' }, { status: 500 })
  }
}
