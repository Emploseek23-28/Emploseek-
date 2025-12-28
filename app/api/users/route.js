import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

export async function GET() {
  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db('emploseek')
    
    const users = await db.collection('users').find({}).toArray()
    
    await client.close()
    
    return Response.json(users, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db('emploseek')
    
    // Insert user
    const result = await db.collection('users').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    await client.close()
    
    return Response.json({
      success: true,
      userId: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
