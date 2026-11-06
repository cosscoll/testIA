/* Studio IA — vérification HTTP volontaire de la production, sans API IA ni écriture.
   Usage : node scripts/verify-live-site.cjs [https://testia-unifie.vercel.app]
   Node 18+ avec accès réseau. Ne tourne ni en CI, ni périodiquement.
*/
'use strict';
const assert=require('node:assert/strict');
const baseText=process.argv[2]||'https://testia-unifie.vercel.app';
const base=new URL(baseText.endsWith('/')?baseText:baseText+'/');
if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash){
 throw Error('Utiliser uniquement une URL HTTPS de base, sans identifiants ni paramètres.');
}
const expected=[
 {path:'/',marker:'studio'},
 {path:'/catalogue.html',marker:'catalogue'},
 {path:'/contact.html',marker:'id="contactForm"',forbid:'issues/new'},
 {path:'/beta.html',marker:'id="beta-form"',also:['noindex,nofollow','connect-src &#39;none&#39;']},
 {path:'/univers/outils/outils/assistant-messages.html',marker:'message-studio.js'},
 {path:'/univers/outils/outils/atelier-automatisation.html',marker:'workflow-studio.js'},
 {path:'/univers/outils/outils/atelier-visuels.html',marker:'visual-studio.js'},
 {path:'/univers/outils/outils/atelier-sites-web.html',marker:'web-builder.js'},
 {path:'/univers/outils/outils/atelier-video.html',marker:'storyboard-studio.js'},
 {path:'/univers/outils/outils/atelier-recherche.html',marker:'research-studio.js'},
 {path:'/assets/beta-test.js',marker:'beta-progress-label'}
];
const denied=[
 '/tests/security-static.cjs',
 '/scripts/verify-release.cjs',
 '/docs/SESSIONS_LIVRAISONS_VISIBLES_2026-11-06.md',
 '/README.md',
 '/.env',
 '/.vercelignore'
];
async function fetchWithTimeout(url){
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),12000);
 try{return await fetch(url,{signal:controller.signal,redirect:'manual',headers:{Accept:'text/html, text/plain, */*'}})}
 finally{clearTimeout(timeout)}
}
async function inspect({path,marker,also=[],forbid},shouldExist){
 const url=new URL(path.slice(1),base);
 const res=await fetchWithTimeout(url);
 if(shouldExist){
  assert.equal(res.status,200,path+' : attendait HTTP 200, obtenu '+res.status);
  const text=await res.text();
  assert.ok(text.includes(marker),path+' : contenu attendu absent (authentification, erreur ou mauvaise version ?)');
  for(const word of also)assert.ok(text.includes(word),path+' : marqueur absent '+word);
  if(forbid)assert.ok(!text.includes(forbid),path+' : formulaire public encore présent');
  if(path==='/'){
   assert.equal(res.headers.get('x-content-type-options'),'nosniff','En-tête X-Content-Type-Options non servi');
   assert.equal(res.headers.get('x-frame-options'),'SAMEORIGIN','En-tête anti-framing absent');
   assert.ok(res.headers.get('content-security-policy')?.includes("object-src 'none'"),'CSP globale absente');
  }
 }else{
  assert.ok([403,404].includes(res.status),path+' : ressource interne exposée (HTTP '+res.status+')');
 }
 return {path,status:res.status};
}
async function main(){
 const tasks=[...expected.map(x=>({...x,shouldExist:true})),...denied.map(path=>({path,shouldExist:false}))];
 const failures=[];let successes=0;
 for(let start=0;start<tasks.length;start+=4){
  const batch=tasks.slice(start,start+4);
  const results=await Promise.allSettled(batch.map(async t=>inspect(t,t.shouldExist)));
  for(let i=0;i<results.length;i++){
   const r=results[i];if(r.status==='fulfilled'){
    console.log('OK   '+r.value.status+' '+r.value.path);successes++;
   }else{
    console.error('FAIL '+batch[i].path+' '+(r.reason?.message||String(r.reason)));
    failures.push(batch[i].path);
   }
  }
 }
 console.log('\nContrôles HTTP : '+successes+'/'+tasks.length+' satisfaits.');
 if(failures.length){
  console.error('Production non prête : '+failures.join(', '));
  process.exitCode=1;
 }else{
  console.log('Liens, barrières statiques et en-têtes vérifiés. La recette visuelle WebGL, mobile et IA doit encore être réalisée.');
 }
}
if(require.main===module)main().catch(err=>{console.error(err);process.exitCode=1});
module.exports={inspect,expected,denied};
