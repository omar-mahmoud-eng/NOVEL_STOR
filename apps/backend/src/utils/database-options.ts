export function databaseDriverOptions(connectionString:string,sslSetting?:string){
 const url=new URL(connectionString),setting=sslSetting?.trim().toLowerCase()
 if(setting&&!['true','false'].includes(setting))throw Error('DATABASE_SSL must be true or false')
 const internal=['localhost','127.0.0.1','[::1]','postgres','medusa-postgres'].includes(url.hostname)
 const ssl=setting?setting==='true':!internal
 return {connection:{ssl:ssl?{rejectUnauthorized:true}:false}}
}
