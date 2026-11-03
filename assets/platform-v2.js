/* Studio IA v2 — parcours progressif, sans dépendance ni suivi.
   Séparer les trois univers, afficher uniquement les produits de la collection choisie. */
(() => {
 'use strict';
 const offers = window.TESTIA_PRODUCTS || [];
 const deep = window.TESTIA_DEEP || {};
 const types = {
  procedures: {title:'Packs procédures',hero:'Une méthode.<br><em>À appliquer.</em>',lead:'Des documents et des procédures pour organiser votre travail, sans repartir de zéro.',tag:'FAIRE',count:'1 pack pilote'},
  outils: {title:'Banques d’outils IA',hero:'Les outils.<br><em>Pour avancer.</em>',lead:'Des collections thématiques pour choisir les bonnes ressources et passer à l’action.',tag:'EXPLORER',count:'6 banques'},
  formations: {title:'Formations IA',hero:'Apprendre.<br><em>À faire soi-même.</em>',lead:'Des parcours pour développer vos compétences et réaliser vos propres projets.',tag:'APPRENDRE',count:'4 formations'}
 };
 const el=(tag,className,text)=>{
  const x=document.createElement(tag);
  if(className)x.className=className;
  if(text!==undefined)x.textContent=text;
  return x;
 };
 function menu(){
  const toggle=document.querySelector('[data-menu-toggle]');
  const nav=document.getElementById('mobileNav');
  if(!toggle||!nav)return;
  const setOpen=(open)=>{
   nav.hidden=!open;
   toggle.setAttribute('aria-expanded',String(open));
   toggle.textContent=open?'FERMER ×':'MENU ☰';
  };
  toggle.addEventListener('click',()=>setOpen(nav.hidden));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){setOpen(false);toggle.focus();}});
  document.addEventListener('pointerdown',e=>{if(!nav.hidden&&!nav.contains(e.target)&&!toggle.contains(e.target))setOpen(false);});
  window.matchMedia('(min-width: 821px)').addEventListener?.('change',e=>{if(e.matches)setOpen(false);});
 }
 const clean=s=>String(s||'').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function renderCatalogue(){
  const choice=document.getElementById('choiceView'),collection=document.getElementById('categoryView');
  if(!choice||!collection)return;
  const type=new URLSearchParams(location.search).get('type');
  const family=types[type];
  if(!family){choice.hidden=false;collection.hidden=true;document.title='Choisir une collection — Studio IA';return;}
  choice.hidden=true;
  collection.hidden=false;
  document.title=family.title+' — Studio IA';
  document.getElementById('categoryCrumb').textContent=family.title;
  document.getElementById('categoryKicker').textContent=family.tag+' / '+family.count;
  document.getElementById('categoryHeading').innerHTML=family.hero;
  document.getElementById('categoryLead').textContent=family.lead;
  for(const a of document.querySelectorAll('[data-category-tab]')){
   if(a.dataset.categoryTab===type)a.setAttribute('aria-current','page');
   else a.removeAttribute('aria-current');
  }
  const search=document.getElementById('categorySearch'),wrap=document.getElementById('searchWrap');
  wrap.hidden=type==='procedures';
  const list=document.getElementById('offersList'),counter=document.getElementById('offersCount'),empty=document.getElementById('offersEmpty');
  const source=offers.filter(p=>p.type===type);
  function paint(){
   const words=clean(search.value).split(/\s+/).filter(Boolean);
   const found=source.filter(p=>words.every(w=>clean([p.title,p.short,p.audience,p.summary].join(' ')).includes(w)));
   list.replaceChildren();
   for(const p of found){
    const link=el('a','offer');
    link.href='./produit.html?id='+encodeURIComponent(p.id);
    link.setAttribute('aria-label','Voir '+p.title);
    const num=el('span','offer-num',p.number);
    const info=el('div','offer-info');
    info.append(el('strong',null,p.title),el('p',null,p.short));
    const status=el('span','offer-status',p.status);
    const arrow=el('span','offer-arrow','↗');arrow.setAttribute('aria-hidden','true');
    link.append(num,info,status,arrow);list.append(link);
   }
   empty.hidden=found.length!==0;
   counter.textContent=found.length+' '+(found.length===1?'offre':'offres');
  }
  search.addEventListener('input',paint);
  paint();
 }
 function renderProduct(){
  const root=document.getElementById('productRoot');if(!root)return;
  const id=new URLSearchParams(location.search).get('id');
  const p=offers.find(x=>x.id===id);
  if(!p){
   const main=el('div','container product-layout');
   const div=el('div','product-copy');
   div.append(el('span','eyebrow','OFFRE INTROUVABLE'),el('h1',null,'Cette page n’existe plus.'));
   const back=el('a','cta-main','Revenir aux collections ↗');back.href='./catalogue.html';div.append(back);main.append(div);root.append(main);return;
  }
  const family=types[p.type];
  document.title=p.title+' — Studio IA';
  const layout=el('div','container product-layout'),copy=el('article','product-copy');
  const breadcrumb=el('div','crumb');
  const home=el('a',null,'PRODUITS');home.href='./catalogue.html';
  const familyLink=el('a',null,family.title.toUpperCase());familyLink.href='./catalogue.html?type='+p.type;
  breadcrumb.append(home,el('span',null,'/'),familyLink);
  const eyebrow=el('div','eyebrow',p.number+' / '+family.title);
  const title=el('h1',null,p.title);
  const lead=el('p','product-intro',p.short);
  const desc=el('p','product-summary',p.summary);
  const more=el('section','feature-block');
  more.append(el('h2',null,'L’essentiel de cette offre'));
  const ul=el('ul');
  p.features.slice(0,3).forEach(f=>ul.append(el('li',null,f)));
  more.append(ul);copy.append(breadcrumb,eyebrow,title,lead,desc,more);
  const sidebar=el('aside','product-sidebar');
  sidebar.append(el('div','prod-number',p.number),el('p','status-label','DISPONIBILITÉ'),el('h2','status-head',p.status));
  const row=(name,value)=>{
   const r=el('div','sidebar-field');
   r.append(el('span',null,name),el('strong',null,value));
   return r;
  };
  sidebar.append(row('Collection',family.title),row('Format',p.detail),row('Pour qui',p.audience));
  const source=deep[p.id];
  if(source?.page){
   const details=el('a','primary-link');
   details.href=source.page;
   details.append(el('span',null,'Voir la présentation détaillée'),el('span',null,'↗'));
   sidebar.append(details);
  }
  if(source?.demo){const free=el('a','secondary-link',(source.demoLabel||'Essayer un exemple')+' ↗');free.href=source.demo;sidebar.append(free);}
  if(source?.secondary){const secondary=el('a','secondary-link',(source.secondaryLabel||'Voir un exemple')+' ↗');secondary.href=source.secondary;sidebar.append(secondary);}
  sidebar.append(el('p','product-aside-note','Présentation uniquement. Aucun paiement ou accès payant n’est ouvert sur ce prototype.'));
  layout.append(copy,sidebar);root.append(layout);
  const related=offers.filter(x=>x.type===p.type && x.id!==p.id).slice(0,2);
  if(related.length){
    const section=el('section','container related-block');
    section.append(el('h2',null,'Dans la même collection'));
    const links=el('div','related-links');
    related.forEach(other=>{
      const link=el('a',null);
      link.href='./produit.html?id='+encodeURIComponent(other.id);
      link.append(el('span',null,'↗'),document.createTextNode(other.title));
      links.append(link);
    });
    section.append(links);root.append(section);
  }
 }
 document.addEventListener('DOMContentLoaded',()=>{
  menu();
  renderCatalogue();
  renderProduct();
 });
})();
