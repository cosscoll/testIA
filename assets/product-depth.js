/* Studio IA — ateliers publics. Tout reste dans ce navigateur ; aucune API. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const catalog=window.TESTIA_PRODUCTS||[];
 const deep=window.TESTIA_DEEP||{};
 const families=window.TESTIA_TYPES||{};
 const depths=window.STUDIO_PRODUCT_DEPTH||{};
 const id=new URLSearchParams(location.search).get('id');
 const product=catalog.find(p=>p.id===id);
 const info=Object.prototype.hasOwnProperty.call(depths,id)?depths[id]:null;
 const make=(tag,cls,text)=>{
  const element=document.createElement(tag);
  if(cls)element.className=cls;
  if(text!==undefined)element.textContent=String(text);
  return element;
 };
 const appendText=(parent,tag,cls,text)=>{const el=make(tag,cls,text);parent.append(el);return el;};
 const assign=(id,value)=>{$(id).textContent=value;};
 const setLink=(id,href,label)=>{
  const el=$(id);el.href=href;el.textContent=label;
 };
 if(!product||!info){
  assign('depthTitle','Atelier introuvable.');
  assign('depthFocus','Choisissez un produit du catalogue pour découvrir son atelier.');
  $('depthPageLink').href='./catalogue.html';
  $('depthSourceLink').hidden=true;
  for(const section of ['depthInventory','depthForm','depthCopy','depthDownload','depthDemo'])$(section).hidden=true;
  return;
 }
 document.title='Atelier '+product.title+' — Studio IA';
 const family=families[product.type]||{};
 const original=deep[product.id]||{};
 assign('depthFamily',(family.singular||'PRODUIT').toUpperCase()+' / '+product.number+' / ATELIER PUBLIC');
 assign('depthTitle',product.title);
 assign('depthFocus',info.focus);
 assign('depthStatus',info.status);
 assign('depthBefore',info.before);
 assign('depthAfter',info.after);
 setLink('depthPageLink','./produit.html?id='+encodeURIComponent(product.id),'Voir la présentation 3D ↗');
 setLink('depthSourceLink',original.page||'./catalogue.html',original.pageLabel?original.pageLabel+' ↗':'Voir les produits ↗');
 assign('depthExerciseTitle',info.sample.title);
 assign('depthExerciseContext',info.sample.context);
 assign('depthClosing',info.status+' Aucun prix ni achat n’est disponible depuis cet atelier.');
 setLink('depthBack','./catalogue.html?type='+encodeURIComponent(product.type),'Comparer cette famille ↗');
 setLink('depthDemo',original.demo||original.page||'./ressources.html',original.demo?original.demoLabel+' ↗':original.page?'Consulter la présentation détaillée ↗':'Voir les ressources gratuites ↗');
 const steps=$('depthSteps');
 info.phases.forEach(phase=>{
  const item=make('li','depth-step');
  const header=make('div','depth-step-head');
  appendText(header,'h3',null,phase.name);
  item.append(header);
  appendText(item,'p',null,phase.what);
  appendText(item,'small',null,'À obtenir : '+phase.proof);
  steps.append(item);
 });
 if(info.inventory){
  $('depthInventory').hidden=false;
  const pro=$('depthProcedures'),reg=$('depthRegisters');
  info.inventory.procedures.forEach(value=>appendText(pro,'li',null,value));
  info.inventory.registers.forEach(value=>appendText(reg,'li',null,value));
 }
 const fields=$('depthFields');
 info.sample.fields.forEach((field,index)=>{
  const group=make('div','depth-field');
  const fieldId='depthField'+index;
  const label=appendText(group,'label',null,field.label);
  label.htmlFor=fieldId;
  const control=make('textarea');
  control.id=fieldId;control.name=fieldId;control.rows=2;control.maxLength=450;
  control.placeholder=field.hint||'Décrivez votre situation sans donnée sensible.';
  control.setAttribute('aria-describedby',fieldId+'Hint');
  group.append(control);
  const hint=appendText(group,'small',null,field.hint||'Exemple fictif conseillé.');
  hint.id=fieldId+'Hint';
  fields.append(group);
 });
 const checked=$('depthChecks');
 info.criteria.forEach((rule,index)=>{
  const row=make('label','depth-check');
  const box=make('input');
  box.type='checkbox';box.name='depthQuality'+index;
  row.append(box,make('span',null,rule));
  checked.append(row);
 });
 const boxes=[...checked.querySelectorAll('input[type="checkbox"]')];
 const count=()=>{
  const amount=boxes.filter(item=>item.checked).length;
  assign('depthCheckCount',amount+' contrôle'+(amount>1?'s':'')+' validé'+(amount>1?'s':'')+' sur '+boxes.length+'.');
 };
 boxes.forEach(box=>box.addEventListener('change',count));
 count();
 const output=$('depthOutput'),copy=$('depthCopy'),download=$('depthDownload');
 const status=$('depthMessage');
 const form=$('depthForm');
 function createDraft(){
  const lines=[
   'STUDIO IA / FICHE D\'ESSAI',
   'Produit : '+product.title,
   'Collection : '+(family.singular||product.type),
   'Atelier : '+info.sample.title,
   '',
   'OBJECTIF',
   info.focus,
   '',
   'SITUATION / CHAMPS À VÉRIFIER'
  ];
  info.sample.fields.forEach((field,index)=>{
   const value=$('depthField'+index).value.trim();
   lines.push((index+1)+'. '+field.label+' : '+(value||'[À renseigner]'));
  });
  lines.push('','CHEMIN DE TRAVAIL');
  info.phases.forEach(phase=>{
   lines.push(phase.name+' — '+phase.what);
   lines.push('Livrable à vérifier : '+phase.proof);
  });
  lines.push('','CONTRÔLES QUALITÉ');
  info.criteria.forEach((rule,index)=>lines.push((boxes[index].checked?'[x] ':'[ ] ')+rule));
  lines.push('','À NE PAS OUBLIER',info.sample.end,
   '','Ce document est un canevas d\'essai généré localement : aucune donnée transmise, aucun achat, aucune garantie de conformité.',
   'Ne pas saisir de secrets, de coordonnées réelles ou de données personnelles.');
  return lines.join('\n');
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();
  output.value=createDraft();
  copy.disabled=false;
  download.disabled=false;
  status.textContent='Fiche préparée localement. Vous pouvez la relire, la copier ou l’exporter.';
 });
 form.addEventListener('reset',()=>{
  output.value='';copy.disabled=true;download.disabled=true;
  status.textContent='Le formulaire a été réinitialisé, sans sauvegarde.';
 });
 copy.addEventListener('click',async()=>{
  if(!output.value)return;
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Presse-papiers non accessible');
   await navigator.clipboard.writeText(output.value);
   status.textContent='Fiche copiée dans le presse-papiers.';
  }catch{
   output.focus();output.select();
   status.textContent='Le presse-papiers est indisponible. Le texte est sélectionné : copiez-le manuellement.';
  }
 });
 download.addEventListener('click',()=>{
  if(!output.value)return;
  const blob=new Blob(['\uFEFF'+output.value],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=make('a');link.href=url;
  link.download='atelier-studio-ia-'+product.id+'.txt';
  document.body.append(link);
  link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='Export local lancé. Aucun fichier n’est enregistré sur le site.';
 });
})();
