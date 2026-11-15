import postgres from 'postgres';

let sql = null;

if (process.env.DATABASE_URL) {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export { sql };
export default sql;
