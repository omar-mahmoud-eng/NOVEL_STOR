const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const {firefox,webkit}=require('playwright'),{startBridges,closeBridges}=require('./docker-bridge.cjs')
const base='http://localhost:3000',report={passed:[],failed:[],runtimeErrors:[]},out=path.resolve(__dirname,'../scratch/browser-matrix')
async function main(){await startBridges();fs.mkdirSync(out,{recursive:true})
 for(const [name,engine]of Object.entries({firefox,webkit})){
  const browser=await engine.launch({headless:true})
  try{const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();page.setDefaultTimeout(20000)
   page.on('pageerror',error=>report.runtimeErrors.push({browser:name,error:error.message}))
   for(const route of['/ar','/en','/ar/books','/ar/realms/little/reader/book_little_01','/ar/realms/kids/books','/ar/realms/teens/reader/book_teens_01']){
    try{const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);await page.waitForFunction(()=>document.body.innerText.length>100);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Horizontal overflow');if(route==='/ar/realms/kids/books')await page.screenshot({path:path.join(out,name+'-kids-mobile.png'),fullPage:true});report.passed.push(name+' '+route)}catch(error){report.failed.push({browser:name,route,error:error.message})}
   }
   await context.close()
  }finally{await browser.close()}
 }
 // A bounded local read load, not a production capacity certification.
 const timings=[],statuses=[],start=Date.now();let next=0
 await Promise.all(Array.from({length:10},async()=>{while(next++<100){const began=Date.now();const response=await fetch(base+'/api/medusa/store/reading-stories?realm=kids',{signal:AbortSignal.timeout(15000)});await response.arrayBuffer();timings.push(Date.now()-began);statuses.push(response.status)}}))
 timings.sort((a,b)=>a-b);report.localReadLoad={requests:statuses.length,concurrency:10,durationMs:Date.now()-start,p50Ms:timings[49],p95Ms:timings[94],statuses:[...new Set(statuses)]}
 assert.equal(statuses.length,100);assert.ok(statuses.every(status=>status===200),'Concurrent local catalog requests failed');report.passed.push('100 read-only catalog requests at concurrency 10 return HTTP 200')
}
main().catch(error=>report.failed.push({name:'Setup or load',error:error.message})).finally(async()=>{await closeBridges();fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.failed.length||report.runtimeErrors.length)process.exitCode=1})
