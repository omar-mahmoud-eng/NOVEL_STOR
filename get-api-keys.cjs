const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://medusa_admin:SuperSecureDbPassword2026!@localhost:5432/medusa_db' });

pool.query("SELECT id, token, title, type FROM api_key").then(r => {
  console.log('API Keys in database:', r.rows);
  pool.end();
}).catch(err => {
  console.error(err);
  pool.end();
});
