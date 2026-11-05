/* Tests du module de conversion du coffre, sans navigateur et sans paiement. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('assets/product-cinema.js');
const base={};vm.runInNewContext(read('assets/data.js'),{window:base});
assert.equal(base.TESTIA_PRODUCTS.length,11);
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.style={};this.dataset={};this.attributes={};this.hidden=false;this.inert=true;this.offsetHeight=3200;this.textContent='';}
 append(...elements){this.children.push(...elements)}
 replaceChildren(...elements){this.children=elements}
 before(){}
 setAttribute(k,v){this.attributes[k]=String(v)}
 removeAttribute(k){delete this.attributes[k]}
 addEventListener(){}
 getBoundingClientRect(){return{top:0}}
 querySelectorAll(){return[]}
}
function scenario(product,change){
 const ids={};
 for(const id of ['cinemaProduct','cinemaVault','world','vaultState','vaultDescription','vaultTitle','vaultPrimary','vaultSecondary','vaultOffer','vaultOfferFamily','vaultOfferTitle','vaultOfferLead','vaultOfferFormat','vaultOfferStatus','vaultOfferFeatures','vaultOfferPrimary','vaultOfferSecondary','vaultOfferNotice'])
  ids[id]=new Element('div');
 const state={open:1},events={},queue=[];
 const p=Object.assign({},product,change||{});
 const win={...base,TESTIA_PRODUCTS:base.TESTIA_PRODUCTS.map(x=>x.id===p.id?p:x),
  scrollY:0,innerWidth:1280,innerHeight:800,
  addEventListener(k,callback){events[k]=callback},
  matchMedia(){return{matches:false}},
  rotationScene:{getVaultState(){return{open:state.open}},setProgress(){},setVaultProgress(){},setChapter(){}}
 };
 ids.cinemaVault.getBoundingClientRect=()=>({top:5000-win.scrollY});
 let ready;
 const doc={getElementById:k=>ids[k],createElement:tag=>new Element(tag),
  querySelector(){return null},querySelectorAll:q=>q==='.cinema-panel[data-pose]'?ids.cinemaProduct.children:[],
  body:{classList:{contains(){return false}}},
  addEventListener(k,callback){if(k==='DOMContentLoaded')ready=callback}
 };
 const context={document:doc,window:win,location:{search:'?id='+p.id,hash:''},URL,URLSearchParams,
  requestAnimationFrame(callback){queue.push(callback)}};
 vm.runInNewContext(source,context,{timeout:1500});ready();
 ids.cinemaProduct.children.forEach((element,i)=>element.getBoundingClientRect=()=>({top:i*1000-win.scrollY}));
 function scroll(fraction,open=1){
  win.scrollY=5000+fraction*2400;
  state.open=open;
  events.scroll();
  const frame=queue.shift();
  if(frame)frame();
  return {visible:ids.vaultOffer.dataset.visible,hidden:ids.vaultOffer.attributes['aria-hidden'],inert:ids.vaultOffer.inert,opacity:Number(ids.vaultOffer.style.opacity),state:ids.vaultState.textContent};
 }
 return{p,ids,scroll};
}
for(const p of base.TESTIA_PRODUCTS){
 const {ids,scroll}=scenario(p);
 assert.equal(ids.cinemaProduct.children.length,5,'Cinq scènes conservées pour '+p.id);
 assert.equal(ids.vaultOfferTitle.textContent,p.title,'Le bon produit doit sortir du coffre');
 assert.equal(ids.vaultOfferFeatures.children.length,3,'Trois bénéfices présentés');
 assert.equal(ids.vaultOfferStatus.textContent,p.status,'Statut de vente fidèle');
 assert.equal(ids.vaultOffer.dataset.checkout,'unavailable','Aucune vente fictive');
 assert.match(ids.vaultOfferPrimary.href,/^\.\/univers\//,'Détails d’origine liés');
 assert.equal(ids.vaultOfferSecondary.href,'./contact.html?produit='+encodeURIComponent(p.id));
 assert.equal(scroll(.70).hidden,'true','Pas de vente avant ouverture du coffre');
 assert.equal(scroll(.94,1).inert,false,'Le module devient interactif quand le coffre est ouvert');
 assert.equal(scroll(.94,0).inert,true,'Le module n’est pas interactif si la serrure reste fermée');
 assert.equal(scroll(.08,1).hidden,'true','Le module se referme au retour');
}
const valid=scenario(base.TESTIA_PRODUCTS[0],{sellable:true,price:'49 €',checkoutUrl:'https://buy.stripe.com/test-placeholder'});
assert.equal(valid.ids.vaultOffer.dataset.checkout,'ready');
assert.equal(valid.ids.vaultOfferPrimary.href,'https://buy.stripe.com/test-placeholder');
assert.equal(valid.ids.vaultOfferPrimary.target,'_blank');
const invalid=scenario(base.TESTIA_PRODUCTS[0],{sellable:true,price:'49 €',checkoutUrl:'https://evil.example/checkout'});
assert.equal(invalid.ids.vaultOffer.dataset.checkout,'unavailable');
console.log('OK : 11 offres, révélation synchronisée, fermeture et liens de paiement filtrés. Aucune transaction exécutée.');
