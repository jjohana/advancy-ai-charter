import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
const id='11111111-1111-4111-8111-111111111111', key='33333333-3333-4333-8333-333333333333', key2='44444444-4444-4444-8444-444444444444', token='enr_'+'a'.repeat(43), invite='inv_'+'b'.repeat(43);
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const body={first_name:'Pretend',last_name:'Name',email:'person@example.com',quiz_id:'advancy-ai-admin-fr',privacy_notice_version:'2026-07-09',privacy_acknowledged:true};
async function setup(){
 const db=new DatabaseSync(':memory:'); for(const f of ['0001_hardened_assessments.sql','0002_enrollment_idempotency.sql','0003_add_admin_french_quiz.sql','0004_attempt_drafts.sql']) db.exec(readFileSync(new URL('../migrations/'+f,import.meta.url),'utf8'));
 db.exec("INSERT INTO cohorts(id,name,active,starts_at,expires_at) VALUES ('test','Test',1,'2020-01-01','2099-01-01')");
 db.prepare("INSERT INTO participants(id,cohort_id,first_name,last_name,email,token_hash,active,expires_at) VALUES (?,'test','Real','Person','person@example.com',?,1,'2099-01-01')").run(id,await hash(invite));
 db.prepare("INSERT INTO participant_quizzes(session_id,participant_id,quiz_id,max_attempts_override) VALUES ('22222222-2222-4222-8222-222222222222',?,'advancy-ai-admin-fr',3)").run(id);
 const DB={prepare(sql){return {bind(...a){return {async first(){return db.prepare(sql).get(...a)??null},async all(){return {results:db.prepare(sql).all(...a)}}}}}}};
 return {db,env:{DB,ALLOWED_ORIGINS:'https://example.com',ADMIN_FRENCH_SHARED_ACCESS:JSON.stringify({version:1,access_token_hash:await hash(token),expires_at:'2099-01-01T00:00:00.000Z',members:{[id]:invite}})}};
}
async function call(env,{payload=body,credential=token,idem=key,origin='https://example.com',method='POST'}={}){
 const headers={Origin:origin,Authorization:`Bearer ${credential}`,'Content-Type':'application/json','Idempotency-Key':idem,'Access-Control-Request-Method':'POST'};
 const response=await worker.fetch(new Request('https://api.example.com/v2/admin-enroll',{method,headers,...(method==='POST'?{body:JSON.stringify(payload)}:{})}),env);
 return {response,data:method==='OPTIONS'?null:await response.json()};
}
test('claim and retry preserve identity, invitation, assignment and quota',async()=>{
 const {db,env}=await setup(), before=db.prepare('SELECT * FROM participant_quizzes').all();
 db.exec(`INSERT INTO attempts(id,receipt_id,session_id,quiz_id,quiz_version,idempotency_key,submission_fingerprint,attempt_number,answers,correct,total,percent,passed,client_started_at,client_completed_at,duration_seconds,privacy_notice_version,privacy_acknowledged) VALUES ('attempt','receipt','22222222-2222-4222-8222-222222222222','advancy-ai-admin-fr','2026-11-02-admin-fr-r3','old-key','${'0'.repeat(64)}',1,'{}',1,2,50,0,'2025-01-01','2025-01-01',1,'2026-07-09',1)`);
 const historical=db.prepare('SELECT * FROM attempts').all();
 const a=await call(env); assert.equal(a.response.status,200); assert.equal(a.data.participant.display_name,'Real Person'); assert.equal(a.data.invite_token,invite); assert.equal(a.data.participant_id,id);
 assert.equal((await call(env)).response.status,200); assert.equal((await call(env,{idem:key2})).response.status,409); assert.equal((await call(env,{payload:{...body,first_name:'Changed'}})).response.status,409);
 assert.deepEqual(db.prepare('SELECT * FROM participant_quizzes').all(),before); assert.equal(db.prepare('SELECT token_hash FROM participants').get().token_hash,await hash(invite)); assert.deepEqual(db.prepare('SELECT * FROM attempts').all(),historical);
});
test('different simultaneous keys have one winner',async()=>{const {env}=await setup(); assert.deepEqual((await Promise.all([call(env),call(env,{idem:key2})])).map(x=>x.response.status).sort(),[200,409])});
test('origin, credentials, membership, privacy, quiz, key and rate limits',async()=>{
 const {env}=await setup(); assert.equal((await call(env,{payload:{...body,email:'unknown@example.com'}})).data.error.code,'PARTICIPANT_NOT_INVITED'); assert.equal((await call(env,{credential:'enr_'+'x'.repeat(43)})).response.status,401); assert.equal((await call(env,{idem:'bad'})).response.status,400); assert.equal((await call(env,{payload:{...body,privacy_acknowledged:false}})).response.status,428); assert.equal((await call(env,{payload:{...body,quiz_id:'advancy-ai-assessment-normal'}})).response.status,400); assert.equal((await call(env,{origin:'https://evil.example'})).response.status,403);
 const pre=await call(env,{method:'OPTIONS'}); assert.equal(pre.response.status,204); assert.equal(pre.response.headers.get('access-control-allow-origin'),'https://example.com');
 env.PUBLIC_RATE_LIMITER={limit:async()=>({success:false})}; assert.equal((await call(env)).response.status,429); delete env.PUBLIC_RATE_LIMITER; env.ENROLLMENT_RATE_LIMITER={limit:async()=>({success:false})}; assert.equal((await call(env)).data.error.code,'ENROLLMENT_RATE_LIMITED');
});
test('invalid or expired secret and inactive, expired, replaced or unassigned invitations fail closed',async()=>{
 for(const sql of ["UPDATE participants SET active=0","UPDATE participants SET revoked_at='2025-01-01'","UPDATE participants SET token_hash='"+'0'.repeat(64)+"'","UPDATE participants SET expires_at='2020-01-01'","UPDATE cohorts SET active=0","UPDATE cohorts SET starts_at='2098-01-01'","UPDATE cohorts SET expires_at='2020-01-02',starts_at='2020-01-01'","UPDATE participant_quizzes SET enabled=0","DELETE FROM participant_quizzes"]){const {db,env}=await setup(); db.exec(sql); assert.equal((await call(env)).response.status,409,sql); assert.equal(db.prepare('SELECT enrollment_idempotency_hash h FROM participants').get().h,null)}
 for(const mutate of [c=>c.expires_at='2020-01-01T00:00:00.000Z',c=>c.access_token_hash='bad',c=>c.members={'invalid':invite},c=>c.members={}]){const {env}=await setup(),c=JSON.parse(env.ADMIN_FRENCH_SHARED_ACCESS); mutate(c); env.ADMIN_FRENCH_SHARED_ACCESS=JSON.stringify(c); assert.equal((await call(env)).response.status,503)}
});
