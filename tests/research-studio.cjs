/* LIV-04D — recette manuelle sans réseau de la matrice Recherche & analyse.
   Exécuter : node tests/research-studio.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const code=read('univers/outils/assets/research-studio.js');
const html=read('univers/outils/outils/atelier-recherche.html');
const css=read('univers/outils/assets/research-studio.css');
let count=0,downloads=[],created=0,revoked=0,networkCalls=0,copied='',blobs=[];
function check(value,label){assert.ok(value,label);count++}
class Elem{
 constructor(tag='div'){this.tagName=tag;this.value='';this.textContent='';this.children=[];this.events={};this.attrs={};this.dataset={};this.hidden=false;this.disabled=false;this.checked=false;this.files=[];}
 addEventListener(type,fn){this.events[type]=fn}
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=els}
 setAttribute(key,value){this.attrs[key]=String(value)}
 click(){downloads.push({name:this.download,href:this.href})}
 focus(){this.focused=true}
 select(){this.selected=true}
 remove(){this.removed=true}
}
const ids=['researchStudio','ra-question','ra-options','ra-add-option','ra-new-title','ra-new-note','ra-new-option','ra-new-stance','ra-new-kind','ra-new-url','ra-new-date','ra-add-source','ra-sources','ra-source-count','ra-results','ra-quality','ra-score','ra-errors','ra-summary','ra-copy','ra-export-md','ra-export-csv','ra-export-json','ra-import','ra-status'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Elem()]));
const examples=['contact','projet','vitrine'].map(name=>{const b=new Elem('button');b.dataset.raExample=name;return b});
const document={getElementById:id=>nodes[id]||null,
 querySelectorAll:selector=>selector==='[data-ra-example]'?examples:[],
 createElement:tag=>new Elem(tag),body:new Elem('body')};
const sandbox={window:{},document,URL,console,
 Blob:class LocalBlob{constructor(parts,options){this.parts=parts;this.type=options.type;blobs.push(this)}},
 setTimeout:fn=>fn(),
 navigator:{clipboard:{writeText:async value=>{copied=value}}},
 fetch(){networkCalls++;throw Error('Atelier sans réseau')}
};
sandbox.URL=class URLWithObjects extends URL{};
sandbox.URL.createObjectURL=()=>{created++;return'blob:local'};
sandbox.URL.revokeObjectURL=()=>{revoked++};
vm.runInNewContext(code,sandbox,{timeout:2500,filename:'research-studio.js'});
const core=sandbox.window.STUDIO_RESEARCH_CORE;
check(typeof core?.markdown==='function','Moteur Recherche non chargé');
for(const [id,p] of Object.entries(core.presets)){
 check(core.validate(p).valid,'Exemple invalide '+id);
 check(core.compare(p).length===p.options.length,'Nombre de cartes incohérent');
 check(core.quality(p).length===6,'Six contrôles attendus');
 check(core.markdown(p).includes('Aucune source n’est consultée'),'Avertissement d’absence de recherche absent');
 check(core.csv(p).includes('option;position;'),'Entête CSV absente');
 check(core.json(p).includes('"autoVerified": false'),'JSON ne doit pas certifier les sources');
 check(core.importJson(core.json(p)).options.length===p.options.length,'Reprise JSON erronée');
}
check(!core.safeUrl('javascript:alert(1)'),'Protocole dangereux accepté');
check(!core.safeUrl('https://user:password@exemple.fr'),'URL avec mot de passe acceptée');
check(core.safeUrl('https://exemple.fr/page').startsWith('https://'),'HTTPS valide refusé');
check(!core.validate({...core.presets.contact,options:['Seulement une']}).valid,'Une seule option acceptée');
check(!core.validate({...core.presets.contact,options:['Doublon','doublon']}).valid,'Options dupliquées');
check(!core.validate({...core.presets.contact,sources:[{option:0,title:'Court',note:'court'}]}).valid,'Observation trop courte acceptée');
check(!core.validate({...core.presets.contact,sources:[{option:0,title:'Mauvais lien',note:'Observation à contrôler en totalité.',url:'javascript:alert(1)'}]}).valid,'Lien de source dangereux accepté');
const attack=core.csv({...core.presets.contact,sources:[{option:0,title:'=SUM(1,2)',note:'-IMPORTXML() formule saisie par erreur',stance:'for'}]});
check(attack.includes('"\'=SUM')&&attack.includes('"\'-IMPORTXML'),'Injection de formules CSV non neutralisée');
check(core.compare(core.presets.contact)[0].state==='Arguments contradictoires','Contradictions non signalées');
check(core.quality(core.presets.contact)[5].ok===false,'Exemples déclarés vérifiés à tort');
try{core.importJson('a'.repeat(70000));throw Error('Fichier énorme accepté')}catch(e){check(e.message.includes('64 Ko'),'Limite JSON incorrecte')}
check(nodes['ra-options'].children.length===3,'Options de départ absentes');
check(nodes['ra-sources'].children.length===4,'Observations initiales absentes');
check(nodes['ra-results'].children.length===3,'Comparaison initiale incorrecte');
check(nodes['ra-quality'].children.length===6,'Checklist visuelle absente');
check(nodes['ra-export-md'].disabled===false,'Export Markdown désactivé');
nodes['ra-add-option'].events.click();
check(nodes['ra-options'].children.length===4,'Ajout d’option impossible');
check(nodes['ra-add-option'].disabled===true,'Plafond de quatre options ignoré');
nodes['ra-options'].children[3].children[2].events.click();
check(nodes['ra-options'].children.length===3,'Suppression option impossible');
nodes['ra-new-title'].value='Observation ajoutée';
nodes['ra-new-note'].value='Une observation de démonstration suffisamment complète.';
nodes['ra-new-option'].value='1';
nodes['ra-new-stance'].value='against';
nodes['ra-new-kind'].value='internal';
nodes['ra-add-source'].events.click();
check(nodes['ra-sources'].children.length===5,'Ajout source impossible');
check(nodes['ra-summary'].value.includes('Observation ajoutée'),'Synthèse non actualisée');
const last=nodes['ra-sources'].children[4];
const titleInput=last.children[1].children[0].children[1];
titleInput.value='Titre modifié';titleInput.events.input();
check(nodes['ra-summary'].value.includes('Titre modifié'),'Edition source non reflétée');
const checked=last.children[1].children[7].children[0];
checked.checked=true;checked.events.change();
check(nodes['ra-results'].children[1].children[2].children[3].children[0].textContent==='1','Statut consulté non mis à jour');
last.children[0].children[1].events.click();
check(nodes['ra-sources'].children.length===4,'Suppression source impossible');
for(const kind of ['md','csv','json'])nodes['ra-export-'+kind].events.click();
check(downloads.length===3,'Trois exports attendus');
check(downloads.some(d=>d.name.endsWith('.md'))&&downloads.some(d=>d.name.endsWith('.csv'))&&downloads.some(d=>d.name.endsWith('.json')),'Extensions non conformes');
check(created===revoked,'Objets temporaires non libérés');
(async()=>{
 await nodes['ra-copy'].events.click();
 check(copied.includes('Synthèse de recherche'),'Copie de la note incorrecte');
 examples[1].events.click();
 check(nodes['ra-options'].children.length===2,'Changement d’exemple impossible');
 nodes['ra-import'].files=[{size:2000,text:async()=>core.json(core.presets.vitrine)}];
 await nodes['ra-import'].events.change();
 check(nodes['ra-question'].value===core.presets.vitrine.question,'JSON réimporté incorrectement');
 check(nodes['ra-status'].textContent.includes('réimportée'),'Confirmation de réimport manquante');
 nodes['ra-import'].files=[{size:90000,text:async()=>'{invalid'}];
 await nodes['ra-import'].events.change();
 check(nodes['ra-status'].textContent.includes('Import refusé'),'Fichier trop volumineux accepté');
 check(html.includes('research-studio.js')&&html.includes('id="ra-summary"'),'Page non connectée au module');
 check(css.includes('prefers-reduced-motion'),'Styles de mouvement réduit absents');
 check(read('assets/data.js').includes('atelier-recherche.html'),'Lien produit absent');
 check(read('assets/resources-data.js').includes("id:'o-research'"),'Bibliothèque non liée');
 check(networkCalls===0,'Réseau externe utilisé');
 console.log('OK — '+count+' contrôles Recherche : contradictions, sources, saisie, exports, JSON et sécurité.');
})().catch(e=>{console.error(e);process.exitCode=1;});
