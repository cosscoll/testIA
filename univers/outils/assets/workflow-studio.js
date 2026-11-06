/* Studio IA / LIV-03 — Atelier de workflow. Planification et simulation LOCALES uniquement.
   Aucun fetch, timer de travail, connexion externe ou execution de processus. */
(()=>{
'use strict';
const presets={
  devis:{title:'Trier une demande de devis',owner:'Responsable commercial',trigger:'Nouvelle demande reçue',action:'Préparer un brouillon de réponse',required:'Contact et nature du projet',steps:['Qualifier le besoin','Vérifier les disponibilités']},
  stock:{title:'Réagir à un stock faible',owner:'Responsable des achats',trigger:'Alerte de stock faible',action:'Préparer une liste de réapprovisionnement',required:'Référence et quantité',steps:['Vérifier le stock réel','Comparer les commandes en cours']},
  document:{title:'Vérifier un document reçu',owner:'Responsable administratif',trigger:'Document reçu',action:'Préparer une fiche de contrôle',required:'Référence et type de document',steps:['Contrôler les pièces jointes','Vérifier les informations']},
};
const trim=s=>String(s??'').trim().replace(/\s+/g,' ');
const normalized=s=>trim(s).toLocaleLowerCase('fr');
const capped=(s,n)=>trim(s).slice(0,n);
function sanitize(raw){
  raw=raw||{};
  return {
    title:capped(raw.title,100),owner:capped(raw.owner,100),
    trigger:capped(raw.trigger,150),action:capped(raw.action,180),
    required:capped(raw.required,160),
    steps:(Array.isArray(raw.steps)?raw.steps:[]).slice(0,5).map(x=>capped(x,120)).filter(Boolean)
  };
}
function validate(raw){
  const c=sanitize(raw),issues=[];
  for(const key of ['title','owner','trigger','action','required']){
    if(c[key].length<4)issues.push('Compléter le champ '+({title:'nom',owner:'responsable',trigger:'déclencheur',action:'action',required:'données nécessaires'}[key])+'.');
  }
  if(!c.steps.length)issues.push('Prévoir au moins une étape avant la validation humaine.');
  if(c.steps.some(s=>s.length<4))issues.push('Rédiger des étapes compréhensibles.');
  if(new Set(c.steps.map(normalized)).size!==c.steps.length)issues.push('Supprimer les étapes identiques.');
  return {valid:issues.length===0,issues,config:c};
}
function plan(raw){
  const check=validate(raw),c=check.config;
  return [
    {label:'Déclencheur',description:c.trigger,kind:'start'},
    {label:'Protection contre les doublons',description:'Une référence déjà traitée bloque le traitement.',kind:'gate'},
    {label:'Champs obligatoires',description:c.required,kind:'gate'},
    {label:'Accord du destinataire',description:'La base légale ou l’autorisation d’utiliser les données doit être vérifiée.',kind:'gate'},
    ...c.steps.map((s,i)=>({label:'Étape '+(i+1),description:s,kind:'step'})),
    {label:'Préparation',description:c.action,kind:'draft'},
    {label:'Validation humaine',description:c.owner+' décide de la suite. Aucun envoi automatique.',kind:'approval'}
  ];
}
const tests={
  complet:{label:'Dossier complet',duplicate:false,complete:true,permission:true},
  incomplet:{label:'Information manquante',duplicate:false,complete:false,permission:true},
  doublon:{label:'Doublon détecté',duplicate:true,complete:true,permission:true},
  autorisation:{label:'Autorisation absente',duplicate:false,complete:true,permission:false}
};
function simulate(raw,caseId='complet',approved=false){
  const v=validate(raw);
  if(!v.valid)return{status:'invalid',reason:v.issues.join(' '),events:[{type:'error',label:'Configuration incomplète'}],executable:false};
  const sample=tests[caseId];
  if(!sample)return{status:'invalid',reason:'Cas de simulation inconnu.',events:[],executable:false};
  const events=[{type:'ok',label:'Événement fictif : '+sample.label}];
  if(sample.duplicate){
    events.push({type:'blocked',label:'Référence déjà présente : arrêt avant toute préparation.'});
    return {status:'blocked_duplicate',reason:'Arrêt : le dossier est un doublon.',events,executable:false};
  }
  events.push({type:'ok',label:'Contrôle des doublons : aucun doublon.'});
  if(!sample.complete){
    events.push({type:'blocked',label:'Champs requis absents : '+v.config.required+'.'});
    return {status:'blocked_missing',reason:'Arrêt : informations insuffisantes. Demander les précisions nécessaires.',events,executable:false};
  }
  events.push({type:'ok',label:'Champs requis : présents dans le jeu fictif.'});
  if(!sample.permission){
    events.push({type:'blocked',label:'Autorisation ou base légale : non confirmée.'});
    return {status:'blocked_permission',reason:'Arrêt : vérifier le droit de traiter ou contacter la personne.',events,executable:false};
  }
  events.push({type:'ok',label:'Autorisation vérifiée dans le scénario fictif.'});
  for(const step of v.config.steps)events.push({type:'ok',label:'Étape prévue : '+step+'.'});
  events.push({type:'ok',label:'Brouillon fictif prêt : '+v.config.action+'.'});
  events.push({type:approved?'ok':'waiting',label:approved?'Validation humaine simulée. Aucun envoi ni intégration.':'En attente : '+v.config.owner+' doit valider manuellement.'});
  return {
    status:approved?'approved_preview':'pending_approval',
    reason:approved?'Simulation validée. Le plan n’a pas été exécuté.':'Brouillon prêt. La validation humaine est indispensable.',
    events,executable:false
  };
}
function exportJson(raw){
  const v=validate(raw);
  if(!v.valid)return'';
  return JSON.stringify({
    schema:'studio-ia-workflow-demo/1',mode:'simulation-only',enabled:false,
    title:v.config.title,owner:v.config.owner,trigger:v.config.trigger,
    required:v.config.required,steps:v.config.steps,action:v.config.action,
    controls:{duplicateProtection:true,requiredFields:true,permissionCheck:true,humanApproval:true},
    warning:'Document de préparation. Ne constitue pas une automatisation installée.'
  },null,2);
}
function exportGuide(raw){
  const v=validate(raw);if(!v.valid)return'';
  const c=v.config;
  return [
    'STUDIO IA · PLAN DE WORKFLOW / SIMULATION UNIQUEMENT',
    '', 'Nom : '+c.title,'Responsable : '+c.owner,
    'Déclencheur : '+c.trigger,'Informations requises : '+c.required,
    '', 'CONTRÔLES AVANT TRAITEMENT',
    '1. Vérifier que la référence n’a pas déjà été traitée.',
    '2. Vérifier que les données essentielles sont complètes.',
    '3. Vérifier l’autorisation/la base légale appropriée.',
    '', 'ÉTAPES PRÉVUES',
    ...c.steps.map((s,i)=>(i+1)+'. '+s),
    '', 'SORTIE À PRÉPARER : '+c.action,
    'VALIDATION : '+c.owner+' doit approuver manuellement.',
    'EN CAS D’ERREUR : interrompre la procédure, corriger, documenter et réessayer après contrôle.',
    '', 'AUCUNE AUTOMATISATION NI ENVOI EXÉCUTÉS PAR CE DOCUMENT.'
  ].join('\n');
}
const core={presets,tests,sanitize,validate,plan,simulate,exportJson,exportGuide};
if(typeof window!=='undefined')window.STUDIO_WORKFLOW_CORE=core;
if(typeof document==='undefined')return;
const root=document.getElementById('workflowStudio');if(!root)return;
const $=id=>document.getElementById(id);
const fields=['title','owner','trigger','action','required'];
const state={steps:[],lastCase:'complet',last:null};
function read(){return {...Object.fromEntries(fields.map(id=>[id,$('wf-'+id).value])),steps:state.steps.slice()};}
function notify(message){$('wf-status').textContent=message;}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function renderSteps(){
  const list=$('wf-steps');list.replaceChildren();
  state.steps.forEach((step,i)=>{
    const item=el('li','wf-step-edit');
    const label=el('span','',String(i+1).padStart(2,'0')+' · '+step);
    const button=el('button','wf-remove','Retirer');
    button.type='button';button.setAttribute('aria-label','Retirer l’étape '+(i+1)+' : '+step);
    button.addEventListener('click',()=>{state.steps.splice(i,1);render();});
    item.append(label,button);list.append(item);
  });
  $('wf-add-step').disabled=state.steps.length>=5;
}
function renderPlan(){
  const list=$('wf-plan');list.replaceChildren();
  plan(read()).forEach((step,i)=>{
    const item=el('li','wf-node wf-node--'+step.kind);
    const mark=el('span','wf-node-number',String(i+1).padStart(2,'0'));
    const box=el('div','wf-node-content');
    box.append(el('strong','',step.label),el('p','',step.description||'À préciser'));
    item.append(mark,box);list.append(item);
  });
}
function render(){
  renderSteps();renderPlan();
  const v=validate(read());
  $('wf-health').textContent=v.valid?'Plan complet · prêt pour les tests fictifs':v.issues.join(' ');
  $('wf-health').dataset.valid=String(v.valid);
  $('wf-export-json').disabled=!v.valid;
  $('wf-export-txt').disabled=!v.valid;
  $('wf-approve').disabled=true;
  state.last=null;
  $('wf-result').textContent='Choisissez un cas fictif puis lancez la simulation.';
  $('wf-result').dataset.result='idle';
  $('wf-log').replaceChildren();
}
function usePreset(id){
  const sample=presets[id];if(!sample)return;
  for(const key of fields)$('wf-'+key).value=sample[key];
  state.steps=sample.steps.slice();
  state.lastCase='complet';$('wf-case').value='complet';
  document.querySelectorAll('[data-wf-preset]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.wfPreset===id)));
  render();notify('Exemple « '+sample.title+' » chargé. Modifiez-le librement.');
}
function renderResult(result){
  state.last=result;
  $('wf-result').textContent=result.reason;
  $('wf-result').dataset.result=result.status;
  const list=$('wf-log');list.replaceChildren();
  result.events.forEach(event=>{
    const item=el('li','wf-log-item wf-log-item--'+event.type,event.label);
    list.append(item);
  });
  $('wf-approve').disabled=result.status!=='pending_approval';
}
function run(){
  const result=simulate(read(),$('wf-case').value,false);
  state.lastCase=$('wf-case').value;
  renderResult(result);
  notify('Test fictif terminé. Aucun outil externe contacté, aucun message envoyé.');
}
function download(filename,content,media){
  if(!content)return;
  const blob=new Blob([content],{type:media+';charset=utf-8'});
  const uri=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=uri;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(uri),1000);
  notify('Fichier exporté depuis votre navigateur. Aucun scénario n’a été exécuté.');
}
document.querySelectorAll('[data-wf-preset]').forEach(btn=>btn.addEventListener('click',()=>usePreset(btn.dataset.wfPreset)));
fields.forEach(id=>$('wf-'+id).addEventListener('input',()=>{render();notify('Plan modifié. Relancez une simulation pour vérifier les nouvelles conditions.');}));
$('wf-add-step').addEventListener('click',()=>{
  const value=capped($('wf-new-step').value,120);
  if(value.length<4){notify('Décrivez une étape d’au moins 4 caractères.');return;}
  if(state.steps.length>=5){notify('Ce prototype accepte cinq étapes personnalisées au maximum.');return;}
  if(state.steps.some(s=>normalized(s)===normalized(value))){notify('Cette étape existe déjà.');return;}
  state.steps.push(value);$('wf-new-step').value='';render();notify('Étape ajoutée au plan.');
});
$('wf-run').addEventListener('click',run);
$('wf-case').addEventListener('change',()=>{renderResult({status:'idle',reason:'Cas modifié. Cliquez sur « Tester ce cas ».',events:[]});});
$('wf-approve').addEventListener('click',()=>{
  if(!state.last||state.last.status!=='pending_approval')return;
  renderResult(simulate(read(),state.lastCase,true));
  notify('Approbation fictive enregistrée. Aucune action réelle déclenchée.');
});
$('wf-export-json').addEventListener('click',()=>download('studio-ia-workflow-demo.json',exportJson(read()),'application/json'));
$('wf-export-txt').addEventListener('click',()=>download('studio-ia-plan-workflow.txt',exportGuide(read()),'text/plain'));
usePreset('devis');
})();