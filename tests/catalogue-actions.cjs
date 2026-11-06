/* Studio IA — catalogue : chaque offre doit proposer un essai gratuit direct.
   Test simulé sans navigateur, sans réseau et sans vente. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const browser={};vm.runInNewContext(read('assets/data.js'),{window:browser});
class Elem{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.textContent='';this.value='';this.hidden=false;this.className='';this.href='';this.listeners={};}
 append(...x){this.children.push(...x)}
 appendChild(x){this.children.push(x);return x}
 replaceChildren(...x){this.children=x}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,v){this.listeners[k]=v}
 get classList(){return {add:(...names)=>{this.className+=(this.className?' ':'')+names.join(' ')}}}
}
const ids={catalogueGrid:new Elem('div'),catalogSearch:new Elem('input'),catalogCount:new Elem('strong'),emptyState:new Elem('p')};
const modes=['all','procedures','outils','formations'].map(type=>{const b=new Elem('button');b.dataset.filter=type;return b});
const events={};const document={
 createElement:tag=>new Elem(tag),getElementById:id=>ids[id]||null,
 querySelectorAll:selector=>selector==='[data-filter]'?modes:[],
 querySelector:()=>null,
 addEventListener:(name,callback)=>events[name]=callback
};
const context={window:{...browser,addEventListener(){}},document,location:{search:'',href:'https://example.test/catalogue.html'},history:{replaceState(){}},URL,URLSearchParams,console};
vm.runInNewContext(read('assets/site.js'),context,{timeout:1500});
assert.equal(typeof events.DOMContentLoaded,'function');
events.DOMContentLoaded();
let checks=0;
function verify(v,message){assert.ok(v,message);checks++}
verify(ids.catalogueGrid.children.length===11,'Onze produits attendus au catalogue');
for(const product of browser.TESTIA_PRODUCTS){
 const item=ids.catalogueGrid.children.find(x=>x.dataset.productId===product.id);
 verify(!!item,'Offre absente : '+product.id);
 verify(item.tagName==='article','Chaque offre doit avoir un conteneur indépendant : '+product.id);
 verify(item.children.length===2,'Présentation et actions séparées : '+product.id);
 const [presentation,actions]=item.children;
 const workshop=actions.children[0];
 verify(presentation.tagName==='a'&&presentation.href==='./produit.html?id='+product.id,'Lien 3D absent : '+product.id);
 verify(workshop.tagName==='a'&&workshop.href==='./atelier-produit.html?id='+product.id,'Lien gratuit absent : '+product.id);
 verify(!presentation.children.includes(workshop),'Liens imbriqués invalides : '+product.id);
 verify(workshop.textContent==='Essayer l’atelier gratuit','Texte du bouton erroné : '+product.id);
}
const outils=modes.find(x=>x.dataset.filter==='outils');
outils.listeners.click();
verify(ids.catalogueGrid.children.length===6,'Filtre outils ne présente pas six offres');
verify(ids.catalogueGrid.children.every(x=>x.dataset.type==='outils'),'Le filtre outils mélange les familles');
ids.catalogSearch.value='automatisation';
ids.catalogSearch.listeners.input();
verify(ids.catalogueGrid.children.length===1,'Recherche ne réduit pas à une offre');
verify(ids.catalogueGrid.children[0].dataset.productId==='automatisation','Recherche retourne un mauvais produit');
verify(ids.catalogueGrid.children[0].children[1].children[0].href==='./atelier-produit.html?id=automatisation','Bouton atelier perdu après filtrage');
const html=read('catalogue.html');
verify(html.includes('assets/catalogue-actions.css'),'Feuille de style catalogue non chargée');
verify(!html.includes('Acheter maintenant'),'Aucun achat fictif ne doit être présenté');
console.log('OK — '+checks+' contrôles : 11 offres, 11 ateliers indépendants, filtre et recherche.');
