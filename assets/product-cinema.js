/* Studio IA / pages produit — scénario 3D commun.
   Modèle réel de la clé et du coffre : univers/procedures/assets/apartment-scene.js.
   Réutilise exactement rotationScene.setProgress(0..6) et setVaultProgress(0..1).
   Aucune géométrie aléatoire et aucune substitution de modèle. */
(()=>{
 'use strict';
 const catalog=window.TESTIA_PRODUCTS||[];
 const references=window.TESTIA_DEEP||{};
 const families=window.TESTIA_TYPES||{};
 const $=id=>document.getElementById(id);
 function node(tag,cls,text){
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!==undefined)n.textContent=String(text);
  return n;
 }
 function addLink(parent,href,caption,className){
  const a=node('a',className,caption);
  a.href=href;
  parent.append(a);
  return a;
 }
 function menu(){
  const button=document.querySelector('[data-cinema-menu]');
  const panel=$('mobile-menu');
  if(!button||!panel)return;
  function toggle(open){
   panel.hidden=!open;
   button.setAttribute('aria-expanded',String(open));
   button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
   button.textContent=open?'FERMER ×':'MENU ☰';
  }
  button.addEventListener('click',()=>toggle(panel.hidden));
  panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>toggle(false)));
  document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&!panel.hidden){toggle(false);button.focus();}
  });
  document.addEventListener('pointerdown',e=>{
   if(!panel.hidden&&!panel.contains(e.target)&&!button.contains(e.target))toggle(false);
  });
 }
 const descriptions={
  procedures:{label:'PACK PROCÉDURES',action:'Voir le pack complet',intro:'Une méthode concrète pour mieux organiser votre activité.'},
  outils:{label:'BANQUE D’OUTILS IA',action:'Explorer cette banque',intro:'Une collection d’outils adaptés à un objectif précis.'},
  formations:{label:'FORMATION IAGILE',action:'Découvrir le programme',intro:'Un parcours pour apprendre à réaliser vous-même.'}
 };
 const displayTitle=p=>p.type==='formations'?['La compétence.','À découvrir.']:p.type==='outils'?['Les bons outils.','Au bon moment.']:['Des étapes claires.','À partager.'];

 const offerFamilies={
  procedures:{label:'PACK PROCÉDURES',promise:'Une méthode structurée à adapter à votre métier.',purchase:'Acheter le pack'},
  outils:{label:'BANQUE D’OUTILS IA',promise:'Des outils et des méthodes pour passer à l’action.',purchase:'Acheter la banque'},
  formations:{label:'FORMATION IAGILE',promise:'Une compétence concrète à apprendre et à pratiquer.',purchase:'M’inscrire à la formation'}
 };
 // La vente est volontairement désactivée tant qu'un produit n'est pas
 // explicitement marqué commercialisable AVEC un vrai prix et lien Stripe.
 function verifiedCheckout(p){
  if(p.sellable!==true||typeof p.price!=='string'||!p.price.trim()||typeof p.checkoutUrl!=='string')return null;
  try{
   const url=new URL(p.checkoutUrl);
   if(url.protocol!=='https:'||!['buy.stripe.com','checkout.stripe.com'].includes(url.hostname))return null;
   return url.href;
  }catch{return null;}
 }
 function prepareOffer(p,deep,collectionUrl){
  const card=$('vaultOffer');
  if(!card)return;
  const kind=offerFamilies[p.type]||offerFamilies.outils;
  $('vaultOfferFamily').textContent=kind.label;
  $('vaultOfferTitle').textContent=p.title;
  $('vaultOfferLead').textContent=p.result||kind.promise;
  $('vaultOfferFormat').textContent=p.detail;
  $('vaultOfferStatus').textContent=p.status;
  const items=$('vaultOfferFeatures');
  items.replaceChildren();
  (p.features||[]).slice(0,3).forEach(text=>items.append(node('li',null,text)));
  const primary=$('vaultOfferPrimary');
  const secondary=$('vaultOfferSecondary');
  const notice=$('vaultOfferNotice');
  // Une preuve gratuite n'est affichée que si sa page importée existe déjà.
  const demo=$('vaultOfferDemo');
  if(demo){
   const usable=typeof deep.demo==='string'&&/^\.\/univers\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/i.test(deep.demo);
   demo.hidden=!usable;
   if(usable){
    demo.href=deep.demo;
    demo.textContent=(deep.demoLabel||'Tester un exemple gratuit')+' ↗';
   }else demo.removeAttribute('href');
  }
  const workshop=$('vaultOfferWorkshop');
  if(workshop){
   workshop.href='./atelier-produit.html?id='+encodeURIComponent(p.id);
   workshop.textContent='Essayer l’atelier de cette offre ↗';
  }
  const checkout=verifiedCheckout(p);
  if(checkout){
   primary.href=checkout;
   primary.target='_blank';
   primary.rel='noopener noreferrer';
   primary.replaceChildren(node('span',null,kind.purchase+' — '+p.price),node('span',null,'↗'));
   secondary.href=deep.page||collectionUrl;
   secondary.replaceChildren(node('span',null,'Consulter le contenu complet'),node('span',null,'↗'));
   notice.textContent='Paiement sécurisé sur Stripe. Vérifiez les conditions et le tarif avant de confirmer.';
   card.dataset.checkout='ready';
  }else{
   primary.href=deep.page||collectionUrl;
   primary.removeAttribute('target');
   primary.removeAttribute('rel');
   primary.replaceChildren(node('span',null,deep.page?'Découvrir l’offre complète':'Explorer la collection'),node('span',null,'↗'));
   secondary.href='./contact.html?produit='+encodeURIComponent(p.id);
   secondary.replaceChildren(node('span',null,'Préparer une demande de disponibilité'),node('span',null,'↗'));
   notice.textContent='Achat et inscription non ouverts : aucun montant n’est prélevé. La demande est un brouillon à copier, non un envoi automatique.';
   card.dataset.checkout='unavailable';
  }
 }
 let offerSyncFrames=0;
 function updateOffer(scrollFraction,scrollVault){
  const card=$('vaultOffer'),vault=$('cinemaVault');
  if(!card||!vault||vault.hidden)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const world=$('world');
  const fallback=world?.dataset.engine==='fallback'||document.body.classList.contains('vault-fallback-mode');
  let reveal=Math.max(0,Math.min(1,(scrollFraction-.76)/.17));
  const sceneState=window.rotationScene?.getVaultState?.();
  // Révélation seulement lorsque le vrai couvercle a suffisamment tourné.
  if(!fallback&&!reduced&&sceneState){
   const actualOpen=Math.max(0,Math.min(1,(sceneState.open-.83)/.14));
   reveal=Math.min(reveal,actualOpen);
   // Limite de synchronisation pour éviter une boucle permanente si WebGL s'arrête.
   if(scrollFraction>.76&&sceneState.open<.975&&offerSyncFrames<100){
    offerSyncFrames++;
    requestAnimationFrame(schedule);
   }else if(scrollFraction<=.76||sceneState.open>=.975)offerSyncFrames=0;
  }
  if(reduced)reveal=scrollFraction>=.75?1:0;
  const eased=reveal*reveal*(3-2*reveal);
  const mobile=window.innerWidth<=740;
  const lift=(1-eased)*(mobile?10:30);
  const scale=.20+.80*eased;
  card.style.opacity=String(eased);
  card.style.transform=reduced?'none':'translate3d(0,'+lift.toFixed(1)+'px,0) scale('+scale.toFixed(3)+') rotateX('+(-17*(1-eased)).toFixed(1)+'deg)';
  card.dataset.visible=String(reveal>.02);
  const accessible=reveal>.96;
  card.inert=!accessible;
  card.setAttribute('aria-hidden',String(!accessible));
  card.style.pointerEvents=accessible?'auto':'none';
  vault.dataset.offerRevealed=String(reveal>.58);
  // Continuer à annoncer le coffre tant que la carte n'est pas révélée.
  return accessible;
 }

 function section(index,position,kicker,heading,text,extras){
  const part=node('section','cinema-panel cinema-panel--'+position);
  part.dataset.pose=String(index);
  part.id='cinemaScene'+index;
  const copy=node('div','cinema-copy');
  const label=node('span','cinema-kicker',kicker);
  const h=index===0?node('h1'):node('h2');
  // Ce markup ne contient que du texte de l'application, pas de données saisies par l'utilisateur.
  if(Array.isArray(heading)){
   heading.forEach((x,i)=>{if(i)h.append(document.createElement('br'));const e=node(i===heading.length-1?'em':'span',null,x);h.append(e);});
  }else h.textContent=heading;
  copy.append(label,h);
  if(text)copy.append(node('p',index===0?'cinema-sub':null,text));
  if(typeof extras==='function')extras(copy);
  part.append(copy);
  return part;
 }
 function render(){
  const root=$('cinemaProduct');
  const id=new URLSearchParams(location.search).get('id');
  const p=catalog.find(x=>x.id===id);
  if(!p){
   const section=document.querySelector('.cinema-main');
   $('cinemaVault').hidden=true;
   root.replaceChildren();
   const wrap=node('section','cinema-panel cinema-panel--left');
   const copy=node('div','cinema-copy');
   copy.append(node('span','cinema-kicker','PRODUIT INTROUVABLE'),node('h1',null,'Cette offre est introuvable.'));
   addLink(copy,'./catalogue.html','Revenir au catalogue ↗','cinema-action');
   wrap.append(copy);root.append(wrap);
   document.title='Offre introuvable — Studio IA';
   document.querySelector('.cinema-key-layer')?.setAttribute('hidden','');
   document.querySelector('.cinema-world')?.setAttribute('hidden','');
   return;
  }
  document.title=p.title+' — Studio IA';
  const family=families[p.type]||{label:'Produits'};
  const details=descriptions[p.type]||descriptions.outils;
  const deep=references[p.id]||{};
  const collectionUrl='./catalogue.html?type='+encodeURIComponent(p.type);

  const crumb=node('nav','cinema-crumb');
  crumb.setAttribute('aria-label','Fil d’Ariane');
  addLink(crumb,'./catalogue.html','TOUS LES PRODUITS');
  crumb.append(node('span',null,'/'));
  addLink(crumb,collectionUrl,family.label.toUpperCase());
  root.before(crumb);

  root.replaceChildren();
  root.append(
   section(0,'left',p.number+' / '+details.label,[p.title],p.short,copy=>{
    const actions=node('div','cinema-actions');
    addLink(actions,deep.page||collectionUrl,deep.page?(deep.pageLabel||details.action)+' ↗':'Voir la collection ↗','cinema-action');
    addLink(actions,'#cinemaScene1','Explorer la clé en 3D ↓','cinema-action cinema-action--ghost');
    const directWorkshop=(typeof deep.demo==='string'&&/^\.\/univers\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/i.test(deep.demo))
     ?deep.demo:'./atelier-produit.html?id='+encodeURIComponent(p.id);
    addLink(actions,directWorkshop,'Accéder à l’atelier sans l’animation 3D ↗','cinema-action cinema-action--ghost');
    const facts=node('dl','cinema-quickfacts');
    for(const [label,value] of [['Disponibilité',p.status],['Format',p.detail]]){
      const item=node('div','cinema-quickfact');
      item.append(node('dt',null,label),node('dd',null,value));facts.append(item);
    }
    copy.append(actions,facts,node('div','cinema-scroll-note','LA CLÉ VOUS ACCOMPAGNE JUSQU’AU COFFRE ↓'));
   }),
   section(1,'right','01 / LE BESOIN',['La situation.','La réponse.'],p.summary),
   section(2,'left','02 / LE RÉSULTAT',['Un objectif.','Concret.'],p.result),
   section(3,'right','03 / CE QU’IL CONTIENT',['Les éléments','Essentiels.'],null,copy=>{
    const ul=node('ul','cinema-list');
    (p.features||[]).slice(0,4).forEach(feature=>ul.append(node('li',null,feature)));
    copy.append(ul);
   }),
   section(4,'left','04 / À QUI S’ADRESSE-T-IL ?',displayTitle(p),p.audience,copy=>{
    const label=node('p','cinema-proto-note',p.status+' · Aucun achat ou inscription activé.');
    copy.append(label);
    addLink(copy,'./atelier-produit.html?id='+encodeURIComponent(p.id),'Réaliser mon atelier d’essai ↗','cinema-action cinema-action--ghost');
    if(deep.demo)addLink(copy,deep.demo,(deep.demoLabel||'Essayer un exemple')+' ↗','cinema-action cinema-action--ghost');
    else if(deep.secondary)addLink(copy,deep.secondary,(deep.secondaryLabel||'Voir un exemple')+' ↗','cinema-action cinema-action--ghost');
   })
  );
  // Le coffre n'arrive qu'à la fin, quand les sept poses historiques ont été parcourues.
  $('vaultDescription').textContent='Le parcours révèle le contenu de cette offre. '+details.intro;
  $('vaultTitle').innerHTML='La clé.<br><em>Le coffre.</em>';
  const primary=$('vaultPrimary');
  primary.href=deep.page||collectionUrl;
  primary.replaceChildren(node('span',null,deep.page?(deep.pageLabel||details.action):'Explorer la collection'),node('span',null,'↗'));
  const secondary=$('vaultSecondary');
  secondary.href=deep.demo||collectionUrl;
  secondary.textContent=deep.demo?(deep.demoLabel||'Essayer gratuitement')+' ↗':'Revenir à la collection ↗';
  prepareOffer(p,deep,collectionUrl);
 }
 let scrollScheduled=false;
 const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
 const panePose=[0,2,3,4,5.15,6];
 const timestamp=el=>el.getBoundingClientRect().top+window.scrollY;
 function update(){
  scrollScheduled=false;
  const panes=[...document.querySelectorAll('.cinema-panel[data-pose]')];
  if(panes.length<5)return;
  const vault=$('cinemaVault');
  const anchors=[...panes.map(timestamp),timestamp(vault)];
  const current=window.scrollY;
  let progress=0;
  for(let i=0;i<anchors.length-1;i++){
   if(current>=anchors[i]){
    const a=anchors[i],b=Math.max(a+1,anchors[i+1]);
    const t=clamp((current-a)/(b-a),0,1);
    progress=panePose[i]+(panePose[i+1]-panePose[i])*t;
   }
  }
  if(current>=anchors[anchors.length-1])progress=6;
  const end=Math.max(1,vault.offsetHeight-window.innerHeight);
  const fraction=clamp((current-anchors[anchors.length-1])/end,0,1);
  // Le coffre finit de s'ouvrir avant le dernier quart de la séquence sticky ;
  // ce temps supplémentaire permet au module d'émerger puis d'être lu.
  const vaultProgress=clamp(fraction/.72,0,1);
  window.rotationScene?.setProgress(progress);
  window.rotationScene?.setVaultProgress?.(vaultProgress);
  window.rotationScene?.setChapter?.(Math.min(3,Math.floor(progress*.55)));
  const stage=progress>=6?'coffre':progress>4.2?'derniere-rotation':progress>2.3?'parcours':'cle';
  $('world').dataset.stage=stage;
  const state=$('vaultState');
  if(state){
   const staticMode=$('world')?.dataset.engine==='fallback'||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const offerRevealed=updateOffer(fraction,vaultProgress);
   const next=staticMode?'COFFRE — APERÇU STATIQUE':
    offerRevealed?'VOTRE OFFRE EST DÉVOILÉE':
    vaultProgress>.92?'LE COFFRE EST OUVERT':
    vaultProgress>.72?'LA SERRURE TOURNE':
    vaultProgress>.43?'LA CLÉ ENTRE DANS LA SERRURE':'LE COFFRE EST FERMÉ';
   // Ne pas réannoncer un statut identique à chaque événement de défilement.
   if(state.textContent!==next)state.textContent=next;
  }
 }
 function schedule(){if(scrollScheduled)return;scrollScheduled=true;requestAnimationFrame(update);}
 document.addEventListener('DOMContentLoaded',()=>{
  menu();render();schedule();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('rotation:ready',schedule);
  document.addEventListener('visibilitychange',schedule);
  if(location.hash)requestAnimationFrame(schedule);
 });
})();
