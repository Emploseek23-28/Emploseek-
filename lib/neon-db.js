import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function query(sqlQuery, params = []) {
  try {
    console.log('Executing query:', sqlQuery, 'Params:', params);
    const result = await sql(sqlQuery, params);
    console.log('Query result:', result);
    return { rows: result };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function connectToDatabase() {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  return { query };
}
