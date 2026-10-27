const test=require('node:test'),assert=require('node:assert/strict'),{loadSource}=require('./source-loader.cjs')
function catalog(books){return loadSource('apps/storefront/src/lib/catalog-server.ts',{'server-only':{},react:{cache:fn=>fn},'next/server':{connection:async()=>{}},'./medusa-server':{backendFetch:async()=>({ok:true,json:async()=>({books})})}})}
test('The illustrated landing page selects an available story when its editorial default is archived',async()=>{
 const live={id:'new',handle:'new-original',title:'Published replacement'}
 assert.deepEqual(await catalog([live]).getFirstOriginalBook(),live)
 assert.equal(await catalog([]).getFirstOriginalBook(),undefined)
})
