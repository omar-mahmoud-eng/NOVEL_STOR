// Pipe this file to `docker compose exec -T medusa-backend node`.
// Credentials come from the destination's private .env file; never print them.
const { spawnSync } = require('node:child_process')
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD of at least 12 characters in the private root .env, then recreate the backend.')
  process.exit(1)
}
const result = spawnSync(process.execPath, [
  '../../node_modules/@medusajs/cli/cli.js', 'user',
  '--email', ADMIN_EMAIL, '--password', ADMIN_PASSWORD,
], { stdio: 'inherit' })
if (result.error) { console.error('Unable to launch the Medusa user command'); process.exit(1) }
process.exit(result.status ?? 1)
