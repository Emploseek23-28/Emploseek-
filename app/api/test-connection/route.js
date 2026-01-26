import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Testez une opération simple
    const result = await db.command({ ping: 1 });
    
    return Response.json({ 
      status: 'success', 
      message: 'Connected to MongoDB',
      ping: result 
    });
  } catch (error) {
    return Response.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
