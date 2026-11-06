/* Test local manuel du questionnaire beta. Exécuter : node tests/beta-readiness.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('beta.html'),css=read('assets/beta-test.css'),script=read('assets/beta-test.js');
let checks=0,requests=0,copies=[],downloads=[],created=0,revoked=0;
const check=(ok,label)=>{assert.ok(ok,label);checks++};
check(html.includes('noindex,nofollow'),'La page beta doit être non indexable');
check(html.includes('http-equiv="Content-Security-Policy"'),'CSP du questionnaire beta absente');
check(html.includes('connect-src &#39;none&#39;'),'Le questionnaire ne doit autoriser aucun appel réseau');
check(html.includes('form-action &#39;none&#39;'),'La soumission de formulaire doit être bloquée par la CSP');
check(html.includes('script-src &#39;self&#39;'),'Les scripts beta doivent provenir du domaine courant');
check(!read('contact.html').includes('Canal public provisoire.'),'Le descriptif de Contact est obsolète');
check((html.match(/data-beta-task=/g)||[]).length===5,'Cinq missions attendues');
check((html.match(/data-beta-result/g)||[]).length===5,'Chaque mission doit être notée');
check(html.includes('href="./produit.html?id=redaction"'),'Test du coffre 3D manquant');
check(html.includes('href="./guide.html"'),'Guide hors IA manquant');
check(html.includes('assets/beta-test.css')&&html.includes('assets/beta-test.js'),'Ressources du questionnaire manquantes');
check(!html.includes('issues/new'),'Le compte rendu beta ne doit pas ouvrir GitHub public');
check(!html.includes('<form action=')&&!html.includes('type="submit"'),'Pas de soumission de formulaire');
check(!/(?:fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)/.test(script),'Persistance ou réseau détecté dans le questionnaire');
check(css.includes('max-width:980px')&&css.includes('max-width:550px'),'Adaptation mobile manquante');
const links=[...html.matchAll(/href="(\.\/[^"#]+)(?:#[^"]*)?"/g)].map(x=>x[1]);
for(const href of links){const dest=href.split('?')[0].slice(2);check(fs.existsSync(path.join(root,dest)),'Lien local manquant : '+href);}
const home=read('index.html');check((home.match(/class="op-card op-card--/g)||[]).length===5,'Les cinq étiquettes ont changé');
check(fs.existsSync(path.join(root,'univers/procedures/assets/apartment-scene.js')),'Scène du coffre absente');
check(fs.existsSync(path.join(root,'api/chat.js')),'Conseiller IA absent');
const contact=read('contact.html');
check(!contact.includes('issues/new'),'Contact ne doit pas ouvrir une Issue GitHub publique');
check(contact.includes('href="./beta.html"'),'Le lien de la beta manque sur Contact');
check(home.includes('href="./beta.html"'),'Le lien de la beta manque sur Accueil');

class Element{
 constructor(){this.value='';this.events={};this.dataset={};this.disabled=false;this.checked=false;this.textContent='';}
 addEventListener(k,fn){this.events[k]=fn}
 querySelector(){return this.result}
 append(x){this.child=x}
 click(){downloads.push(this.download)}
 remove(){}
 focus(){this.focused=true}
 select(){this.selected=true}
}
const ids=['beta-form','beta-device','beta-browser','beta-familiarity','beta-confusing','beta-bug','beta-improve','beta-progress-label','beta-progress','beta-copy','beta-export','beta-report','beta-status'];
const els=Object.fromEntries(ids.map(id=>[id,new Element()]));
const tasks=Array.from({length:5},(_,i)=>{const t=new Element();t.dataset.betaTask='Mission '+(i+1);t.result=new Element();return t;});
const doc={getElementById:id=>els[id],querySelectorAll:query=>query==='[data-beta-task]'?tasks:[],createElement:()=>new Element(),body:new Element()};
const sandbox={window:{},document:doc,
 navigator:{clipboard:{writeText:async text=>{copies.push(text)}}},
 URL:{createObjectURL(){created++;return 'blob:local'},revokeObjectURL(){revoked++}},
 Blob:class B{constructor(parts,opts){this.parts=parts;this.opts=opts}},
 setTimeout:fn=>fn(),fetch(){requests++;throw Error('Réseau interdit')}};
vm.runInNewContext(script,sandbox,{timeout:2000,filename:'assets/beta-test.js'});
check(els['beta-export'].disabled&&els['beta-copy'].disabled,'Export initial doit être désactivé');
tasks[0].result.value='Bloquée';els['beta-form'].events.change();
check(els['beta-progress'].value===1,'Progression incorrecte');
check(!els['beta-export'].disabled,'Export doit devenir disponible');
els['beta-bug'].value='Le coffre bloque le clic';els['beta-form'].events.input();
check(els['beta-report'].value.includes('Le coffre bloque le clic'),'Le retour doit suivre les modifications');
els['beta-export'].events.click();
check(downloads[0]==='studio-ia-retour-beta.txt','Fichier de synthèse invalide');
check(created===revoked,'Ressource temporaire non libérée');
(async()=>{
 await els['beta-copy'].events.click();
 check(copies[0]?.includes('Mission 1 : Bloquée'),'Le presse-papiers doit copier la mission');
 check(requests===0,'Requête réseau inattendue');
 console.log('OK — '+checks+' contrôles de questionnaire beta : missions, accessibilité statique, export local, confidentialité et intégrité des parcours.');
})().catch(error=>{console.error(error);process.exitCode=1});
