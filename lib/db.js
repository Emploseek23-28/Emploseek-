import clientPromise from './mongodb';

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('emploseek_admin'); // Remplacez par votre nom de DB
    return { db, client };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
