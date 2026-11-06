/* Studio IA — LIV-04D. Matrice de recherche manuelle, sans réseau ni IA. */
(()=>{
'use strict';
const kinds={primary:'Document original',independent:'Analyse indépendante',internal:'Observation personnelle',unknown:'Origine non précisée'};
const stances={for:'Favorable',against:'Contraire',neutral:'Contexte'};
const presets={
 contact:{question:'Comment faciliter les prises de contact pour une petite activité ?',options:['Formulaire web','E-mail direct','Messagerie'],sources:[
  {option:0,title:'Exemple fictif : parcours structuré',note:'Une simulation de travail permet de classer les demandes par catégorie.',stance:'for'},
  {option:0,title:'Exemple fictif : friction',note:'Un scénario inventé montre qu’un formulaire trop long peut décourager.',stance:'against'},
  {option:1,title:'Exemple fictif : échange libre',note:'Le cas hypothétique permet de décrire une demande sans formulaire.',stance:'for'},
  {option:2,title:'Exemple fictif : suivi',note:'Dans cet exemple, plusieurs conversations compliquent le suivi du projet.',stance:'against'}]},
 projet:{question:'Comment suivre les décisions et tâches d’un petit projet ?',options:['Tableau de tâches','Document partagé'],sources:[
  {option:0,title:'Exemple fictif : tâches',note:'Le scénario montre une façon de voir les actions à réaliser.',stance:'for'},
  {option:0,title:'Exemple fictif : formation',note:'Le cas imaginaire suppose une prise en main de l’outil par l’équipe.',stance:'against'},
  {option:1,title:'Exemple fictif : décisions',note:'Un exemple inventé conserve les décisions dans un fichier commun.',stance:'for'}]},
 vitrine:{question:'Où présenter une nouvelle activité en premier ?',options:['Page de site web','Page de réseau social'],sources:[
  {option:0,title:'Exemple fictif : personnalisation',note:'Dans ce cas inventé, une page peut adapter plusieurs rubriques.',stance:'for'},
  {option:0,title:'Exemple fictif : maintenance',note:'La simulation insiste sur la nécessité de tenir les informations à jour.',stance:'against'},
  {option:1,title:'Exemple fictif : publication',note:'L’exercice illustre une annonce, sans prétendre mesurer son efficacité.',stance:'neutral'}]}
};
const trim=x=>String(x??'').replace(/[\u0000-\u001F\u007F]+/g,' ').replace(/\s+/g,' ').trim();
const cut=(x,n)=>trim(x).slice(0,n);
function safeUrl(value){
 const s=trim(value);
 if(!s||s.length>400)return'';
 try{const u=new URL(s);return /^(http:|https:)$/.test(u.protocol)&&u.hostname&&!u.username&&!u.password?u.href:''}
 catch{return''}
}
function normalize(raw){
 raw=raw||{};
 const options=(Array.isArray(raw.options)?raw.options:[]).slice(0,4).map(v=>cut(v,75));
 const sources=(Array.isArray(raw.sources)?raw.sources:[]).slice(0,12).map((value,i)=>{
  const s=value||{},n=Number(s.option);
  return{id:i+1,option:Number.isInteger(n)&&n>=0&&n<options.length?n:0,
   title:cut(s.title,110),note:cut(s.note,450),url:cut(s.url,400),date:cut(s.date,10),
   stance:Object.prototype.hasOwnProperty.call(stances,s.stance)?s.stance:'neutral',
   kind:Object.prototype.hasOwnProperty.call(kinds,s.kind)?s.kind:'unknown',
   checked:s.checked===true};
 });
 return{question:cut(raw.question,220),options,sources};
}
function validate(raw){
 const d=normalize(raw),issues=[];
 if(d.question.length<9)issues.push('Précisez votre question.');
 if(d.options.length<2||d.options.some(o=>o.length<3))issues.push('Nommez au moins deux options.');
 if(new Set(d.options.map(x=>x.toLowerCase())).size!==d.options.length)issues.push('Deux options portent le même nom.');
 if(!d.sources.length)issues.push('Ajoutez au moins une observation.');
 if(d.sources.some(s=>s.title.length<4||s.note.length<12))issues.push('Complétez le titre et le détail de chaque observation.');
 if(d.sources.some(s=>s.url&&!safeUrl(s.url)))issues.push('Une URL de source est invalide.');
 if(d.sources.some(s=>s.date&&!/^\d{4}-\d{2}-\d{2}$/.test(s.date)))issues.push('Une date doit suivre AAAA-MM-JJ.');
 return{valid:issues.length===0,issues,data:d};
}
function compare(raw){
 const d=normalize(raw);
 return d.options.map((name,i)=>{
  const items=d.sources.filter(s=>s.option===i),yes=items.filter(s=>s.stance==='for').length,no=items.filter(s=>s.stance==='against').length;
  return{name,items,yes,no,neutral:items.length-yes-no,checked:items.filter(s=>s.checked).length,
   state:!items.length?'À documenter':yes&&no?'Arguments contradictoires':'Perspective incomplète'};
 });
}
function quality(raw){
 const d=normalize(raw),m=compare(d);
 return [
  {ok:d.options.length>=2&&d.options.every(o=>o.length>=3),label:'Options clairement définies'},
  {ok:m.every(o=>o.items.length>0),label:'Chaque option possède une observation'},
  {ok:m.every(o=>o.no>0),label:'Une objection étudiée pour chaque option'},
  {ok:d.sources.length>0&&d.sources.every(s=>s.url&&safeUrl(s.url)),label:'Des liens valides pour toutes les sources'},
  {ok:d.sources.length>0&&d.sources.every(s=>s.date),label:'Des dates pour toutes les observations'},
  {ok:d.sources.length>0&&d.sources.every(s=>s.checked),label:'Sources déclarées consultées par vous'}
 ];
}
function markdown(raw){
 const v=validate(raw);if(!v.valid)return'';
 const d=v.data,out=['# Studio IA — Synthèse de recherche','','**Question :** '+d.question,'',
  '> Observations saisies manuellement. Aucune source n’est consultée, croisée ou vérifiée automatiquement.',
  '> « Source consultée » désigne une déclaration de l’utilisateur, pas une certification.',''];
 for(const x of compare(d)){
  out.push('## '+x.name,'','Observations : '+x.items.length+' ; favorables : '+x.yes+' ; contraires : '+x.no+' ; contexte : '+x.neutral+'.',
   '**État :** '+x.state+'.','');
  for(const s of x.items)out.push('- **'+stances[s.stance]+' — '+s.title+'**',
   '  - Observation : '+s.note,
   '  - Origine déclarée : '+kinds[s.kind]+' ; date : '+(s.date||'non indiquée')+' ; consultée par vous : '+(s.checked?'oui':'non'),
   '  - URL : '+(safeUrl(s.url)||'absente'));
  out.push('');
 }
 out.push('## Contrôles encore nécessaires','');
 const missing=quality(d).filter(x=>!x.ok);
 out.push(...(missing.length?missing.map(x=>'- '+x.label):['- Relire et confirmer chaque affirmation indépendamment des cases cochées.']),
  '','**Décision :** à prendre après examen humain. Aucun vainqueur n’est calculé.','');
 return out.join('\n');
}
function csvCell(v){const t=trim(v);return'"'+(/^[=+\-@\t]/.test(t)?"'"+t:t).replace(/"/g,'""')+'"'}
function csv(raw){
 const v=validate(raw);if(!v.valid)return'';
 return '\uFEFF'+[
  'option;position;titre;observation;origine;date;url;consultee',
  ...v.data.sources.map(s=>[v.data.options[s.option],stances[s.stance],s.title,s.note,kinds[s.kind],s.date,safeUrl(s.url),s.checked?'oui':'non'].map(csvCell).join(';'))
 ].join('\r\n')+'\r\n';
}
function json(raw){
 const v=validate(raw);if(!v.valid)return'';
 return JSON.stringify({schema:'studio-ia-research/1',offline:true,autoVerified:false,...v.data},null,2);
}
function importJson(txt){
 if(typeof txt!=='string'||txt.length>65536)throw Error('Fichier trop volumineux (64 Ko).');
 let p;try{p=JSON.parse(txt)}catch{throw Error('JSON illisible.')}
 if(!p||p.schema!=='studio-ia-research/1'||p.offline!==true||p.autoVerified!==false)throw Error('Format de projet non reconnu.');
 if(!Array.isArray(p.options)||p.options.length<2||p.options.length>4||!Array.isArray(p.sources)||p.sources.length>12)throw Error('Limite : 2–4 options, 12 sources.');
 const v=validate(p);if(!v.valid)throw Error('Informations incomplètes : '+v.issues.join(' '));
 return v.data;
}
const core={kinds,stances,presets,normalize,validate,compare,quality,markdown,csv,json,importJson,safeUrl};
if(typeof window!=='undefined')window.STUDIO_RESEARCH_CORE=core;
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);
if(!$('researchStudio'))return;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
let state=normalize(presets.contact);
const status=msg=>{$('ra-status').textContent=msg};
function makeInput(title,value,change){
 const l=node('label','ra-field');l.append(node('span','',title));
 const i=node('input');i.type='text';i.value=value;i.addEventListener('input',()=>change(i.value));l.append(i);return l;
}
function makeSelect(options,value,onChange){
 const s=node('select');for(const [key,val] of Object.entries(options)){const o=node('option','',val);o.value=key;s.append(o);}
 s.value=String(value);s.addEventListener('change',()=>onChange(s.value));return s;
}
function drawOptions(){
 const list=$('ra-options');list.replaceChildren();
 state.options.forEach((value,i)=>{
  const row=node('div','ra-option');row.append(node('b','',String(i+1).padStart(2,'0')));
  row.append(makeInput('Option '+(i+1),value,v=>{state.options[i]=v;drawSources();report();}));
  const button=node('button','ra-remove','Retirer');button.type='button';button.disabled=state.options.length<=2;
  button.addEventListener('click',()=>{
   if(state.options.length<=2)return;
   state.options.splice(i,1);
   state.sources=state.sources.filter(s=>s.option!==i).map(s=>({...s,option:s.option>i?s.option-1:s.option}));
   state=normalize(state);drawOptions();drawSources();report();status('Option supprimée avec ses observations.');
  });
  row.append(button);list.append(row);
 });
 $('ra-add-option').disabled=state.options.length>=4;
 const target=$('ra-new-option');const previous=target.value;target.replaceChildren();
 state.options.forEach((option,i)=>{const o=node('option','',option);o.value=String(i);target.append(o);});
 target.value=Number(previous)<state.options.length?previous:'0';
}
function drawSources(){
 const list=$('ra-sources');list.replaceChildren();
 state.sources.forEach((s,i)=>{
  const card=node('article','ra-source');
  const h=node('div','ra-source-head');h.append(node('b','',String(i+1).padStart(2,'0')+' / OBSERVATION'));
  const remove=node('button','ra-remove','Supprimer');remove.type='button';
  remove.addEventListener('click',()=>{state.sources.splice(i,1);state=normalize(state);drawSources();report();});
  h.append(remove);card.append(h);
  const fields=node('div','ra-fields');
  for(const [label,key] of [['Titre','title'],['Observation','note'],['URL (facultatif)','url'],['Date AAAA-MM-JJ','date']]){
   fields.append(makeInput(label,s[key],v=>{state.sources[i][key]=v;report();}));
  }
  const optionLabel=node('label','ra-field');optionLabel.append(node('span','','Option'));
  optionLabel.append(makeSelect(Object.fromEntries(state.options.map((x,j)=>[j,x])),s.option,v=>{state.sources[i].option=Number(v);report();}));fields.append(optionLabel);
  const stanceLabel=node('label','ra-field');stanceLabel.append(node('span','','Position'));
  stanceLabel.append(makeSelect(stances,s.stance,v=>{state.sources[i].stance=v;report();}));fields.append(stanceLabel);
  const kindLabel=node('label','ra-field');kindLabel.append(node('span','','Origine déclarée'));
  kindLabel.append(makeSelect(kinds,s.kind,v=>{state.sources[i].kind=v;report();}));fields.append(kindLabel);
  const checked=node('label','ra-checkline'),cb=node('input');cb.type='checkbox';cb.checked=s.checked;
  cb.addEventListener('change',()=>{state.sources[i].checked=cb.checked;report();});
  checked.append(cb,node('span','','Je déclare avoir consulté cette source'));fields.append(checked);
  card.append(fields);
  const link=safeUrl(s.url);
  if(link){const a=node('a','ra-link','Consulter le lien');a.href=link;a.target='_blank';a.rel='noopener noreferrer';card.append(a);}
  list.append(card);
 });
 $('ra-source-count').textContent=state.sources.length+' / 12 observations';
 $('ra-add-source').disabled=state.sources.length>=12;
}
const current=()=>({...state,question:$('ra-question').value});
function report(){
 const d=current(),v=validate(d),results=$('ra-results');results.replaceChildren();
 for(const x of compare(d)){
  const card=node('article','ra-result');card.append(node('h3','',x.name),node('p','ra-result-state',x.state));
  const stats=node('div','ra-stats');
  for(const [n,label] of [[x.yes,'Pour'],[x.no,'Contre'],[x.neutral,'Contexte'],[x.checked,'Consultées']]){
   const chip=node('div','ra-stat');chip.append(node('strong','',String(n)),node('span','',label));stats.append(chip);
  }
  card.append(stats);
  const list=node('ul','ra-claims');x.items.forEach(s=>list.append(node('li','',stances[s.stance]+' · '+s.title)));card.append(list);results.append(card);
 }
 const qs=$('ra-quality');qs.replaceChildren();let passed=0;
 quality(d).forEach(q=>{if(q.ok)passed++;qs.append(node('li',q.ok?'ra-good':'ra-warning',(q.ok?'✓ ':'À compléter · ')+q.label));});
 $('ra-score').textContent=passed+' / 6 repères';
 const errors=$('ra-errors');errors.replaceChildren();v.issues.forEach(x=>errors.append(node('li','',x)));errors.hidden=v.valid;
 $('ra-summary').value=v.valid?markdown(d):'Complétez les éléments signalés avant l’export.';
 for(const id of ['ra-copy','ra-export-md','ra-export-csv','ra-export-json'])$(id).disabled=!v.valid;
}
function preset(name){
 const p=presets[name];if(!p)return;state=normalize(p);$('ra-question').value=state.question;
 document.querySelectorAll('[data-ra-example]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.raExample===name)));
 drawOptions();drawSources();report();status('Jeu fictif chargé. Les données ne sont pas vérifiées.');
}
function download(name,data,type){
 if(!data)return;
 const url=URL.createObjectURL(new Blob([data],{type:type+';charset=utf-8'})),a=node('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 status('Fichier téléchargé localement.');
}
$('ra-question').addEventListener('input',report);
$('ra-add-option').addEventListener('click',()=>{if(state.options.length<4){state.options.push('Nouvelle option');drawOptions();drawSources();report();}});
$('ra-add-source').addEventListener('click',()=>{
 if(state.sources.length>=12)return;
 const title=$('ra-new-title').value,note=$('ra-new-note').value;
 if(trim(title).length<4||trim(note).length<12){status('Titre et observation complète requis.');return;}
 state.sources.push({option:Number($('ra-new-option').value),title,note,stance:$('ra-new-stance').value,
  kind:$('ra-new-kind').value,url:$('ra-new-url').value,date:$('ra-new-date').value,checked:false});
 state=normalize(state);drawSources();report();
 for(const id of ['ra-new-title','ra-new-note','ra-new-url','ra-new-date'])$(id).value='';
 status('Observation ajoutée.');
});
$('ra-export-md').addEventListener('click',()=>download('studio-ia-synthese.md',markdown(current()),'text/markdown'));
$('ra-export-csv').addEventListener('click',()=>download('studio-ia-matrice.csv',csv(current()),'text/csv'));
$('ra-export-json').addEventListener('click',()=>download('studio-ia-recherche.json',json(current()),'application/json'));
$('ra-copy').addEventListener('click',async()=>{
 const value=$('ra-summary').value;
 if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(value);status('Synthèse copiée.');return}catch(_){}}
 $('ra-summary').focus();$('ra-summary').select();status('Texte sélectionné : Ctrl+C ou Cmd+C.');
});
$('ra-import').addEventListener('change',async()=>{
 const f=$('ra-import').files?.[0];if(!f)return;
 try{
  if(f.size>65536)throw Error('Fichier trop volumineux.');
  state=importJson(await f.text());$('ra-question').value=state.question;drawOptions();drawSources();report();
  document.querySelectorAll('[data-ra-example]').forEach(b=>b.setAttribute('aria-pressed','false'));
  status('Matrice réimportée. Vérifiez les informations.');
 }catch(e){status('Import refusé : '+e.message);}
 $('ra-import').value='';
});
document.querySelectorAll('[data-ra-example]').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.raExample)));
preset('contact');
})();