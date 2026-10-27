const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path')
const { spawn } = require('node:child_process')
const { randomUUID, createHash } = require('node:crypto')
const { Pool } = require('pg')
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
require('../scripts/project-env.cjs')

// Host-only suite: intentionally restarts this project's services. Never run
// concurrently with browser journeys, migrations, or another restart suite.
const run = randomUUID().slice(0, 8), report = { passed: [], failed: [] }, cleanup = []
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const back = 'http://localhost:9000', front = 'http://localhost:3000'
const s3 = new S3Client({ endpoint: 'http://localhost:9005', region: 'us-east-1', forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD } })
const Bucket = process.env.S3_BUCKET || 'publishing-private-media', Key = `audit/restart-${run}/sample.pdf`
let token, session
async function api(endpoint, method = 'GET', body, cookie = false) {
  const response = await fetch(back + endpoint, { method, headers: { 'Content-Type': 'application/json',
    ...(cookie ? { Cookie: session } : token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000) })
  return response
}
async function ready() {
  for (const url of [back + '/health', front + '/ar', 'http://localhost:9005/health']) {
    let ok = false
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) { ok = true; break } } catch {}
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    assert.ok(ok, 'Service failed to recover: ' + url)
  }
}
async function restart() {
  await new Promise((resolve, reject) => {
    const child = spawn('docker', ['compose', 'restart', 'postgres', 'redis', 'minio', 'medusa-backend', 'medusa-storefront', 'gateway'], { stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''; child.stdout.on('data', data => output += data); child.stderr.on('data', data => output += data)
    child.on('error', reject); child.on('exit', code => code ? reject(Error(output)) : resolve())
  })
}
async function main() {
  await ready()
  const auth = await api('/auth/user/emailpass', 'POST', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
  assert.equal(auth.status, 200); token = (await auth.json()).token
  const login = await api('/auth/session', 'POST')
  assert.equal(login.status, 200)
  session = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
  assert.ok(session); assert.equal((await api('/admin/users/me', 'GET', undefined, true)).status, 200)
  const bytes = Buffer.from('%PDF-1.4\n% restart fixture ' + run + '\n%%EOF')
  await s3.send(new PutObjectCommand({ Bucket, Key, Body: bytes, ContentType: 'application/pdf' }))
  cleanup.push(() => s3.send(new DeleteObjectCommand({ Bucket, Key })))
  const form = new FormData()
  form.append('files', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5e8AAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'audit-restart-' + run + '.png')
  const uploaded = await fetch(back + '/admin/uploads', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: form })
  assert.equal(uploaded.status, 200)
  const file = (await uploaded.json()).files[0]
  cleanup.push(() => api('/admin/uploads/' + file.id, 'DELETE'))
  const beforeImage = Buffer.from(await (await fetch(file.url)).arrayBuffer())
  const storyResponse = await api('/admin/reading-stories', 'POST', { title: 'Restart fixture ' + run, handle: 'audit-restart-' + run,
    realm: 'originals', status: 'published', description: 'Persistence verification', coverUrl: file.url,
    author: { name: 'Audit', bio: '', avatar: '' }, sampleText: ['Persistent text ' + run], sectionImages: [], genre: 'classics', minutes: 1 })
  assert.equal(storyResponse.status, 201)
  const story = (await storyResponse.json()).story
  cleanup.push(() => pool.query('DELETE FROM reading_stories WHERE id=$1 AND handle=$2', [story.id, story.handle]))
  await pool.end() // Do not retain a PostgreSQL socket across its planned restart.
  console.log('Fixtures saved; restarting the project services.')
  await restart(); await ready()
  report.passed.push('Database, cache, private storage, backend, storefront and gateway recover after restart')
  const persisted = await api('/admin/reading-stories/' + story.id)
  assert.equal(persisted.status, 200)
  assert.equal((await persisted.json()).story.sampleText[0], 'Persistent text ' + run)
  report.passed.push('Published reading content persists in PostgreSQL')
  const afterImage = Buffer.from(await (await fetch(file.url)).arrayBuffer())
  assert.equal(createHash('sha256').update(afterImage).digest('hex'), createHash('sha256').update(beforeImage).digest('hex'))
  report.passed.push('Native Medusa public uploads persist byte-for-byte in their mounted volume')
  const object = await s3.send(new GetObjectCommand({ Bucket, Key }))
  assert.deepEqual(Buffer.from(await object.Body.transformToByteArray()), bytes)
  assert.equal((await fetch('http://localhost:9005/' + Bucket + '/' + Key)).status, 403)
  report.passed.push('Private media persists byte-for-byte and anonymous access stays forbidden')
  assert.equal((await api('/admin/users/me', 'GET', undefined, true)).status, 200)
  report.passed.push('The native Medusa administrator session survives the Redis and backend restart')
}
main().catch(error => report.failed.push(error.message)).finally(async () => {
  // The initial pool has been closed when restart begins; use a fresh one for
  // the uniquely identified fixture cleanup.
  const fresh = new Pool({ connectionString: process.env.DATABASE_URL })
  pool.query = (...args) => fresh.query(...args)
  for (const action of cleanup.reverse()) try { await action() } catch (error) { report.failed.push('Cleanup: ' + error.message) }
  await fresh.end(); try { await pool.end() } catch {}
  s3.destroy()
  const directory = path.resolve(__dirname, '../scratch/restart-persistence'); fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2)); if (report.failed.length) process.exitCode = 1
})
