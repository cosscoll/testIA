/* Recette locale LIV-02 — aucun réseau ni modèle payant. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'univers/outils/assets/message-studio.js'),'utf8');
const html=fs.readFileSync(path.join(root,'univers/outils/outils/assistant-messages.html'),'utf8');
const css=fs.readFileSync(path.join(root,'univers/outils/assets/message-studio.css'),'utf8');
let count=0,requests=0,copied='',downloads=0,created=0,revoked=0;
function check(ok,message){assert.ok(ok,message);count++;}
class Element{
 constructor(tag='div',value=''){this.tagName=tag;this.value=value;this.textContent='';this.dataset={};this.listeners={};this.children=[];this.attributes={};this.disabled=false;}
 addEventListener(key,fn){this.listeners[key]=fn;}
 replaceChildren(...items){this.children=items;}
 append(...items){this.children.push(...items);}
 appendChild(item){this.children.push(item);return item;}
 setAttribute(key,value){this.attributes[key]=String(value);}
 reportValidity(){return true;}
 focus(){}
 select(){}
 click(){downloads++;}
 remove(){}
}
const values={business:'Atelier Papier',audience:'les commerces de quartier',offer:'un atelier de création d’affiches sur mesure',benefit:'concevoir une affiche claire',proof:'chaque affiche est relue avant impression',cta:'Écrivez-nous pour discuter de votre prochain support',channel:'email',tone:'warm'};
const nodes=Object.fromEntries(Object.entries(values).map(([id,value])=>[id,new Element('input',value)]));
for(const id of ['messageForm','messageOutput','promptOutput','messageStatus','messageCount','messageQuality','messageScore','copyMessage','saveMessage','copyPrompt','resetMessage'])nodes[id]=new Element();
const examples=['atelier','conseil','artisan'].map(id=>{const node=new Element('button');node.dataset.example=id;return node;});
const document={getElementById:id=>nodes[id]||null,querySelectorAll:s=>s==='[data-example]'?examples:[],createElement:tag=>new Element(tag),body:new Element('body')};
const sandbox={window:{},document,console,
 navigator:{clipboard:{writeText:async text=>{copied=text;}}},
 Blob:class FakeBlob{constructor(parts,options){this.parts=parts;this.options=options;}},
 URL:{createObjectURL(){created++;return'blob:local';},revokeObjectURL(){revoked++;}},
 setTimeout:callback=>callback(),
 fetch(){requests++;throw Error('Accès distant interdit dans cette recette');}
};
vm.runInNewContext(script,sandbox,{filename:'message-studio.js',timeout:2000});
const core=sandbox.window.STUDIO_MESSAGE_CORE;
check(typeof core?.build==='function','Moteur absent');
check(nodes.messageOutput.value.includes('Atelier Papier'),'Aucun exemple au chargement');
check(nodes.messageScore.textContent==='5 / 5 repères satisfaits','Score initial incorrect');
check(nodes.messageQuality.children.length===5,'Cinq repères attendus');
for(const channel of ['email','relance','post','web']){
 for(const tone of ['pro','warm','direct']){
  const v={...values,channel,tone},text=core.build(v);
  check(text.includes(v.business)&&text.includes(v.offer)&&text.includes(v.cta),'Champs absents : '+channel+'/'+tone);
  check(core.quality(v,text).length===5,'Checklist incomplète : '+channel+'/'+tone);
  check(core.buildPrompt(v,text).includes('sans inventer'),'Consigne de fiabilité absente : '+channel+'/'+tone);
  check(core.wordCount(text)>15,'Message trop court : '+channel+'/'+tone);
 }
}
check(!core.valid({...values,cta:''}),'Brief sans CTA accepté');
check(core.build({...values,channel:'inconnu'})==='','Format invalide accepté');
const noProof={...values,proof:''};
check(!core.quality(noProof,core.build(noProof)).find(x=>x.key==='proof').ok,'Preuve manquante non signalée');
nodes.channel.value='relance';
nodes.messageForm.listeners.submit({preventDefault(){}});
check(nodes.messageOutput.value.includes('Suite à notre échange'),'Relance non générée');
examples[2].listeners.click();
check(nodes.business.value==='Les Ateliers du Bois','Exemple artisan manquant');
check(nodes.channel.value==='web','Exemple artisan sans format web');
nodes.messageOutput.value+='\n\n[À compléter]';
nodes.messageOutput.listeners.input();
check(nodes.messageScore.textContent==='4 / 5 repères satisfaits','Champ incomplet non détecté');
nodes.messageOutput.value='Texte corrigé librement.';
nodes.messageOutput.listeners.input();
(async()=>{
 await nodes.copyMessage.listeners.click();
 check(copied==='Texte corrigé librement.','La copie ne suit pas les modifications');
 await nodes.copyPrompt.listeners.click();
 check(copied.includes('Texte corrigé librement.'),'Le prompt ne suit pas les modifications');
 nodes.saveMessage.listeners.click();
 check(downloads===1&&created===1&&revoked===1,'Export ou nettoyage incorrect');
 nodes.resetMessage.listeners.click();
 check(nodes.business.value==='Atelier Papier'&&nodes.channel.value==='email','Réinitialisation incorrecte');
 check(nodes.messageScore.textContent==='5 / 5 repères satisfaits','Recalcul absent au retour');
 check(html.includes('assets/message-studio.js')&&html.includes('id="promptOutput"'),'HTML non lié au module');
 check(css.includes('prefers-reduced-motion'),'Animation réduite manquante');
 check(requests===0,'Appel réseau depuis le module');
 console.log('OK : '+count+' vérifications LIV-02, 4 formats × 3 tons, copie, export et relecture.');
})().catch(error=>{console.error(error);process.exitCode=1;});
