require("./scripts/project-env.cjs")
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query("SELECT id, token, title, type FROM api_key WHERE type = 'publishable' AND deleted_at IS NULL").then(r => {
  console.log('API Keys in database:', r.rows);
  pool.end();
}).catch(err => {
  console.error(err);
  pool.end();
});
