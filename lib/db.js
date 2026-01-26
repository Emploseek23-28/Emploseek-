import clientPromise from './mongodb';

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('emploseek'); // Remplacez par le nom de votre DB
    return { db, client };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
