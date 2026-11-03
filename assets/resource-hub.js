/* Bibliothèque progressive : choix de catégorie avant la liste, recherche locale, sans suivi. */
(() => {
 'use strict';
 const resources=window.STUDIO_RESOURCES||[];
 const types={
  procedures:{name:'Packs procédures',title:'Des méthodes.<br><em>À explorer.</em>',description:'Des exemples métiers et le laboratoire de la clé 3D issus du projet Pack Procédures Pro.',label:'01 / RESSOURCES MÉTIER'},
  outils:{name:'Banques d’outils IA',title:'Des outils.<br><em>Et des idées.</em>',description:'Un générateur gratuit, des méthodes de choix et des démonstrations web interactives.',label:'02 / EXPLORATION DES OUTILS'},
  formations:{name:'Formations IA',title:'Apprendre.<br><em>En essayant.</em>',description:'Des exercices publics pour découvrir les quatre parcours IAgile, sans accès aux cours privés.',label:'03 / DÉCOUVERTES PÉDAGOGIQUES'}
 };
 const $=id=>document.getElementById(id);
 const el=(tag,className,text)=>{
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
 };
 function render(){
  const query=new URLSearchParams(location.search);
  const type=query.get('type');
  const choice=$('resourceChoice'),collection=$('resourceCollection');
  if(!choice||!collection)return;
  if(!Object.prototype.hasOwnProperty.call(types,type)){
   choice.hidden=false;collection.hidden=true;
   document.title='Ressources & démonstrations — Studio IA';
   return;
  }
  choice.hidden=true;collection.hidden=false;
  document.title='Ressources : '+types[type].name+' — Studio IA';
  $('resourceBreadcrumb').textContent=types[type].name;
  $('resourceKicker').textContent=types[type].label;
  $('resourceTitle').innerHTML=types[type].title;
  $('resourceDescription').textContent=types[type].description;
  document.querySelectorAll('[data-resource-type]').forEach(a=>{
   if(a.dataset.resourceType===type)a.setAttribute('aria-current','page');
   else a.removeAttribute('aria-current');
  });
  $('resourceProducts').href='./catalogue.html?type='+encodeURIComponent(type);
  const search=$('resourceSearch');
  const host=$('resourceGrid');
  const count=$('resourceCount');
  const empty=$('resourceEmpty');
  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
  function show(){
   const needle=normalize(search.value).trim();
   const found=resources.filter(r=>r.type===type&&normalize([r.name,r.description,r.kind,r.origin].join(' ')).includes(needle));
   host.replaceChildren();
   found.forEach(r=>{
    const a=el('a','resource-item');
    a.href=r.url;
    a.setAttribute('aria-label','Ouvrir : '+r.name);
    const top=el('div','resource-item__top');
    top.append(el('span','resource-item__kind',r.kind),el('b',null,'↗'));
    const h=el('h3',null,r.name);
    const desc=el('p',null,r.description);
    const foot=el('div','resource-item__end');
    foot.append(el('span',null,r.origin),el('span',null,'OUVRIR ↗'));
    a.append(top,h,desc,foot);
    host.append(a);
   });
   count.textContent=found.length+' '+(found.length===1?'ressource':'ressources');
   empty.hidden=found.length!==0;
  }
  search.addEventListener('input',show);
  show();
 }
 document.addEventListener('DOMContentLoaded',render);
})();
