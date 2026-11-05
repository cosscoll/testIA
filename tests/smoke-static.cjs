/* Studio IA — smoke test statique sans dépendance et sans appel réseau.
   Exécution manuelle : node tests/smoke-static.cjs
   Ne remplace pas une vraie recette navigateur (3D, mobile, performance). */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const pages=['index.html','catalogue.html','produit.html','ressources.html','contact.html','guide.html'];
const exists=relative=>fs.existsSync(path.join(root,relative));
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
let count=0;
const verify=(condition,label)=>{assert.ok(condition,label);count++;};
const resolve=(file,ref)=>{
 if(!ref||/^(?:#|(?:[a-z][a-z0-9+.-]*:)|\/\/|data:)/i.test(ref))return null;
 const pathname=decodeURIComponent(ref.split(/[?#]/)[0]);
 if(!pathname)return null;
 const target=pathname.startsWith('/')?pathname.slice(1):path.posix.normalize(path.posix.join(path.posix.dirname(file),pathname));
 if(target.startsWith('../'))throw Error('Sortie hors du dépôt : '+file+' → '+ref);
 return target;
};
for(const page of pages){
 verify(exists(page),'Page manquante : '+page);
 const html=read(page);
 verify(html.includes('assets/charte-control-03.css'),'Charte CONTROL absente : '+page);
 verify(html.includes('href="./ressources.html"'),'Navigation ressources manquante : '+page);
 verify(html.includes('content="#FFF5EE"'),'Couleur du navigateur incohérente : '+page);
 const refs=[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(m=>m[1]);
 for(const ref of refs){const file=resolve(page,ref);if(file)verify(exists(file)||exists(path.posix.join(file,'index.html')),'Lien local introuvable : '+page+' → '+ref);}
}
// Vérification de toutes les pages importées : repérer une référence locale manquante
// avant qu'elle ne soit poussée sur la version publique.
const imported=[];
function collectHtml(dir){
 for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
  const filename=path.posix.join(dir,entry.name);
  if(entry.isDirectory())collectHtml(filename);
  else if(entry.isFile()&&filename.endsWith('.html'))imported.push(filename);
 }
}
collectHtml('univers');
verify(imported.length>=38,'La bibliothèque importée semble incomplète');
for(const page of imported){
 const html=read(page);
 const refs=[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
 for(const ref of refs){
  const file=resolve(page,ref);
  if(file)verify(exists(file)||exists(path.posix.join(file,'index.html')),'Lien local importé introuvable : '+page+' → '+ref);
 }
}
verify(read('contact.html').includes('id="contactCopy"'),'Copie locale de brouillon absente');
verify(read('contact.html').includes('contact-draft.js'),'Module contact absent');
verify(read('assets/guide-viewer.js').includes("unsafe protocol"),'Liens dangereux non filtrés du guide');
verify(read('assets/product-cinema.js').includes('COFFRE — APERÇU STATIQUE'),'Fallback 3D ambigu');

const home=read('index.html');
verify((home.match(/class="op-card op-card--/g)||[]).length===5,'Les cinq étiquettes doivent rester présentes');
const cinema=read('assets/product-cinema.js');
verify(cinema.includes('deep.page||collectionUrl'),'Accès direct produit manquant');
verify(cinema.includes('setVaultProgress'),'Animation du coffre non pilotée');
verify(exists('univers/procedures/assets/apartment-scene.js'),'Scène 3D d’origine manquante');
const browser={};
vm.runInNewContext(read('assets/data.js'),{window:browser},{timeout:1000});
verify(browser.TESTIA_PRODUCTS.length===11,'Le catalogue doit présenter 11 produits');
verify(Object.keys(browser.TESTIA_DEEP).length===11,'Chaque produit doit avoir une page détaillée');
for(const product of browser.TESTIA_PRODUCTS){
 const detail=browser.TESTIA_DEEP[product.id];
 verify(Boolean(detail),'Détail absent : '+product.id);
 verify(exists(resolve('index.html',detail.page)),'Page originale absente : '+product.id);
}
vm.runInNewContext(read('assets/resources-data.js'),{window:browser},{timeout:1000});
verify(browser.STUDIO_RESOURCES.length===26,'La bibliothèque doit présenter 26 ressources');
for(const resource of browser.STUDIO_RESOURCES){
 verify(exists(resolve('index.html',resource.url)),'Ressource introuvable : '+resource.id);
}
for(const page of ['ressources.html','guide.html']){
 verify(read(page).includes('unified-advisor.js'),'Assistant absent : '+page);
 verify(read(page).includes('assets/data.js'),'Données catalogue absentes : '+page);
}
const advisor=read('assets/unified-advisor.js');
verify(advisor.includes('if(!canSend)'),'Le client doit bloquer les générations non disponibles');
verify(advisor.includes('Réessayer la vérification'),'Nouvelle vérification manquante');
for(const script of ['assets/site.js','assets/product-cinema.js','assets/unified-advisor.js','assets/resource-hub.js','api/chat.js','assets/contact-draft.js','assets/guide-viewer.js']){
 new vm.Script(read(script),{filename:script});
 count++;
}
const lum=h=>{const rgb=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
const ratio=(a,b)=>{const A=lum(a),B=lum(b);return(Math.max(A,B)+.05)/(Math.min(A,B)+.05)};
verify(ratio('#111827','#FF6A3D')>=4.5,'Contraste texte/CTA insuffisant');
console.log('OK — '+count+' vérifications statiques. Animations WebGL, mobile et chatbot distant à tester dans un vrai navigateur.');
