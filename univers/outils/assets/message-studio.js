/* Studio IA — atelier de rédaction public. 100 % local, aucun réseau, aucune IA payante. */
(()=>{
 'use strict';
 const formats=new Set(['email','relance','post','web']);
 const tones=new Set(['pro','warm','direct']);
 const tidy=value=>String(value??'').trim().replace(/\s+/g,' ');
 const phrase=value=>tidy(value).replace(/[\s.!?;:,]+$/g,'');
 const cap=value=>{const s=phrase(value);return s?s.charAt(0).toLocaleUpperCase('fr')+s.slice(1):''};
 const dot=value=>{const s=phrase(value);return s?s+'.':''};
 const lines=items=>items.filter(Boolean).join('\n');
 const wordCount=text=>(tidy(text).match(/\S+/g)||[]).length;
 const maxWords={email:185,relance:130,post:105,web:165};
 function valid(v){
  return !!(v&&formats.has(v.channel)&&tones.has(v.tone)
   &&['business','audience','offer','benefit','cta'].every(k=>tidy(v[k]).length>=3)
   &&tidy(v.business).length<=80&&tidy(v.audience).length<=110
   &&['offer','benefit','cta','proof'].every(k=>tidy(v[k]).length<=200));
 }
 function build(v){
  if(!valid(v))return '';
  const {business,offer,audience,benefit,cta,proof,tone,channel}=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,phrase(x)]));
  const proofLine=proof?dot('En pratique : '+proof):'';
  const close=tone==='warm'?'Au plaisir d’échanger,':'Bien cordialement,';
  const offerLine=dot(business+' propose '+offer+' pour '+audience);
  const benefitLine=dot('L’objectif : '+benefit);
  if(channel==='email'){
   const intro={pro:'Je vous contacte pour vous présenter notre activité.',
    warm:'Je souhaitais vous faire découvrir ce que nous proposons.',
    direct:'Voici une solution qui pourrait vous intéresser.'}[tone];
   return lines([
    'Objet : '+cap(benefit)+' — '+business,'','Bonjour,','',
    intro,'',offerLine,benefitLine,proofLine,'',dot(cta),'',close,business
   ]).replace(/\n{3,}/g,'\n\n');
  }
  if(channel==='relance'){
   const intro={pro:'Je reviens vers vous à propos de notre précédent échange.',
    warm:'Je me permets un petit message pour reprendre notre échange.',
    direct:'Je reviens vers vous concernant notre proposition.'}[tone];
   return lines([
    'Objet : Suite à notre échange — '+business,'','Bonjour,','',
    intro,'',
    dot('Nous proposons '+offer+' pour '+audience),
    benefitLine,proofLine,'',dot(cta),'',close,business
   ]).replace(/\n{3,}/g,'\n\n');
  }
  if(channel==='post'){
   const lead={pro:cap(benefit),warm:'Une idée pour '+audience, direct:cap(benefit)}[tone];
   return lines([lead,'',offerLine,proofLine,'',dot(cta)]).replace(/\n{3,}/g,'\n\n');
  }
  const lead=tone==='direct'?cap(benefit):business+' — '+cap(benefit);
  return lines([lead,'',offerLine,proofLine,'',dot('Pour en savoir plus : '+cta)]).replace(/\n{3,}/g,'\n\n');
 }
 function quality(v,message){
  const text=tidy(message);
  const words=wordCount(text);
  return [
   {key:'brief',ok:valid(v),label:'Brief complet'},
   {key:'proof',ok:tidy(v.proof).length>=10,label:'Élément de preuve renseigné'},
   {key:'cta',ok:tidy(v.cta).length>=8&&text.toLocaleLowerCase('fr').includes(phrase(v.cta).toLocaleLowerCase('fr')),label:'Action attendue présente'},
   {key:'length',ok:words>0&&words<=maxWords[v.channel],label:'Longueur adaptée au format'},
   {key:'placeholders',ok:!/(?:\[[^\]]+\]|\{\{[^}]+\}\})/.test(text),label:'Aucun champ à compléter'}
  ];
 }
 function buildPrompt(v,message){
  if(!valid(v))return '';
  return lines([
   'Agis comme un rédacteur professionnel. Améliore le texte ci-dessous sans inventer de chiffres, de clients, de résultats ni de témoignages.',
   'Garde le français naturel, des phrases courtes et un appel à l’action clair.',
   'Si une information manque, indique ce qui doit être vérifié au lieu de la fabriquer.',
   'Format : '+({email:'e-mail de présentation',relance:'e-mail de relance après un vrai échange',post:'publication de réseau social',web:'présentation pour site web'}[v.channel])+'.',
   'Ton : '+({pro:'professionnel',warm:'chaleureux',direct:'direct'}[v.tone])+'.',
   'Public : '+tidy(v.audience)+'.',
   'Preuve autorisée : '+(tidy(v.proof)||'Aucune fournie : ne pas en inventer.')+'.',
   'Réponds avec le texte final uniquement, sans commentaires additionnels.',
   '',
   'Brouillon à améliorer :',
   message.trim()
  ]);
 }
 const core={build,quality,buildPrompt,valid,wordCount};
 if(typeof window!=='undefined')window.STUDIO_MESSAGE_CORE=core;
 if(typeof document==='undefined')return;
 const form=document.getElementById('messageForm');
 if(!form)return;
 const $=id=>document.getElementById(id);
 const output=$('messageOutput'),prompt=$('promptOutput'),status=$('messageStatus'),count=$('messageCount');
 const qualityList=$('messageQuality'),score=$('messageScore');
 const copy=$('copyMessage'),download=$('saveMessage'),copyPrompt=$('copyPrompt');
 let current=null;
 const fields=['business','audience','offer','benefit','proof','cta','channel','tone'];
 const examples={
  atelier:{business:'Atelier Papier',audience:'les commerces de quartier',
   offer:'un atelier de création d’affiches sur mesure',
   benefit:'concevoir une affiche claire et adaptée à leur vitrine',
   proof:'chaque affiche est relue avec le commerçant avant impression',
   cta:'Écrivez-nous pour discuter de votre prochain support',tone:'warm',channel:'email'},
  conseil:{business:'Clair Conseil',audience:'les entrepreneurs qui lancent leur activité',
   offer:'un rendez-vous de cadrage de leur communication',
   benefit:'clarifier leurs messages avant de publier',
   proof:'un document de synthèse est remis à l’issue du rendez-vous',
   cta:'Demandez les disponibilités pour un premier échange',tone:'pro',channel:'post'},
  artisan:{business:'Les Ateliers du Bois',audience:'les particuliers qui rénovent leur intérieur',
   offer:'la fabrication de rangements en bois sur mesure',
   benefit:'adapter chaque rangement aux dimensions de la pièce',
   proof:'un relevé de mesures est réalisé avant validation du devis',
   cta:'Contactez l’atelier pour présenter votre projet',tone:'direct',channel:'web'}
 };
 const read=()=>Object.fromEntries(fields.map(id=>[id,$(id).value.trim()]));
 const say=message=>{status.textContent=message};
 function update(){
  const text=output.value.trim(),has=!!text;
  copy.disabled=!has;download.disabled=!has;
  const hasPrompt=!!(has&&current&&valid(current));
  copyPrompt.disabled=!hasPrompt;
  prompt.value=hasPrompt?buildPrompt(current,text):'';
  count.textContent=wordCount(text)+' mots · '+text.length+' caractères';
  qualityList.replaceChildren();
  const checks=has&&current?quality(current,text):[];
  let passed=0;
  for(const rule of checks){
   if(rule.ok)passed++;
   const li=document.createElement('li');
   li.className=rule.ok?'msg-check-pass':'msg-check-attention';
   li.textContent=(rule.ok?'✓ ':'À vérifier · ')+rule.label;
   qualityList.append(li);
  }
  score.textContent=has?(passed+' / '+checks.length+' repères satisfaits'):'La relecture apparaîtra après génération.';
 }
 function generate(){
  const v=read();
  if(!valid(v)){
   say('Complétez les champs obligatoires (au moins 3 caractères) et vérifiez les formats.');
   return false;
  }
  current=v;
  output.value=build(v);
  update();
  const checks=quality(current,output.value);
  say(checks.every(c=>c.ok)
   ?'Brouillon prêt à relire. Vérifiez les faits et le destinataire avant utilisation.'
   :'Brouillon créé. Consultez les points « À vérifier » avant tout envoi.');
  return true;
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(typeof form.reportValidity==='function'&&!form.reportValidity())return;
  generate();
 });
 form.addEventListener('input',()=>{
  if(output.value.trim())say('Votre brief a changé. Cliquez sur « Créer le brouillon » pour actualiser le texte.');
 });
 output.addEventListener('input',()=>{
  update();say('Texte modifié. Relisez-le avant de copier ou télécharger.');
 });
 document.querySelectorAll('[data-example]').forEach(button=>{
  button.addEventListener('click',()=>{
   const ex=examples[button.dataset.example];
   if(!ex)return;
   for(const [id,value] of Object.entries(ex))$(id).value=value;
   generate();
   document.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
 });
 $('resetMessage').addEventListener('click',()=>{
  for(const [id,v] of Object.entries(examples.atelier))$(id).value=v;
  document.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.example==='atelier')));
  generate();
 });
 async function copyValue(text,field){
  if(!text.trim())return;
  if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText){
   try{await navigator.clipboard.writeText(text);say('Copié dans le presse-papiers.');return}catch(_error){}
  }
  field.focus();field.select();
  say('Texte sélectionné. Utilisez Ctrl+C ou Cmd+C pour copier.');
 }
 copy.addEventListener('click',()=>copyValue(output.value,output));
 copyPrompt.addEventListener('click',()=>copyValue(prompt.value,prompt));
 download.addEventListener('click',()=>{
  if(!output.value.trim())return;
  const blob=new Blob([output.value],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download='studio-ia-'+current.channel+'-brouillon.txt';
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  say('Fichier .txt téléchargé localement. Aucun contenu envoyé au serveur.');
 });
 generate();
})();
