/* Studio IA — smoke test statique sans dépendance et sans appel réseau.
   Exécution manuelle : node tests/smoke-static.cjs
   Ne remplace pas une vraie recette navigateur (3D, mobile, performance). */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const pages=['index.html','catalogue.html','produit.html','atelier-produit.html','ressources.html','contact.html','guide.html'];
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
verify(exists('univers/outils/assets/message-studio.js'),'Nouveau moteur rédaction absent');
verify(exists('univers/outils/assets/message-studio.css'),'Nouveau style rédaction absent');
const rédaction=read('univers/outils/outils/assistant-messages.html');
verify(rédaction.includes('assets/message-studio.js'),'Atelier de rédaction non chargé');
verify(rédaction.includes('id="promptOutput"'),'Prompt à copier indisponible');
verify(rédaction.includes('id="messageQuality"'),'Contrôles de qualité indisponibles');
verify(rédaction.includes('unified-advisor.js'),'Le conseiller IA manque sur le nouvel atelier');
verify(rédaction.includes('assets/data.js'),'Le conseiller IA manque ses données catalogue');
verify(read('univers/outils/pack-redaction.html').includes('quatre formats'),'La vitrine ne présente pas la nouvelle démo');
verify(exists('univers/outils/outils/atelier-automatisation.html'),'Nouvel atelier de workflows absent');
verify(exists('univers/outils/assets/workflow-studio.js'),'Moteur de workflows absent');
verify(exists('univers/outils/assets/workflow-studio.css'),'Styles workflow absents');
const workflowPage=read('univers/outils/outils/atelier-automatisation.html');
verify(workflowPage.includes('workflow-studio.js'),'Le nouveau moteur n’est pas chargé');
verify(workflowPage.includes('id="wf-approve"'),'Validation fictive absente de la page');
verify(exists('univers/outils/outils/atelier-visuels.html'),'Atelier visuel absent');
verify(exists('univers/outils/assets/visual-studio.js'),'Moteur graphique absent');
verify(exists('univers/outils/assets/visual-studio.css'),'Styles atelier visuel absents');
const visuelPage=read('univers/outils/outils/atelier-visuels.html');
verify(visuelPage.includes('visual-studio.js'),'Moteur visuel non chargé');
verify(visuelPage.includes('id="vs-preview"'),'Aperçu graphique absent');
verify(visuelPage.includes('id="vs-export-svg"'),'Export SVG absent');
verify(visuelPage.includes('id="vs-export-png"'),'Export PNG absent');
verify(visuelPage.includes('unified-advisor.js'),'Conseiller commun disparu de la nouvelle page');
verify(read('univers/outils/pack-visuel.html').includes('./outils/atelier-visuels.html'),'Lien atelier absent de la page Banque Visuels');
verify(exists('univers/outils/outils/atelier-sites-web.html'),'Atelier web absent');
verify(exists('univers/outils/assets/web-builder.js'),'Moteur web absent');
verify(exists('univers/outils/assets/web-builder.css'),'Styles atelier web absents');
const webPage=read('univers/outils/outils/atelier-sites-web.html');
verify(webPage.includes('web-builder.js'),'Moteur web non chargé');
verify(webPage.includes('sandbox=""'),'Aperçu iframe non isolé');
verify(webPage.includes('id="wb-download-html"'),'Export HTML indisponible');
verify(webPage.includes('id="wb-export-brief"'),'Export brief web indisponible');
verify(webPage.includes('unified-advisor.js'),'Conseiller commun absent de l’atelier web');
verify(read('univers/outils/pack-sites-web.html').includes('./outils/atelier-sites-web.html'),'Lien de l’atelier absent de la banque Web');
verify(exists('univers/outils/outils/atelier-video.html'),'Atelier storyboard absent');
verify(exists('univers/outils/assets/storyboard-studio.js'),'Moteur storyboard absent');
verify(exists('univers/outils/assets/storyboard-studio.css'),'Style storyboard absent');
const storyboardPage=read('univers/outils/outils/atelier-video.html');
verify(storyboardPage.includes('storyboard-studio.js'),'Atelier storyboard non lié');
verify(storyboardPage.includes('id="sb-export-srt"'),'Export SRT manquant');
verify(storyboardPage.includes('id="sb-import"'),'Import JSON manquant');
verify(storyboardPage.includes('unified-advisor.js'),'Conseiller commun absent de l’atelier storyboard');
verify(read('univers/outils/pack-video-audio.html').includes('./outils/atelier-video.html'),'Vitrine vidéo sans lien vers le storyboard');
verify(exists('univers/outils/outils/atelier-recherche.html'),'Atelier recherche absent');
verify(exists('univers/outils/assets/research-studio.js'),'Moteur recherche absent');
verify(exists('univers/outils/assets/research-studio.css'),'Styles recherche absents');
const researchPage=read('univers/outils/outils/atelier-recherche.html');
verify(researchPage.includes('research-studio.js'),'Atelier recherche non chargé');
verify(researchPage.includes('id="ra-results"'),'Comparaison des sources absente');
verify(researchPage.includes('id="ra-export-json"'),'Sauvegarde JSON de recherche absente');
verify(researchPage.includes('unified-advisor.js'),'Conseiller commun absent de l’atelier de recherche');
verify(read('univers/outils/pack-recherche-analyse.html').includes('./outils/atelier-recherche.html'),'Page produit sans lien vers l’atelier');


verify(read('univers/outils/pack-automatisation.html').includes('./outils/atelier-automatisation.html'),'La page produit ne relie pas l’atelier workflow');


verify(read('contact.html').includes('contact-draft.js'),'Module contact absent');
verify(read('assets/guide-viewer.js').includes("unsafe protocol"),'Liens dangereux non filtrés du guide');
verify(read('assets/product-cinema.js').includes('COFFRE — APERÇU STATIQUE'),'Fallback 3D ambigu');

const home=read('index.html');
verify((home.match(/class="op-card op-card--/g)||[]).length===5,'Les cinq étiquettes doivent rester présentes');
const cinema=read('assets/product-cinema.js');
verify(cinema.includes('deep.page||collectionUrl'),'Accès direct produit manquant');
verify(cinema.includes('setVaultProgress'),'Animation du coffre non pilotée');
verify(exists('univers/procedures/assets/apartment-scene.js'),'Scène 3D d’origine manquante');
// Contrôle syntaxique systématique, y compris les fiches ajoutées entre deux sessions.
new vm.Script(read('assets/data.js'),{filename:'assets/data.js'});
new vm.Script(read('assets/resources-data.js'),{filename:'assets/resources-data.js'});
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
verify(browser.STUDIO_RESOURCES.length===42,'La bibliothèque doit présenter 26 ressources importées + 11 ateliers de fiches + 5 ateliers pratiques supplémentaires');
vm.runInNewContext(read('assets/product-depth-data.js'),{window:browser},{timeout:1000});
verify(Object.keys(browser.STUDIO_PRODUCT_DEPTH).length===11,'Chaque offre doit avoir un atelier');
for(const product of browser.TESTIA_PRODUCTS){
 const atelier=browser.STUDIO_PRODUCT_DEPTH[product.id];
 verify(Boolean(atelier),'Atelier absent : '+product.id);
 verify(Array.isArray(atelier.phases)&&atelier.phases.length>=4,'Progression trop courte : '+product.id);
 verify(atelier.sample.fields.length>=4,'Brief incomplet : '+product.id);
 verify(atelier.sample.exampleAnswers.length===atelier.sample.fields.length,'Exemple fictif incomplet : '+product.id);
 verify(atelier.criteria.length>=4,'Critères de qualité manquants : '+product.id);
 verify(browser.STUDIO_RESOURCES.some(r=>r.id==='atelier-'+product.id),'Atelier non listé : '+product.id);
}
verify(read('produit.html').includes('id="vaultOfferWorkshop"'),'Lien atelier coffre absent');
verify(read('assets/product-cinema.js').includes('atelier-produit.html?id='),'Accès atelier depuis les scènes absent');
verify(read('assets/offer-finder.js').includes('atelier-produit.html?id='),'Accès atelier depuis le guide de choix absent');
verify(read('catalogue.html').includes('assets/catalogue-actions.css'),'Style du double accès catalogue absent');
verify(read('assets/site.js').includes('fillCatalogueCards(grid,filtered)'),'L’accès direct aux ateliers manque dans les cartes catalogue');
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
for(const script of ['assets/product-depth-data.js','assets/product-depth.js','assets/site.js','assets/product-cinema.js','assets/unified-advisor.js','assets/resource-hub.js','api/chat.js','assets/contact-draft.js','assets/guide-viewer.js']){
 new vm.Script(read(script),{filename:script});
 count++;
}
const lum=h=>{const rgb=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
const ratio=(a,b)=>{const A=lum(a),B=lum(b);return(Math.max(A,B)+.05)/(Math.min(A,B)+.05)};
verify(ratio('#111827','#FF6A3D')>=4.5,'Contraste texte/CTA insuffisant');
console.log('OK — '+count+' vérifications statiques. Animations WebGL, mobile et chatbot distant à tester dans un vrai navigateur.');
