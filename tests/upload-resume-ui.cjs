const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=async function uploadResume(page,pool,cleanup,out,run){
 await page.getByRole('button',{name:'الملفات والراوي',exact:true}).click();
 const widget=page.getByRole('heading',{name:'بيانات القصة وملفات القراءة والاستماع',exact:true}).locator('..');
 await widget.getByLabel('الكاتب',{exact:true}).fill('Upgrade upload '+run);
 await widget.getByRole('button',{name:'إضافة ملف',exact:true}).click();
 await widget.getByLabel('الصيغة',{exact:true}).selectOption('ebook_pdf');
 await widget.getByLabel('النسخة المرتبطة',{exact:true}).selectOption({label:'Ebook'});
 const filename=path.join(out,'resume-'+run+'.pdf'),bytes=Buffer.alloc(33*1024**2+64,32);bytes.write('%PDF-1.4\n');fs.writeFileSync(filename,bytes);
 let session,metadata,release;const part2=/\/admin\/assets\/uploads\/[^/]+\/parts\/2$/;
 cleanup.push(async()=>{if(fs.existsSync(filename))fs.unlinkSync(filename);if(metadata){await pool.query('DELETE FROM digital_media WHERE story_metadata_id=$1',[metadata]);await pool.query('DELETE FROM story_metadata WHERE id=$1',[metadata]);await pool.query('DELETE FROM author WHERE name=$1',['Upgrade upload '+run])}if(session){const row=(await pool.query('SELECT * FROM media_upload_sessions WHERE id=$1',[session])).rows[0];if(row){const {S3Client,DeleteObjectCommand,AbortMultipartUploadCommand}=require('@aws-sdk/client-s3'),s3=new S3Client({endpoint:process.env.S3_ENDPOINT,region:'us-east-1',forcePathStyle:true,credentials:{accessKeyId:process.env.S3_ACCESS_KEY,secretAccessKey:process.env.S3_SECRET_KEY}});try{await s3.send(row.status==='completed'?new DeleteObjectCommand({Bucket:process.env.S3_BUCKET,Key:row.storage_key}):new AbortMultipartUploadCommand({Bucket:process.env.S3_BUCKET,Key:row.storage_key,UploadId:row.upload_id}))}catch{}await pool.query('DELETE FROM media_upload_sessions WHERE id=$1',[session])}}});
 await page.route(part2,async route=>{await new Promise(resolve=>{release=resolve});await route.abort().catch(()=>{})});
 let firstPartRequests=0;const watch=request=>{if(/\/parts\/1$/.test(request.url()))firstPartRequests++};page.on('request',watch);
 try{
  const initialized=page.waitForResponse(r=>r.url().endsWith('/admin/assets/uploads')&&r.request().method()==='POST'),first=page.waitForResponse(r=>/\/parts\/1$/.test(r.url())&&r.request().method()==='PUT');
  await widget.locator('input[type="file"]').setInputFiles(filename);session=(await(await initialized).json()).id;assert.equal((await first).status(),200);
  await widget.getByRole('button',{name:'إيقاف مؤقت',exact:true}).click();if(release)release();await widget.getByText('أُوقف الرفع مؤقتًا',{exact:true}).waitFor();await page.unroute(part2);
  const completed=page.waitForResponse(r=>r.url().endsWith(`/admin/assets/uploads/${session}/complete`)&&r.request().method()==='POST',{timeout:60000});
  await widget.locator('input[type="file"]').setInputFiles(filename);const result=await completed;assert.equal(result.status(),200);const data=await result.json();assert.equal(firstPartRequests,1,'An uploaded part should be verified locally and skipped after resuming');
  await widget.locator('progress').waitFor();await page.waitForFunction(()=>document.querySelector('progress')?.value===100);assert.equal(await widget.getByRole('button',{name:'إلغاء الأجزاء المرفوعة',exact:true}).count(),0);assert.equal(await widget.getByLabel('مفتاح التخزين',{exact:true}).inputValue(),data.key);
  const preview=widget.locator('iframe[title="معاينة PDF"]');await preview.waitFor();assert.ok(Number(new URL(await preview.getAttribute('src')).searchParams.get('X-Amz-Expires'))<=60);
  const saving=page.waitForResponse(r=>/\/admin\/products\/[^/]+\/story-media$/.test(r.url())&&r.request().method()==='POST');await widget.getByRole('button',{name:'حفظ بيانات القصة والملفات',exact:true}).click();const saved=await saving;assert.equal(saved.status(),200);metadata=(await saved.json()).story_metadata_id;
  assert.equal((await pool.query('SELECT count(*)::int AS count FROM digital_media WHERE story_metadata_id=$1 AND private_storage_key=$2',[metadata,data.key])).rows[0].count,1);await widget.screenshot({path:path.join(out,'resumable-private-upload.png')});
 }finally{if(release)release();await page.unroute(part2);page.off('request',watch)}
}
