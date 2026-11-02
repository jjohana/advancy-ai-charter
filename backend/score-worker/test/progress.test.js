import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from '../src/index.js';
const session='22222222-2222-4222-8222-222222222222', a='33333333-3333-4333-8333-333333333333', b='44444444-4444-4444-8444-444444444444', token='inv_'+'b'.repeat(43), version='2026-11-02-admin-fr-r3';
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function setup(){
 const db=new DatabaseSync(':memory:'); db.exec('PRAGMA foreign_keys=ON');
 for(const f of ['0001_hardened_assessments.sql','0002_enrollment_idempotency.sql','0003_add_admin_french_quiz.sql','0004_attempt_drafts.sql']) db.exec(readFileSync(new URL('../migrations/'+f,import.meta.url),'utf8'));
 db.exec("INSERT INTO cohorts(id,name,active,starts_at,expires_at) VALUES ('test','Test',1,'2020-01-01','2099-01-01')");
 db.prepare("INSERT INTO participants(id,cohort_id,first_name,last_name,email,token_hash,active,expires_at) VALUES ('p','test','Real','Person','person@example.com',?,1,'2099-01-01')").run(await hash(token));
 db.prepare("INSERT INTO participant_quizzes(session_id,participant_id,quiz_id,max_attempts_override) VALUES (?,'p','advancy-ai-admin-fr',3)").run(session);
 const DB={prepare(sql){return {bind(...args){return {async first(){return db.prepare(sql).get(...args)??null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}}}}}}}};
 return {db,env:{DB,ALLOWED_ORIGINS:'https://example.com'}};
}
const base={session_id:session,test_id:'advancy-ai-admin-fr',quiz_version:version,draft_id:a,baseline_attempts_used:0,answers:[1],attempt_started_at:'2026-01-01T00:00:00.000Z',privacy_notice_version:'2026-07-09',privacy_acknowledged:true};
async function call(env,path='/v2/progress',payload=base,options={}){const method=options.method||'POST';const r=await worker.fetch(new Request('https://api.example.com'+path,{method,headers:{Origin:options.origin||'https://example.com',Authorization:'Bearer '+(options.token||token),'Content-Type':'application/json',...(options.key?{'Idempotency-Key':options.key}:{})},...(method==='POST'?{body:JSON.stringify(payload)}:{})}),env);return {status:r.status,body:await r.json()}}
const get=env=>call(env,`/v2/progress?test_id=advancy-ai-admin-fr&quiz_version=${version}`,null,{method:'GET'});
test('progress monotonicity, conflict, reset replay, stale tab and cascade',async()=>{
 const {db,env}=await setup(); assert.equal((await get(env)).body.draft,null);
 assert.equal((await call(env)).status,201); assert.deepEqual((await call(env,'/v2/progress',{...base,answers:[1,2]})).body.draft.answers,[1,2]);
 assert.deepEqual((await call(env)).body.draft.answers,[1,2]); assert.equal((await call(env,'/v2/progress',{...base,answers:[2]})).body.error.code,'PROGRESS_CONFLICT');
 const {answers,...common}=base; const reset={...common,previous_draft_id:a,draft_id:b};
 assert.equal((await call(env,'/v2/progress/reset',reset)).status,200); assert.equal((await call(env)).body.error.code,'PROGRESS_CONFLICT');
 assert.equal((await call(env,'/v2/progress',{...base,draft_id:b,answers:[4]})).status,200);
 assert.deepEqual((await call(env,'/v2/progress/reset',reset)).body.draft.answers,[4]);
 assert.equal((await call(env,'/v2/progress/reset',{...reset,draft_id:a,previous_draft_id:b})).body.error.code,'PROGRESS_CONFLICT');
 assert.equal(db.prepare('SELECT COUNT(*) n FROM attempt_draft_tombstones').get().n,1); db.exec("DELETE FROM participants WHERE id='p'"); assert.equal(db.prepare('SELECT COUNT(*) n FROM attempt_drafts').get().n,0); assert.equal(db.prepare('SELECT COUNT(*) n FROM attempt_draft_tombstones').get().n,0);
});
test('auth, privacy, origin and session checks',async()=>{const {db,env}=await setup(); assert.equal((await call(env,'/v2/progress',base,{token:'bad'})).status,401); assert.equal((await call(env,'/v2/progress',base,{origin:'https://bad.example'})).status,403); assert.equal((await call(env,'/v2/progress',{...base,privacy_acknowledged:false})).status,428); assert.equal((await call(env,'/v2/progress',{...base,session_id:b})).status,403); db.exec("UPDATE participants SET expires_at='2020-01-01'"); assert.equal((await call(env)).status,410)});
test('submission cleans obsolete progress and stale writes cannot resurrect it',async()=>{const {db,env}=await setup(); await call(env); const submission={session_id:session,test_id:base.test_id,quiz_version:version,answers:Array(20).fill(1),attempt_started_at:base.attempt_started_at,completed_at:'2026-01-01T00:01:00.000Z',duration_seconds:60,privacy_notice_version:base.privacy_notice_version,privacy_acknowledged:true}; assert.equal((await call(env,'/v2/submit',submission,{key:a})).status,201); assert.equal(db.prepare('SELECT COUNT(*) n FROM attempt_drafts').get().n,0); assert.equal((await call(env)).body.error.code,'PROGRESS_STALE'); assert.equal((await get(env)).body.attempts_used,1); assert.equal((await call(env,'/v2/submit',submission,{key:a})).status,200)});
test('simultaneous competing saves and resets have one winner',async()=>{
 const {env}=await setup(); const saves=await Promise.all([call(env,'/v2/progress',{...base,answers:[1,2]}),call(env,'/v2/progress',{...base,answers:[1,3]})]); assert.deepEqual(saves.map(x=>x.status).sort(),[201,409]);
 const {answers,...common}=base; const c='55555555-5555-4555-8555-555555555555'; const resets=await Promise.all([call(env,'/v2/progress/reset',{...common,previous_draft_id:a,draft_id:b}),call(env,'/v2/progress/reset',{...common,previous_draft_id:a,draft_id:c})]); assert.deepEqual(resets.map(x=>x.status).sort(),[200,409]);
});
test('quota prevents new draft and submissions without drafts remain compatible',async()=>{
 const {env}=await setup(); const submission={session_id:session,test_id:base.test_id,quiz_version:version,answers:Array(20).fill(1),attempt_started_at:base.attempt_started_at,completed_at:'2026-01-01T00:01:00.000Z',duration_seconds:60,privacy_notice_version:base.privacy_notice_version,privacy_acknowledged:true};
 for(const key of [a,b,'55555555-5555-4555-8555-555555555555']) assert.equal((await call(env,'/v2/submit',submission,{key})).status,201);
 assert.equal((await call(env,'/v2/submit',submission,{key:'66666666-6666-4666-8666-666666666666'})).body.error.code,'ATTEMPT_LIMIT_REACHED');
 assert.equal((await call(env,'/v2/progress',{...base,baseline_attempts_used:3})).status,409);
});

test('progress accepts small clock skew and rejects timestamps beyond five minutes', async () => {
  const { env } = await setup();
  const start = new Date(Date.now() + 2 * 60 * 1000).toISOString();
  assert.equal((await call(env, '/v2/progress', { ...base, attempt_started_at: start })).status, 201);
  const future = new Date(Date.now() + 6 * 60 * 1000).toISOString();
  assert.equal((await call(env, '/v2/progress', { ...base, attempt_started_at: future })).body.error.code, 'INVALID_TIMING');
});

test('final submission rejects a reset draft, accepts current draft and replays receipt', async () => {
  const { env } = await setup();
  assert.equal((await call(env)).status, 201);
  const { answers, ...common } = base;
  const reset = { ...common, previous_draft_id: a, draft_id: b };
  assert.equal((await call(env, '/v2/progress/reset', reset)).status, 200);
  const submission = {
    session_id: session, test_id: base.test_id, quiz_version: version,
    answers: Array(20).fill(1), attempt_started_at: base.attempt_started_at,
    completed_at: '2026-01-01T00:01:00.000Z', duration_seconds: 60,
    privacy_notice_version: base.privacy_notice_version, privacy_acknowledged: true
  };
  assert.equal((await call(env, '/v2/submit', submission, { key: a })).body.error.code, 'PROGRESS_CONFLICT');
  assert.equal((await call(env, '/v2/submit', submission, { key: b })).status, 201);
  assert.equal((await call(env, '/v2/submit', submission, { key: a })).body.error.code, 'PROGRESS_CONFLICT');
  assert.equal((await get(env)).body.attempts_used, 1);
  assert.equal((await call(env, '/v2/submit', submission, { key: b })).status, 200);
});

test('old receipt replays after a later draft reset; incompatible final prefix is rejected', async () => {
  const { env } = await setup();
  const submission = {
    session_id: session, test_id: base.test_id, quiz_version: version,
    answers: Array(20).fill(1), attempt_started_at: base.attempt_started_at,
    completed_at: '2026-01-01T00:01:00.000Z', duration_seconds: 60,
    privacy_notice_version: base.privacy_notice_version, privacy_acknowledged: true
  };
  assert.equal((await call(env, '/v2/submit', submission, { key: a })).status, 201);
  const c = '55555555-5555-4555-8555-555555555555';
  const next = { ...base, draft_id: b, baseline_attempts_used: 1, answers: [2] };
  assert.equal((await call(env, '/v2/progress', next)).status, 201);
  assert.equal((await call(env, '/v2/submit', submission, { key: b })).body.error.code, 'PROGRESS_CONFLICT');
  const { answers, ...common } = next;
  assert.equal((await call(env, '/v2/progress/reset', { ...common, previous_draft_id: b, draft_id: c })).status, 200);
  assert.equal((await call(env, '/v2/submit', submission, { key: a })).status, 200);
});
