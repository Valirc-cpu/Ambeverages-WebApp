import postgres from 'postgres';

let sql = null;

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

if (dbUrl) {
  sql = postgres(dbUrl, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export { sql };
export default sql;
