/* Studio IA — test des 11 ateliers publics, sans navigateur ni réseau.
   Exécuter localement : node tests/product-depth.cjs
   Les tests simulent le DOM, les événements utilisateur et l'export .txt. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const store={};
vm.runInNewContext(read('assets/data.js'),{window:store});
vm.runInNewContext(read('assets/product-depth-data.js'),{window:store});
const products=store.TESTIA_PRODUCTS,depths=store.STUDIO_PRODUCT_DEPTH;
assert.equal(products.length,11);
assert.equal(Object.keys(depths).length,11);
class Element {
 constructor(tag='div'){
  this.tagName=tag;this.children=[];this.listeners={};this.attributes={};
  this.hidden=false;this.value='';this.disabled=false;this.checked=false;
  this.textContent='';this.href='';this.id='';
 }
 append(...children){this.children.push(...children)}
 setAttribute(key,val){this.attributes[key]=String(val)}
 querySelectorAll(query){
  const found=[];
  const visit=node=>{
   if(query==='input[type="checkbox"]'&&node.tagName==='input'&&node.type==='checkbox')found.push(node);
   node.children.forEach(visit);
  };
  visit(this);return found;
 }
 addEventListener(event,callback){this.listeners[event]=callback}
 click(){this.listeners.click?.({preventDefault(){}})}
 remove(){}
 focus(){}
 select(){}
}
const ids='depthTitle depthFocus depthPageLink depthSourceLink depthInventory depthForm depthCopy depthDownload depthDemo depthFamily depthStatus depthBefore depthAfter depthExerciseTitle depthExerciseContext depthClosing depthBack depthSteps depthProcedures depthRegisters depthFields depthChecks depthCheckCount depthOutput depthMessage'.split(' ');
const callbacks={};
let assertions=0;
function verify(condition,label){assert.ok(condition,label);assertions++}
function simulate(product){
 const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));
 const created=[];
 const body=new Element('body');let lastDownload=null;
 elements.depthInventory.hidden=true;
 elements.depthCopy.disabled=true;
 elements.depthDownload.disabled=true;
 const document={
  title:'',body,
  createElement(tag){
   const el=new Element(tag);created.push(el);
   if(tag==='a')el.click=function(){lastDownload={filename:this.download,href:this.href}};
   return el;
  },
  getElementById(id){return elements[id]||created.find(el=>el.id===id)||null}
 };
 const context={
  document,window:store,
  location:{search:'?id='+product.id},
  URLSearchParams,
  Blob:class FakeBlob{constructor(parts,settings){this.parts=parts;this.settings=settings}},
  URL:{createObjectURL(){return 'blob:test-artifact'},revokeObjectURL(){}},
  navigator:{clipboard:{async writeText(text){callbacks.copied=text}}},
  setTimeout(callback){callback()},
 };
 vm.runInNewContext(read('assets/product-depth.js'),context,{timeout:2000});
 return{elements,created,document,download:()=>lastDownload};
}
async function main(){
 const idsSeen=new Set(),totals={phases:0,fields:0,criteria:0};
 for(const product of products){
  const info=depths[product.id];
  verify(Boolean(info),'Atelier manquant : '+product.id);
  verify(Array.isArray(info.phases)&&info.phases.length>=4,'Progression trop courte : '+product.id);
  verify(info.sample?.fields.length>=4,'Champs incomplets : '+product.id);
  verify(info.criteria?.length>=4,'Critères insuffisants : '+product.id);
  verify(!idsSeen.has(product.id),'Identifiant produit dupliqué : '+product.id);
  idsSeen.add(product.id);
  totals.phases+=info.phases.length;totals.fields+=info.sample.fields.length;totals.criteria+=info.criteria.length;
  const {elements,created,download}=simulate(product);
  const find=id=>elements[id],fields=created.filter(el=>/^depthField\d+$/.test(el.id)),checks=find('depthChecks').querySelectorAll('input[type="checkbox"]');
  verify(find('depthTitle').textContent===product.title,'Titre incorrect : '+product.id);
  verify(find('depthSteps').children.length===info.phases.length,'Étapes incorrectes : '+product.id);
  verify(fields.length===info.sample.fields.length,'Formulaire incorrect : '+product.id);
  verify(checks.length===info.criteria.length,'Checklist incorrecte : '+product.id);
  verify(find('depthPageLink').href==='./produit.html?id='+product.id,'Retour cinéma incorrect : '+product.id);
  verify(find('depthDemo').href.startsWith('./'),'Lien externe inattendu : '+product.id);
  verify(find('depthCopy').disabled,'Copie active avant génération : '+product.id);
  verify(find('depthDownload').disabled,'Export actif avant génération : '+product.id);
  fields[0].value='Essai sans données personnelles';
  checks[0].checked=true;
  checks[0].listeners.change?.();
  find('depthForm').listeners.submit({preventDefault(){}});
  const draft=find('depthOutput').value;
  verify(draft.includes('Essai sans données personnelles'),'Champ non repris dans le document : '+product.id);
  verify(draft.includes('[x] '+info.criteria[0]),'Critère validé absent : '+product.id);
  verify(!find('depthDownload').disabled,'Export inaccessible : '+product.id);
  find('depthDownload').listeners.click();
  verify(download()?.filename==='atelier-studio-ia-'+product.id+'.txt','Export .txt invalide : '+product.id);
  // Un changement après génération invalide l'ancienne fiche au lieu de fournir un fichier périmé.
  fields[0].value='Deuxième formulation';
  find('depthFields').listeners.input();
  verify(find('depthOutput').value===''&&find('depthDownload').disabled,'Fiche périmée conservée : '+product.id);
  find('depthForm').listeners.submit({preventDefault(){}});
  verify(find('depthOutput').value.includes('Deuxième formulation'),'Régénération impossible : '+product.id);
  find('depthForm').listeners.reset();
  verify(find('depthOutput').value===''&&find('depthCopy').disabled,'Reset incomplet : '+product.id);
  verify(checks.every(box=>!box.checked),'Checklists non remises à zéro : '+product.id);
  if(product.id==='conciergerie'){
   verify(!find('depthInventory').hidden,'Inventaire métier masqué');
   verify(find('depthProcedures').children.length===15,'15 procédures attendues');
   verify(find('depthRegisters').children.length===7,'7 registres attendus');
  }else verify(find('depthInventory').hidden,'Inventaire métier erroné : '+product.id);
 }
 verify(totals.phases===49,'Total étapes attendu : 49');
 verify(totals.fields===55,'Total champs attendu : 55');
 verify(totals.criteria===44,'Total critères attendu : 44');
 for(const id of Object.keys(depths))verify(idsSeen.has(id),'Atelier non rattaché : '+id);
 console.log('OK — '+assertions+' assertions / 11 ateliers / 49 étapes / 55 champs / 44 critères ; génération locale, invalidation et remise à zéro.');
}
main().catch(error=>{console.error(error);process.exitCode=1});
