const test=require('node:test'),assert=require('node:assert/strict'),{loadSource}=require('./source-loader.cjs')
const {initialOrderSummary}=loadSource('apps/backend/src/utils/order-summary-repair.ts',{'./db':{getDbPool(){throw Error('Unexpected database access')}}})
test('Missing initial summaries use actual transactions and preserve the original order price',()=>{
 const order={version:1,total:12.5,credit_lines:[],transactions:[{amount:5},{amount:-1}],metadata:{status:'paid'}}
 const before=JSON.stringify(order),summary=initialOrderSummary(order)
 assert.equal(Number(summary.original_order_total),12.5);assert.equal(Number(summary.current_order_total),12.5)
 assert.equal(Number(summary.paid_total),5);assert.equal(Number(summary.refunded_total),1)
 assert.equal(Number(summary.transaction_total),4);assert.equal(Number(summary.pending_difference),8.5)
 assert.equal(JSON.stringify(order),before)
})
test('An order status cannot fabricate a captured payment when repairing its summary',()=>{
 const summary=initialOrderSummary({version:1,total:5500,transactions:[],metadata:{payment_status:'captured'}})
 assert.equal(Number(summary.paid_total),0);assert.equal(Number(summary.pending_difference),5500)
 assert.equal(Number(summary.original_order_total),5500)
})
test('Orders with edit history or credit lines require accounting review rather than guessed history',()=>{
 assert.throws(()=>initialOrderSummary({version:2,total:20}),/unchanged initial/)
 assert.throws(()=>initialOrderSummary({version:1,total:20,credit_lines:[{amount:5}]}),/without credit lines/)
})
test('Admin plugins and dashboard resolve one query provider without losing existing Vite settings',async()=>{
 const previous=process.env.DATABASE_URL,previousRedis=process.env.REDIS_URL;process.env.DATABASE_URL=previous||'postgres://test@localhost/test';process.env.REDIS_URL=previousRedis||'redis://localhost:6379'
 const config=loadSource('apps/backend/medusa-config.ts',{'@medusajs/framework/utils':{loadEnv(){},defineConfig:value=>value}}).default
 if(previous===undefined)delete process.env.DATABASE_URL;if(previousRedis===undefined)delete process.env.REDIS_URL
 const incoming={resolve:{alias:{app:'/app'},dedupe:['react']},server:{port:1234},plugins:[{name:'existing-plugin'}]},result=config.admin.vite(incoming);assert.equal(result.plugins,undefined);assert.equal(incoming.plugins.length,1)
 assert.ok(result.resolve.dedupe.includes('@tanstack/react-query'));assert.ok(result.resolve.dedupe.includes('@tanstack/query-core'))
 assert.ok(result.resolve.dedupe.includes('react'));assert.equal(result.resolve.alias,undefined);assert.equal(result.server,undefined);assert.equal(incoming.server.port,1234)
})
