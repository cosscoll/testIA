/* Studio IA — LIV-04C : storyboard interactif, 100 % local.
   Préparation de tournage, pas de rendu MP4, d'audio ni d'automatisation. */
(()=>{
'use strict';
const MAX_SCENES=8, MAX_SECONDS=90;
const formats={vertical:'Vertical 9:16',horizontal:'Horizontal 16:9',square:'Carré 1:1'};
const presets={
 activite:{title:'Présenter une activité',audience:'Personnes qui découvrent un artisan local',format:'vertical',scenes:[
  {title:'Accroche',duration:5,visual:'Plan de détail d’un geste de fabrication.',overlay:'Un objet, une histoire.',voice:'Et si chaque détail racontait un savoir-faire ?',audio:'Ambiance de l’atelier enregistrée avec autorisation.'},
  {title:'Savoir-faire',duration:9,visual:'Gros plan sur les mains au travail, puis plan d’ensemble.',overlay:'Un travail attentif.',voice:'Dans notre atelier, nous prenons le temps de comprendre chaque projet.',audio:'Voix off claire, sons d’ambiance discrets.'},
  {title:'Résultat',duration:10,visual:'Montrer une réalisation sous deux angles et un détail de finition.',overlay:'Pensé pour votre projet.',voice:'Chaque réalisation est préparée avec soin et adaptée aux besoins exprimés.',audio:'Ambiance d’origine uniquement, sans musique tierce.'},
  {title:'Invitation',duration:6,visual:'Face caméra ou vue du lieu avec coordonnées vérifiées.',overlay:'Parlons de votre projet.',voice:'Présentez-nous votre idée pour commencer la discussion.',audio:'Voix off puis fin silencieuse.'}
 ]},
 evenement:{title:'Annoncer un atelier',audience:'Participants potentiels à un événement local',format:'square',scenes:[
  {title:'Annonce',duration:4,visual:'Plan rapproché du matériel prêt pour la séance.',overlay:'Un atelier créatif.',voice:'Envie d’essayer une nouvelle activité ?',audio:'Son ambiant capté sur place.'},
  {title:'Découverte',duration:8,visual:'Montrer une démonstration et les étapes de préparation.',overlay:'Découvrez le geste.',voice:'Découvrez les premières étapes et échangez autour du savoir-faire.',audio:'Voix off enregistrée par l’organisateur.'},
  {title:'Participation',duration:8,visual:'Montrer une table de travail sans identifier les participants.',overlay:'Créer ensemble.',voice:'Un temps de découverte pour apprendre à votre rythme.',audio:'Sons d’ambiance, droits vérifiés.'},
  {title:'Informations',duration:6,visual:'Carton avec date et lieu après vérification des données.',overlay:'Infos et inscription : à confirmer',voice:'Consultez les informations vérifiées avant de vous inscrire.',audio:'Voix off courte, aucune musique incluse.'}
 ]},
 service:{title:'Expliquer un service',audience:'Entrepreneurs recherchant un accompagnement',format:'horizontal',scenes:[
  {title:'Problème',duration:5,visual:'Plan simple du contexte et d’une tâche difficile à organiser.',overlay:'Trop de choses à gérer ?',voice:'Certaines tâches deviennent difficiles à prioriser.',audio:'Voix off, sans musique imposée.'},
  {title:'Méthode',duration:10,visual:'Présenter trois étapes de travail sur un tableau ou écran fictif.',overlay:'Clarifier. Planifier. Vérifier.',voice:'Nous commençons par clarifier le besoin et construire une méthode adaptée.',audio:'Voix enregistrée par l’équipe.'},
  {title:'Livrable',duration:9,visual:'Zoom sur un document de synthèse fictif et non confidentiel.',overlay:'Un plan compréhensible.',voice:'Un document de synthèse permet de suivre les décisions prises.',audio:'Ambiance neutre, aucun son tiers fourni.'},
  {title:'Contact',duration:6,visual:'Plan fixe du bureau et coordonnées à confirmer.',overlay:'Échangeons sur votre besoin.',voice:'Contactez notre équipe pour décrire votre situation.',audio:'Voix puis silence final.'}
 ]}
};
const limits={title:90,audience:150,sceneTitle:70,visual:220,overlay:115,voice:360,audio:150};
const clean=x=>String(x??'').replace(/[\u0000-\u001F\u007F]+/g,' ').replace(/\s+/g,' ').trim();
const cut=(x,length)=>clean(x).slice(0,length);
const sceneNormalize=raw=>{
 const s=raw||{},d=Number(s.duration);
 return {title:cut(s.title,limits.sceneTitle),duration:Number.isInteger(d)&&d>=2&&d<=30?d:0,
  visual:cut(s.visual,limits.visual),overlay:cut(s.overlay,limits.overlay),
  voice:cut(s.voice,limits.voice),audio:cut(s.audio,limits.audio)};
};
function normalize(raw){
 const v=raw||{};
 return {title:cut(v.title,limits.title),audience:cut(v.audience,limits.audience),
  format:Object.prototype.hasOwnProperty.call(formats,v.format)?v.format:'vertical',
  scenes:(Array.isArray(v.scenes)?v.scenes:[]).slice(0,MAX_SCENES).map(sceneNormalize)};
}
function duration(raw){return normalize(raw).scenes.reduce((sum,s)=>sum+s.duration,0)}
function words(v){return (clean(v).match(/\S+/g)||[]).length}
function validate(raw){
 const v=normalize(raw),issues=[];
 if(v.title.length<4)issues.push('Renseignez le nom du projet.');
 if(v.audience.length<5)issues.push('Précisez le public cible.');
 if(v.scenes.length<1)issues.push('Ajoutez au moins une scène.');
 if(v.scenes.some(s=>s.title.length<3||s.visual.length<6))issues.push('Chaque scène doit décrire son titre et son image.');
 if(v.scenes.some(s=>s.duration<2))issues.push('Les durées doivent être des entiers de 2 à 30 secondes.');
 const total=v.scenes.reduce((x,s)=>x+s.duration,0);
 if(total>MAX_SECONDS)issues.push('Le montage dépasse 90 secondes. Réduisez les scènes.');
 return{valid:issues.length===0,issues,config:v,total};
}
function timeline(raw){
 const v=normalize(raw),items=[];let start=0;
 for(const s of v.scenes){items.push({...s,start,end:start+s.duration});start+=s.duration}
 return items;
}
function quality(raw){
 const v=validate(raw),list=[
  {key:'complete',ok:v.valid,label:'Brief et durées exploitables'},
  {key:'target',ok:!!v.config.audience&&v.config.audience.length>=8,label:'Public cible identifié'},
  {key:'voice',ok:v.config.scenes.every(s=>!s.voice||words(s.voice)<=s.duration*2.5),label:'Voix off lisible à environ 150 mots/minute'},
  {key:'overlay',ok:v.config.scenes.every(s=>!s.overlay||s.overlay.length<=55),label:'Texte à l’écran assez court'},
  {key:'subtitles',ok:v.config.scenes.some(s=>s.voice),label:'Voix off présente pour un export SRT'},
  {key:'rights',ok:v.config.scenes.every(s=>s.audio.length>=6),label:'Indications sonores à vérifier'}
 ];
 return list;
}
const timecode=seconds=>{const t=Math.max(0,Math.round(seconds*1000));const hours=Math.floor(t/3600000),minutes=Math.floor((t%3600000)/60000),sec=Math.floor((t%60000)/1000),ms=t%1000;return [hours,minutes,sec].map(n=>String(n).padStart(2,'0')).join(':')+','+String(ms).padStart(3,'0')};
function splitCaption(voice){
 const tokens=clean(voice).split(' ').filter(Boolean),result=[];for(let i=0;i<tokens.length;i+=8)result.push(tokens.slice(i,i+8).join(' '));return result;
}
function subtitles(raw){
 const c=validate(raw);
 if(!c.valid)return'';
 let id=1,blocks=[];
 for(const s of timeline(c.config)){
  const chunks=splitCaption(s.voice);
  if(!chunks.length)continue;
  for(let i=0;i<chunks.length;i++){
   const startMs=Math.round((s.start+s.duration*i/chunks.length)*1000);
   const endMs=Math.round((s.start+s.duration*(i+1)/chunks.length)*1000);
   blocks.push([String(id++),timecode(startMs/1000)+' --> '+timecode(endMs/1000),chunks[i]].join('\n'));
  }
 }
 return blocks.join('\n\n')+(blocks.length?'\n':'');
}
function csvCell(text){
 const value=clean(text);
 const safe=/^[=+\-@\t]/.test(value)?"'"+value:value;
 return '"'+safe.replace(/"/g,'""')+'"';
}
function csv(raw){
 const c=validate(raw);if(!c.valid)return'';
 const head=['scene','debut_s','fin_s','duree_s','titre','visuel','texte_ecran','voix_off','indications_audio'];
 const rows=timeline(c.config).map((s,i)=>[i+1,s.start,s.end,s.duration,s.title,s.visual,s.overlay,s.voice,s.audio].map(csvCell).join(';'));
 return '\uFEFF'+[head.join(';'),...rows].join('\r\n')+'\r\n';
}
function guide(raw){
 const c=validate(raw);if(!c.valid)return'';
 return [
  'STUDIO IA — PLAN DE TOURNAGE (DÉMONSTRATION LOCALE)','',
  'Projet : '+c.config.title,'Public : '+c.config.audience,'Format : '+formats[c.config.format],
  'Durée prévue : '+c.total+' s','',
  ...timeline(c.config).flatMap((s,i)=>[
   'SCÈNE '+String(i+1).padStart(2,'0')+' · '+s.start+'–'+s.end+' s · '+s.title,
   'Image / plan : '+s.visual,
   'Texte à l’écran : '+(s.overlay||'Non renseigné'),
   'Voix off : '+(s.voice||'Sans narration'),
   'Indications sonores : '+(s.audio||'À vérifier'),''
  ]),
  'POINTS À VÉRIFIER','- Autorisations de tournage, d’image et de voix.',
  '- Droits de tout son ou musique éventuellement ajouté après export.',
  '- Cohérence des durées, lecture des sous-titres et compréhension sans son.',
  '- Véracité des dates, promesses, coordonnées et éventuels témoignages.',
  '- Relecture éditoriale et technique avant montage ou diffusion.',
  '', 'AUCUN FICHIER VIDÉO OU AUDIO N’EST CRÉÉ PAR CET ATELIER.'
 ].join('\n');
}
function json(raw){
 const c=validate(raw);if(!c.valid)return'';
 return JSON.stringify({schema:'studio-ia-storyboard/1',mode:'planning-only',rendersMedia:false,...c.config},null,2);
}
function importJson(text){
 if(typeof text!=='string'||text.length>64000)throw Error('Fichier trop volumineux (64 Ko maximum).');
 let parsed;try{parsed=JSON.parse(text)}catch(_){throw Error('Ce fichier JSON ne peut pas être lu.')}
 if(!parsed||parsed.schema!=='studio-ia-storyboard/1'||parsed.mode!=='planning-only')throw Error('Format de storyboard non reconnu.');
 if(!Array.isArray(parsed.scenes)||parsed.scenes.length<1||parsed.scenes.length>MAX_SCENES)throw Error('Nombre de scènes non autorisé (1 à 8).');
 const checked=validate(parsed);
 if(!checked.valid)throw Error('Données du storyboard incomplètes : '+checked.issues.join(' '));
 return checked.config;
}
const core={presets,formats,normalize,validate,duration,timeline,quality,timecode,subtitles,csv,guide,json,importJson};
if(typeof window!=='undefined')window.STUDIO_STORYBOARD_CORE=core;
if(typeof document==='undefined')return;
const root=document.getElementById('storyboardStudio');if(!root)return;
const $=id=>document.getElementById(id);
let state=normalize(presets.activite),selected=0;
function e(tag,cls,text){
 const node=document.createElement(tag);if(cls)node.className=cls;
 if(text!==undefined)node.textContent=text;return node;
}
function note(message){$('sb-status').textContent=message}
function snapshot(){return normalize({...state,title:$('sb-title').value,audience:$('sb-audience').value,format:$('sb-format').value})}
function select(index){
 selected=Math.min(Math.max(0,index),state.scenes.length-1);
 renderPreview();
}
function renderPreview(){
 const scenes=timeline(snapshot()),item=scenes[selected],stage=$('sb-stage');
 stage.replaceChildren();
 $('sb-scenes-nav').replaceChildren();
 if(!item)return;
 $('sb-stage-frame').dataset.format=snapshot().format;
 stage.append(e('div','sb-stage-number','PLAN '+String(selected+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0')),
   e('p','sb-stage-overlay',item.overlay||item.title||'Texte à définir'),
   e('div','sb-stage-bottom',item.visual||'Plan visuel à définir'));
 $('sb-scene-time').textContent=item.start+'–'+item.end+' s · '+item.duration+' s';
 $('sb-scene-voice').textContent=item.voice||'Sans voix off prévue.';
 $('sb-scene-audio').textContent=item.audio||'Aucune indication sonore renseignée.';
 scenes.forEach((s,i)=>{
  const b=e('button','sb-timeline-item',String(i+1).padStart(2,'0')+' · '+s.title+' ('+s.duration+' s)');
  b.type='button';b.setAttribute('aria-pressed',String(i===selected));
  b.setAttribute('aria-label','Voir la scène '+(i+1)+' : '+s.title);
  b.addEventListener('click',()=>select(i));
  $('sb-scenes-nav').append(b);
 });
 $('sb-prev').disabled=selected<=0;$('sb-next').disabled=selected>=scenes.length-1;
}
function refresh(){
 state= snapshot();
 const c=validate(state);
 $('sb-duration').textContent=c.total+' s / 90 s maximum';
 $('sb-count').textContent=state.scenes.length+' scène'+(state.scenes.length>1?'s':'');
 const errors=$('sb-errors');errors.replaceChildren();
 for(const issue of c.issues)errors.append(e('li','',issue));
 errors.hidden=c.valid;
 const list=$('sb-checks');list.replaceChildren();let passed=0;
 for(const rule of quality(state)){
  if(rule.ok)passed++;
  list.append(e('li',rule.ok?'sb-check-ok':'sb-check-warn',(rule.ok?'✓ ':'À vérifier · ')+rule.label));
 }
 $('sb-quality').textContent=passed+' / 6 repères';
 $('sb-export-json').disabled=!c.valid;
 $('sb-export-csv').disabled=!c.valid;
 $('sb-export-txt').disabled=!c.valid;
 $('sb-export-srt').disabled=!c.valid||!state.scenes.some(x=>x.voice);
 $('sb-add-scene').disabled=state.scenes.length>=MAX_SCENES;
 renderPreview();
}
function input(label,value,max,kind,idx,key){
 const wrap=e('label','sb-field');
 wrap.append(e('span','',label));
 const box=e(kind==='textarea'?'textarea':'input');
 box.value=value;box.maxLength=max;
 if(kind==='textarea')box.rows=2;
 if(kind==='number'){box.type='number';box.min='2';box.max='30';box.step='1';}
 box.addEventListener('input',()=>{
  state.scenes[idx][key]=key==='duration'?box.value:box.value;
  refresh();
 });
 wrap.append(box);return wrap;
}
function renderScenes(){
 const rootList=$('sb-editor-scenes');rootList.replaceChildren();
 state.scenes.forEach((scene,i)=>{
  const card=e('article','sb-scene-card');
  const head=e('div','sb-scene-head');
  head.append(e('h3','',String(i+1).padStart(2,'0')+' / '+(scene.title||'Nouvelle scène')));
  const buttons=e('div','sb-scene-actions');
  const mk=(text,action,disabled,aria)=>{
   const b=e('button','sb-mini-button',text);b.type='button';b.disabled=disabled;
   b.setAttribute('aria-label',aria);b.addEventListener('click',action);buttons.append(b);
  };
  mk('↑',()=>move(i,-1),i===0,'Remonter la scène '+(i+1));
  mk('↓',()=>move(i,1),i===state.scenes.length-1,'Descendre la scène '+(i+1));
  mk('×',()=>remove(i),state.scenes.length===1,'Retirer la scène '+(i+1));
  head.append(buttons);card.append(head);
  const grid=e('div','sb-scene-fields');
  grid.append(input('Intitulé',scene.title,limits.sceneTitle,'input',i,'title'));
  grid.append(input('Durée en secondes (2–30)',scene.duration,2,'number',i,'duration'));
  grid.append(input('Plan / action à filmer',scene.visual,limits.visual,'textarea',i,'visual'));
  grid.append(input('Texte à l’écran (facultatif)',scene.overlay,limits.overlay,'input',i,'overlay'));
  grid.append(input('Voix off / narration',scene.voice,limits.voice,'textarea',i,'voice'));
  grid.append(input('Indications sonores / droits',scene.audio,limits.audio,'textarea',i,'audio'));
  card.append(grid);rootList.append(card);
 });
 refresh();
}
function move(i,offset){
 const target=i+offset;if(target<0||target>=state.scenes.length)return;
 [state.scenes[i],state.scenes[target]]=[state.scenes[target],state.scenes[i]];
 if(selected===i)selected=target;else if(selected===target)selected=i;
 renderScenes();note('Ordre des scènes modifié.');
}
function remove(i){
 if(state.scenes.length<=1)return;
 state.scenes.splice(i,1);selected=Math.max(0,Math.min(selected,state.scenes.length-1));
 renderScenes();note('Scène retirée du plan.');
}
function preset(name){
 if(!Object.prototype.hasOwnProperty.call(presets,name))return;
 state=normalize(presets[name]);selected=0;
 for(const field of ['title','audience','format'])$('sb-'+field).value=state[field];
 document.querySelectorAll('[data-sb-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sbPreset===name)));
 renderScenes();note('Exemple chargé. Toutes les scènes peuvent être modifiées.');
}
function download(name,content,type){
 if(!content){note('Complétez les informations requises avant l’export.');return;}
 const blob=new Blob([content],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 note('Fichier téléchargé localement : '+name+'. Aucun média créé ni envoyé.');
}
$('sb-add-scene').addEventListener('click',()=>{
 if(state.scenes.length>=MAX_SCENES)return;
 state.scenes.push(sceneNormalize({title:'Nouvelle scène',duration:5,visual:'Décrire le plan à tourner.',overlay:'',voice:'',audio:'À vérifier avant publication.'}));
 selected=state.scenes.length-1;renderScenes();note('Nouvelle scène créée.');
});
$('sb-title').addEventListener('input',refresh);
$('sb-audience').addEventListener('input',refresh);
$('sb-format').addEventListener('change',refresh);
$('sb-prev').addEventListener('click',()=>select(selected-1));
$('sb-next').addEventListener('click',()=>select(selected+1));
document.querySelectorAll('[data-sb-preset]').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.sbPreset)));
$('sb-export-json').addEventListener('click',()=>download('studio-ia-storyboard.json',json(snapshot()),'application/json'));
$('sb-export-csv').addEventListener('click',()=>download('studio-ia-plans-de-tournage.csv',csv(snapshot()),'text/csv'));
$('sb-export-srt').addEventListener('click',()=>download('studio-ia-sous-titres.srt',subtitles(snapshot()),'text/plain'));
$('sb-export-txt').addEventListener('click',()=>download('studio-ia-script-video.txt',guide(snapshot()),'text/plain'));
$('sb-import').addEventListener('change',async()=>{
 const file=$('sb-import').files?.[0];if(!file)return;
 try{
  if(file.size>64000)throw Error('Fichier trop volumineux (64 Ko maximum).');
  const text=await file.text();const loaded=importJson(text);
  state=loaded;selected=0;
  for(const field of ['title','audience','format'])$('sb-'+field).value=loaded[field];
  document.querySelectorAll('[data-sb-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));
  renderScenes();note('Storyboard réimporté. Vérifiez les scènes.');
 }catch(error){note('Import refusé : '+error.message);}
 $('sb-import').value='';
});
preset('activite');
})();