import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not found in environment variables');
}

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function query(sqlQuery, params = []) {
  if (!sql) {
    throw new Error('Database not configured');
  }
  
  try {
    const result = await sql(sqlQuery, params);
    return { rows: result };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export { sql };
