/* LIV-04C — storyboard : données, export, scènes et reprise JSON.
   Exécuter manuellement : node tests/storyboard-studio.cjs. Aucun réseau. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('univers/outils/assets/storyboard-studio.js');
const html=read('univers/outils/outils/atelier-video.html'),css=read('univers/outils/assets/storyboard-studio.css');
let tests=0,downloads=[],blobs=[],urls=0,revokes=0,network=0;
const check=(value,label)=>{assert.ok(value,label);tests++};
class Elem{
 constructor(tag='div'){this.tagName=tag;this.value='';this.textContent='';this.children=[];this.attributes={};this.dataset={};this.events={};this.disabled=false;this.hidden=false;this.files=[];}
 addEventListener(name,fn){this.events[name]=fn}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=items}
 setAttribute(k,v){this.attributes[k]=String(v)}
 click(){downloads.push({name:this.download,href:this.href})}
 remove(){this.removed=true}
}
const ids=['storyboardStudio','sb-title','sb-audience','sb-format','sb-duration','sb-count','sb-editor-scenes','sb-add-scene','sb-errors','sb-quality','sb-checks','sb-stage-frame','sb-stage','sb-scene-time','sb-scene-voice','sb-scene-audio','sb-scenes-nav','sb-prev','sb-next','sb-export-json','sb-export-csv','sb-export-txt','sb-export-srt','sb-import','sb-status'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Elem()]));
const examples=['activite','evenement','service'].map(name=>{const b=new Elem('button');b.dataset.sbPreset=name;return b});
const doc={getElementById:id=>nodes[id]||null,querySelectorAll:q=>q==='[data-sb-preset]'?examples:[],createElement:tag=>new Elem(tag),body:new Elem('body')};
const sandbox={window:{},document:doc,console,
 Blob:class LocalBlob{constructor(parts,opts){this.parts=parts;this.type=opts.type;blobs.push(this)}},
 URL:{createObjectURL(){urls++;return 'blob:storyboard'},revokeObjectURL(){revokes++}},
 setTimeout:fn=>fn(),
 fetch(){network++;throw Error('Appel réseau interdit')}
};
vm.runInNewContext(source,sandbox,{timeout:2500,filename:'storyboard-studio.js'});
const core=sandbox.window.STUDIO_STORYBOARD_CORE;
check(typeof core?.validate==='function','Moteur non chargé');
for(const [name,preset] of Object.entries(core.presets)){
 const c=core.validate(preset);
 check(c.valid,'Préréglage invalide : '+name);
 check(c.config.scenes.length===4,'Quatre scènes attendues : '+name);
 check(core.timeline(preset).length===4,'Timeline incorrecte');
 check(core.json(preset).includes('"rendersMedia": false'),'Export doit exclure le rendu vidéo');
 check(core.importJson(core.json(preset)).scenes.length===4,'Import JSON ne rétablit pas les scènes');
 check(core.csv(preset).split('\r\n').length===6,'CSV de 4 scènes invalide');
 check(core.subtitles(preset).includes('-->'),'SRT vide');
 check(core.guide(preset).includes('AUCUN FICHIER VIDÉO'),'Avertissement vidéo absent');
 check(core.quality(preset).length===6,'Checklist à six repères attendue');
 for(const item of core.timeline(preset)){
  check(item.end-item.start===item.duration,'Timeline sans cohérence');
 }
}
check(core.timecode(0)==='00:00:00,000','Timecode zéro');
check(core.timecode(5.5)==='00:00:05,500','Timecode en millisecondes');
check(core.timecode(80.123)==='00:01:20,123','Timecode au-delà d’une minute');
check(core.duration(core.presets.activite)===30,'L’exemple devrait durer 30 secondes');
check(!core.validate({...core.presets.activite,scenes:[]}).valid,'Zéro scène accepté');
check(!core.validate({...core.presets.activite,scenes:[{...core.presets.activite.scenes[0],duration:0}]}).valid,'Durée zéro acceptée');
check(!core.validate({...core.presets.activite,scenes:Array.from({length:8},()=>({...core.presets.activite.scenes[0],duration:15}))}).valid,'Durée supérieure à 90 secondes acceptée');
check(core.validate({...core.presets.activite,scenes:Array.from({length:8},()=>({...core.presets.activite.scenes[0],duration:10}))}).valid,'8 scènes et 80 secondes interdites');
check(core.normalize({...core.presets.activite,format:'__proto__'}).format==='vertical','Format illégal accepté');
check(core.json({...core.presets.activite,scenes:[]})==='','Export JSON invalide accepté');
check(core.subtitles({...core.presets.activite,scenes:[]})==='','Sous-titres invalides exportés');
check(core.csv({...core.presets.activite,scenes:[]})==='','CSV invalide exporté');
try{core.importJson(JSON.stringify({...JSON.parse(core.json(core.presets.activite)),schema:'unknown'}));throw Error('Schéma illégal accepté')}catch(e){check(e.message.includes('Format de storyboard'),'Schéma inconnu rejeté incorrectement')}
try{core.importJson('x'.repeat(70000));throw Error('Fichier illimité accepté')}catch(e){check(e.message.includes('64 Ko'),'JSON trop volumineux rejeté incorrectement')}
const malicious={...core.presets.activite,scenes:[{...core.presets.activite.scenes[0],title:'=IMPORTXML("x","y")',voice:'@SUM(1,2)',visual:'+contenu suspect mais suffisant',overlay:'-2+2',audio:'son sans droit'}]};
const csv=core.csv(malicious);
check(csv.includes('"\'=IMPORTXML')&&csv.includes('"\'@SUM')&&csv.includes('"\'+contenu')&&csv.includes('"\'-2+2'),'Injection de formule CSV non neutralisée');
check(nodes['sb-editor-scenes'].children.length===4,'Éditeur de 4 scènes absent');
check(nodes['sb-scenes-nav'].children.length===4,'Navigation des scènes absente');
check(nodes['sb-quality'].textContent.includes('/ 6'),'Vérification qualité absente');
check(nodes['sb-export-json'].disabled===false,'Export valide désactivé');
nodes['sb-next'].events.click();
check(nodes['sb-scene-time'].textContent.includes('5–14 s'),'Sélection de la scène 2 incorrecte');
check(!nodes['sb-prev'].disabled,'Retour scène précédente indisponible');
nodes['sb-add-scene'].events.click();
check(nodes['sb-editor-scenes'].children.length===5,'Ajout de scène ne fonctionne pas');
check(nodes['sb-scenes-nav'].children.length===5,'Chronologie non mise à jour après ajout');
check(nodes['sb-stage'].children[1].textContent==='Nouvelle scène','Aperçu de la nouvelle scène absent');
const last=nodes['sb-editor-scenes'].children[4];
const titleInput=last.children[1].children[0].children[1];
titleInput.value='Clôture';titleInput.events.input();
check(nodes['sb-scenes-nav'].children[4].textContent.includes('Clôture'),'Renommage scène non reflété');
const durationInput=last.children[1].children[1].children[1];
durationInput.value='11';durationInput.events.input();
check(nodes['sb-duration'].textContent.includes('41 s'),'Durée totale non recalculée');
const remove=last.children[0].children[1].children[2];
remove.events.click();
check(nodes['sb-editor-scenes'].children.length===4,'Retrait de la scène impossible');
const moveDown=nodes['sb-editor-scenes'].children[0].children[0].children[1].children[1];
moveDown.events.click();
check(nodes['sb-scenes-nav'].children[0].textContent.includes('Savoir-faire'),'Déplacement des scènes impossible');
for(const kind of ['json','csv','srt','txt'])nodes['sb-export-'+kind].events.click();
check(downloads.length===4,'Quatre fichiers devraient être exportés');
check(urls===revokes,'URL des téléchargements non nettoyées');
check(blobs[1].parts[0].startsWith('\uFEFF'),'CSV sans BOM');
check(blobs[2].parts[0].includes('-->'),'SRT invalide au téléchargement');
examples[1].events.click();
check(nodes['sb-title'].value==='Annoncer un atelier','Exemple événement non chargé');
check(nodes['sb-format'].value==='square','Format de l’événement erroné');
check(nodes['sb-scene-voice'].textContent.length>2,'Narration événement absente');
(async()=>{
 nodes['sb-import'].files=[{size:4000,text:async()=>core.json(core.presets.service)}];
 await nodes['sb-import'].events.change();
 check(nodes['sb-title'].value==='Expliquer un service','Restauration du projet JSON incorrecte');
 check(nodes['sb-format'].value==='horizontal','Format JSON restauré incorrectement');
 check(nodes['sb-status'].textContent.includes('réimporté'),'Retour import absent');
 check(nodes['sb-editor-scenes'].children.length===4,'Les scènes JSON ne sont pas restaurées');
 nodes['sb-import'].files=[{size:90000,text:async()=>'{bad'}];
 await nodes['sb-import'].events.change();
 check(nodes['sb-status'].textContent.includes('Import refusé'),'Fichier trop volumineux non bloqué');
 check(html.includes('storyboard-studio.js')&&html.includes('id="sb-export-srt"'),'HTML non câblé');
 check(css.includes('prefers-reduced-motion'),'Styles mouvement réduit absents');
 check(read('assets/data.js').includes('atelier-video.html'),'Accès produit au storyboard absent');
 check(read('assets/resources-data.js').includes("id:'o-storyboard'"),'Ressource storyboard absente');
 check(network===0,'Appel réseau interdit détecté');
 console.log('OK — '+tests+' contrôles storyboard : scènes, timecodes, sécurité CSV, exports et reprise JSON.');
})().catch(e=>{console.error(e);process.exitCode=1;});
