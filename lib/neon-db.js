import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function query(sqlQuery, params = []) {
  try {
    const result = await sql(sqlQuery, params);
    return { rows: result };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function connectToDatabase() {
  return { query };
}

export { sql };
