/* Studio IA — test du guide de choix, sans navigateur ni service externe.
   Exécution manuelle : node tests/offer-finder.cjs */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const catalog={};
vm.runInNewContext(read('assets/data.js'),{window:catalog},{timeout:1000});
class Element{
 constructor(tag){
  this.tagName=tag;this.children=[];this.attributes={};this.dataset={};
  this.hidden=false;this.listeners={};this.textContent='';this.href='';
 }
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(key,value){this.attributes[key]=String(value)}
 addEventListener(name,fn){this.listeners[name]=fn}
 closest(selector){return selector==='button[data-finder-topic]'&&this.dataset.finderTopic!==undefined?this:null}
 contains(el){return this===el||this.children.some(child=>child.contains?.(el))}
 querySelectorAll(selector){
  const found=[];
  const visit=node=>{
   if(selector==='[data-finder-topic]'&&node.dataset?.finderTopic!==undefined)found.push(node);
   if(selector==='[data-finder-mode]'&&node.dataset?.finderMode!==undefined)found.push(node);
   node.children?.forEach(visit);
  };
  visit(this);return found;
 }
}
const rootElement=new Element('section');
const modes=['procedures','outils','formations'].map(mode=>{
 const button=new Element('button');button.dataset.finderMode=mode;rootElement.append(button);return button;
});
const topics=new Element('div'),result=new Element('div'),prompt=new Element('p');
const ids={offerFinder:rootElement,offerFinderTopics:topics,offerFinderResult:result,offerFinderPrompt:prompt};
const document={
 getElementById:id=>ids[id],
 createElement:tag=>new Element(tag)
};
vm.runInNewContext(read('assets/offer-finder.js'),{document,window:catalog},{timeout:2000});
const flatten=element=>[element.textContent,...element.children.flatMap(flatten)].join(' | ');
const expected={
 procedures:['conciergerie',null],
 outils:['redaction','visuels','web','video','automatisation','analyse'],
 formations:['formation-3d','formation-agents','formation-auto','formation-quotidien']
};
const productById=Object.fromEntries(catalog.TESTIA_PRODUCTS.map(p=>[p.id,p]));
assert.equal(catalog.TESTIA_PRODUCTS.length,11,'Catalogue inattendu');
const covered=new Set();
let checks=0;
for(const mode of modes){
 const name=mode.dataset.finderMode;
 mode.listeners.click();checks++;
 assert.equal(topics.hidden,false,'Options non affichées');
 assert.equal(result.hidden,true,'Ancien résultat non effacé');
 assert.equal(mode.attributes['aria-pressed'],'true','Option inaccessible au clavier');
 const buttons=topics.querySelectorAll('[data-finder-topic]');
 assert.equal(buttons.length,expected[name].length,'Mauvais nombre de thèmes : '+name);
 for(const [index,button] of buttons.entries()){
  topics.listeners.click({target:button});checks++;
  assert.equal(result.hidden,false,'Résultat non affiché : '+name+index);
  assert.equal(button.attributes['aria-pressed'],'true','Sélection absente');
  const id=expected[name][index],content=flatten(result);
  if(!id){
   assert.match(content,/Pas de pack adapté/,'Un métier non couvert ne doit pas générer un faux produit');
   assert.doesNotMatch(content,/Conciergeries & locations courte durée/);
   continue;
  }
  const product=productById[id];
  assert.ok(product,'Produit inexistant : '+id);covered.add(id);
  assert.ok(content.includes(product.title),'Mauvais titre pour '+id);
  assert.ok(content.includes(product.status),'Disponibilité non affichée pour '+id);
  const actions=result.children.find(x=>x.children?.some(link=>link.href?.includes('produit.html?id='+id)));
  assert.ok(actions,'Lien vers la fiche 3D absent : '+id);
  assert.doesNotMatch(content,/Acheter maintenant|Inscription ouverte/,'Fausse disponibilité commerciale');
 }
}
assert.equal(covered.size,11,'Au moins une offre n’est pas recommandable');
const catalogueHtml=read('catalogue.html');
for(const file of ['assets/data.js','assets/offer-finder.js','assets/offer-finder.css']){
 assert.ok(catalogueHtml.includes(file),'Ressource non chargée : '+file);
}
assert.ok(catalogueHtml.includes('id="offerFinder"'),'Guide absent du catalogue');
assert.ok(!read('assets/offer-finder.js').includes('fetch('),'Le guide ne doit pas appeler un serveur');
console.log('OK : '+checks+' interactions, 12 sujets, 11 offres et cas sans pack vérifiés localement.');
