// Fresh CI stores only. Never run the illustrative legacy seed on customer data.
const fs=require('node:fs'),path=require('node:path');if(fs.existsSync(path.join(__dirname,'project-env.cjs')))require('./project-env.cjs');
async function main(){
 if(process.env.ALLOW_TEST_BOOTSTRAP!=='true')throw Error('Requires ALLOW_TEST_BOOTSTRAP=true on an empty test installation');
 const base=process.env.TEST_BACKEND_URL||'http://localhost:9000';let token;
 async function api(url,body){const response=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body===undefined?undefined:JSON.stringify(body)}),data=await response.json();if(!response.ok)throw Error(url+' returned '+response.status+': '+(data.message||'request failed'));return data}
 token=(await api('/auth/user/emailpass',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD})).token;
 for(const endpoint of ['customers','orders']){const data=await api('/admin/'+endpoint+'?limit=1');if(data.count>0)throw Error('Refusing to bootstrap a store with existing '+endpoint)}
 let channel=(await api('/admin/sales-channels?limit=1')).sales_channels[0];if(!channel)channel=(await api('/admin/sales-channels',{name:'CI storefront'})).sales_channel;
 const store=(await api('/admin/stores')).stores[0];await api('/admin/stores/'+store.id,{supported_currencies:[{currency_code:'sar',is_default:true}],default_sales_channel_id:channel.id});
 if(!(await api('/admin/shipping-profiles?limit=1')).shipping_profiles.length)await api('/admin/shipping-profiles',{name:'Default Shipping Profile',type:'default'});
 if(!(await api('/admin/regions?limit=1')).regions.length)await api('/admin/regions',{name:'CI Saudi Arabia',currency_code:'sar',countries:['sa'],payment_providers:['pp_system_default']});
 const key=(await api('/admin/api-keys',{title:'CI storefront',type:'publishable'})).api_key;await api('/admin/api-keys/'+key.id+'/sales-channels',{add:[channel.id]});
 const output=process.env.TEST_BOOTSTRAP_OUTPUT||path.resolve(__dirname,'../scratch/ci-publishable-key');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,key.token,{mode:0o600});console.log('Empty test store configured. Publishable key saved locally; no customers or orders seeded.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
