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
 console.log('OK : contrat de sécurité chatbot, 7 contrôles sans appel réseau ni dépense.');
})().catch(error=>{console.error(error);process.exitCode=1});
