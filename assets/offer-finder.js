/* Studio IA — orientation locale sans API, sans profilage ni collecte.
   Ne prétend pas remplacer le conseiller IA génératif. */
(()=>{
 'use strict';
 const root=document.getElementById('offerFinder');
 if(!root)return;
 const products=window.TESTIA_PRODUCTS||[];
 const links=window.TESTIA_DEEP||{};
 const groups={
  procedures:[
   {label:'Conciergerie et location courte durée',id:'conciergerie',why:'Le seul pack métier présenté actuellement concerne les rotations et les passations en conciergerie.'},
   {label:'Un autre métier',id:null,why:'Aucun pack spécifique à ce métier n’est disponible dans le catalogue pilote. Nous ne vous recommandons pas un pack inadapté.'}
  ],
  outils:[
   {label:'Rédiger et communiquer',id:'redaction',why:'Pour préparer des messages, des offres et des contenus professionnels.'},
   {label:'Créer des visuels',id:'visuels',why:'Pour transformer un brief en une première direction graphique.'},
   {label:'Créer un site web',id:'web',why:'Pour prototyper une page et tester une interface.'},
   {label:'Faire une vidéo ou un audio',id:'video',why:'Pour organiser storyboard, montage et sous-titrage.'},
   {label:'Automatiser une tâche',id:'automatisation',why:'Pour choisir les outils et structurer un premier flux de travail.'},
   {label:'Faire une recherche ou une analyse',id:'analyse',why:'Pour organiser des sources et comparer des informations.'}
  ],
  formations:[
   {label:'Créer des sites 3D',id:'formation-3d',why:'Pour apprendre à concevoir et tester une expérience web 3D.'},
   {label:'Créer un agent IA',id:'formation-agents',why:'Pour apprendre à cadrer un assistant personnalisé et vérifier ses réponses.'},
   {label:'Automatiser avec l’IA',id:'formation-auto',why:'Pour apprendre à construire un scénario avec validation et suivi.'},
   {label:'Utiliser l’IA au quotidien',id:'formation-quotidien',why:'Pour apprendre les usages de base sur des tâches courantes.'}
  ]
 };
 const otherChoices={
  redaction:'formation-quotidien',web:'formation-3d',automatisation:'formation-auto',
  'formation-3d':'web','formation-auto':'automatisation',
  'formation-quotidien':'redaction',analyse:'formation-quotidien'
 };
 const byId=Object.fromEntries(products.map(p=>[p.id,p]));
 const modes=[...root.querySelectorAll('[data-finder-mode]')];
 const topics=document.getElementById('offerFinderTopics');
 const result=document.getElementById('offerFinderResult');
 const prompt=document.getElementById('offerFinderPrompt');
 let selectedMode=null;
 const make=(tag,cls,text)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 const link=(label,href,cls)=>{
  const a=make('a',cls,label);
  a.href=href;
  return a;
 };
 const productUrl=id=>'./produit.html?id='+encodeURIComponent(id);
 function showMode(mode){
  if(!Object.prototype.hasOwnProperty.call(groups,mode))return;
  selectedMode=mode;
  modes.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finderMode===mode)));
  topics.replaceChildren();
  result.replaceChildren();
  result.hidden=true;
  topics.hidden=false;
  prompt.textContent='Étape 2 / Précisez votre besoin';
  topics.append(make('p','offer-finder__question','Quel sujet vous intéresse ?'));
  const options=make('div','offer-finder__topics-grid');
  groups[mode].forEach((item,index)=>{
   const button=make('button','offer-finder__topic',item.label);
   button.type='button';
   button.dataset.finderTopic=String(index);
   button.setAttribute('aria-pressed','false');
   options.append(button);
  });
  topics.append(options);
 }
 function showChoice(entry){
  if(!selectedMode)return;
  topics.querySelectorAll('[data-finder-topic]').forEach(b=>
   b.setAttribute('aria-pressed',String(groups[selectedMode][Number(b.dataset.finderTopic)]===entry)));
  result.replaceChildren();
  result.hidden=false;
  result.append(make('span','offer-finder__step','VOTRE PISTE / CATALOGUE ACTUEL'));
  if(!entry.id){
   result.append(
    make('h3',null,'Pas de pack adapté pour le moment.'),
    make('p','offer-finder__intro',entry.why)
   );
   const actions=make('div','offer-finder__actions');
   actions.append(link('Explorer les outils disponibles ↗','./catalogue.html?type=outils','offer-finder__primary'),
                  link('Voir les ressources gratuites ↗','./ressources.html','offer-finder__secondary'));
   result.append(actions);
   return;
  }
  const product=byId[entry.id],deep=links[entry.id]||{};
  if(!product){
   result.append(make('p',null,'Cette offre n’est pas accessible pour le moment.'));
   return;
  }
  result.append(make('h3',null,product.title),
   make('p','offer-finder__intro',entry.why),
   make('p','offer-finder__description',product.short));
  const facts=make('div','offer-finder__facts');
  const status=make('div');
  status.append(make('span',null,'DISPONIBILITÉ'),make('strong',null,product.status));
  const format=make('div');
  format.append(make('span',null,'FORMAT'),make('strong',null,product.detail));
  facts.append(status,format);
  result.append(facts);
  const actions=make('div','offer-finder__actions');
  actions.append(link('Voir le produit et son coffre 3D ↗',productUrl(product.id),'offer-finder__primary'));
  if(deep.demo)actions.append(link((deep.demoLabel||'Essayer un exemple gratuit')+' ↗',deep.demo,'offer-finder__secondary'));
  else if(deep.page)actions.append(link('Consulter le contenu présenté ↗',deep.page,'offer-finder__secondary'));
  result.append(actions);
  const complementary=byId[otherChoices[product.id]];
  if(complementary){
   const aside=make('div','offer-finder__alternative');
   aside.append(make('span',null,'AUTRE APPROCHE'),
    make('p',null,(selectedMode==='formations'?'Vous préférez disposer d’outils plutôt que suivre une formation ? ':'Vous préférez apprendre la méthode vous-même ? ')+complementary.title+'.'),
    link('Comparer cette autre offre ↗',productUrl(complementary.id),'offer-finder__alt-link'));
   result.append(aside);
  }
  result.append(make('p','offer-finder__disclaimer','Suggestion basée uniquement sur le sujet choisi et les offres actuellement présentées. Aucun achat ni inscription n’est ouvert.'));
 }
 modes.forEach(button=>button.addEventListener('click',()=>showMode(button.dataset.finderMode)));
 topics.addEventListener('click',event=>{
  const button=event.target.closest('button[data-finder-topic]');
  if(!button||!topics.contains(button)||!selectedMode)return;
  const item=groups[selectedMode][Number(button.dataset.finderTopic)];
  if(item)showChoice(item);
 });
})();