import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection('users').findOne({
      email: data.email
    })
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          error: 'User already exists with this email',
          userId: existingUser._id 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Créer un nouvel utilisateur
    const user = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      registrationSource: 'website'
    }
    
    const result = await db.collection('users').insertOne(user)
    
    // Envoyer un email de confirmation (simulé pour l'exemple)
    console.log(`New user registered: ${data.email}`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User registered successfully',
        userId: result.insertedId 
      }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error creating user:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to register user' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
