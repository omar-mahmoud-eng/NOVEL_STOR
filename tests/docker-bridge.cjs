const http=require("node:http")
const bridges=[]
async function startBridges(){
 for(const [port,host,targetPort] of [[3000,"gateway",3000],[9000,"gateway",9000],[9005,"minio",9000],[8025,"mailpit",8025]]){
  const server=http.createServer((request,response)=>{const upstream=http.request({hostname:host,port:targetPort,path:request.url,method:request.method,headers:request.headers},result=>{response.writeHead(result.statusCode,result.headers);result.pipe(response)});upstream.on("error",()=>{if(!response.headersSent)response.writeHead(502,{"Content-Type":"application/json"});response.end(JSON.stringify({message:"Test bridge upstream unavailable"}))});request.pipe(upstream)})
  await new Promise((resolve,reject)=>server.listen(port,"127.0.0.1",resolve).once("error",reject));bridges.push(server)
 }
}
async function closeBridges(){await Promise.all(bridges.map(server=>new Promise(resolve=>server.close(resolve))))}
module.exports={startBridges,closeBridges}
