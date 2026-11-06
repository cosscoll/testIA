/* Vérifications de l'API IA, sans réseau ni consommation de tokens. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../api/chat.js'),'utf8');
const moduleSandbox={exports:{}};let externalCalls=0;
const sandbox={module:moduleSandbox,process:{env:{}},console,
  fetch(){externalCalls++;throw Error('Le test ne doit jamais contacter une IA externe')},
  AbortSignal:{timeout(){return null}}
};
vm.runInNewContext(source,sandbox,{filename:'api/chat.js',timeout:1500});
const api=moduleSandbox.exports;
const req=async(method,body,origin='https://testia-unifie.vercel.app')=>{
 let status,answer;
 const res={statusCode:200,setHeader(){},end(x){status=this.statusCode;answer=x?JSON.parse(x):{};}};
 await api({method,headers:{host:'testia-unifie.vercel.app',origin},body},res);
 return {status,answer};
};
(async()=>{
 const health=await req('GET');
 assert.equal(health.status,200);
 assert.equal(health.answer.ready,false);
 assert.equal(health.answer.reason,'not_configured');
 assert.equal(health.answer.freeModelOnly,true);
 assert.equal(externalCalls,0,'Le statut sans clé ne doit faire aucun appel externe');
 assert.equal((await req('POST',{messages:[]})).status,400,'Conversation invalide');
 assert.equal((await req('POST',{messages:[{role:'user',content:'Bonjour'}]})).status,503,'Pas de modèle configuré');
 assert.equal((await req('POST',{messages:[{role:'user',content:'Bonjour'}]},'https://site-malveillant.example')).status,403,'Origin non autorisée');
 assert.equal(externalCalls,0,'Aucun appel externe ne doit se produire');
 const reply=api._test.parseReply('Nous pouvons vous aider. [[offres:conciergerie]]');
 assert.equal(reply.products.length,1);
 assert.equal(reply.products[0].id,'conciergerie');
 assert.equal(api._test.parseReply('Aucune recommandation. [[offres:]]').products.length,0);

 // Fournisseur simulé : jamais de réseau réel, jamais de facturation.
 const configuredModule={exports:{}};
 let lookupCount=0,generationCount=0,stillFree=true;
 const fakeProvider={module:configuredModule,process:{env:{AI_GATEWAY_API_KEY:'faux_jeton_test_local'}},console,
  fetch:async(url)=>{
   if(String(url).endsWith('/models')){
    lookupCount++;
    return{ok:true,json:async()=>({data:[{id:'reflection/beam-free',
     pricing:{input:stillFree?'0':'0.02',output:'0'}}]})};
   }
   generationCount++;
   throw Error('La génération doit être bloquée si le modèle devient payant.');
  },
  AbortSignal:{timeout(){return null}}
 };
 vm.runInNewContext(source,fakeProvider,{filename:'api/chat.js',timeout:1500});
 const simulated=fakeProvider.module.exports;
 const fakeRequest=async(method,body)=>{
  let status,answer;
  const res={statusCode:200,setHeader(){},end(value){status=this.statusCode;answer=value?JSON.parse(value):{}}};
  await simulated({method,headers:{host:'testia-unifie.vercel.app',origin:'https://testia-unifie.vercel.app'},body},res);
  return{status,answer};
 };
 const healthResults=await Promise.all([fakeRequest('GET'),fakeRequest('GET'),fakeRequest('GET')]);
 assert.equal(healthResults.every(x=>x.status===200&&x.answer.ready===true),true,'Le health check fictif doit être prêt');
 assert.equal(lookupCount,1,'Trois GET simultanés ne doivent appeler /models qu’une fois');
 assert.equal((await fakeRequest('GET')).answer.ready,true,'Le GET suivant conserve le statut en cache');
 assert.equal(lookupCount,1,'Le cache de 30 secondes doit éviter une nouvelle requête fournisseur');
 stillFree=false;
 const blocked=await fakeRequest('POST',{messages:[{role:'user',content:'Bonjour'}]});
 assert.equal(blocked.status,503,'Si le tarif augmente, le POST doit refuser la génération malgré un GET en cache');
 assert.equal(blocked.answer.error,'free_model_unavailable','Erreur explicitement liée au tarif');
 assert.equal(lookupCount,2,'Chaque POST vérifie le tarif EN DIRECT, sans réutiliser le cache du GET');
 assert.equal(generationCount,0,'Aucune génération payante ne doit partir même si GET indiquait ready');
 console.log('OK : contrat IA, health GET dédupliqué et barrière tarifaire POST vérifiée sans réseau ni dépense.');

})().catch(error=>{console.error(error);process.exitCode=1});
