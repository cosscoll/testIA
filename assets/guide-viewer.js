/* Lecteur minimal, conservateur et sans HTML non fiable.
   Les fichiers MD restent disponibles à télécharger ; aucun contenu privé importé. */
(()=>{
 'use strict';
 const library={
  forme:{title:'FORME — Quatre étapes pour créer un site 3D',description:'Guide de prompts public : direction artistique, scène réelle, interactions et recette.',file:'./univers/outils/demo/forme-3d/GUIDE-PROMPTS.md',category:'outils'},
  nova:{title:'NOVA — Kit de prompts web 3D',description:'Concevoir un site immersif, produire un vrai modèle 3D, animer, vérifier et publier.',file:'./univers/outils/demo/nova-3d/PROMPTS.md',category:'outils'},
  cle:{title:'La clé et le coffre — Guide de reproduction',description:'Le protocole public qui explique le laboratoire de la clé et ses sept poses.',file:'./univers/procedures/reproduction-3d/README.md',category:'procedures'}
 };
 const $=id=>document.getElementById(id);
 const textNode=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
 function normalizeLine(s){return s.trim().replace(/\*\*/g,'').replace(/__([^_]+)__/g,'$1').replace(/\x60([^\x60]+)\x60/g,'$1')}
 function render(content){
  const host=$('guideDocument');host.replaceChildren();
  const lines=content.replace(/\r\n?/g,'\n').split('\n');
  let list=null,kind='',code=null,quote=null;
  const reset=()=>{list=null;kind='';code=null;quote=null};
  for(const raw of lines){
   const line=raw.trim();
   if(line.startsWith('\x60\x60\x60')){
    if(code){code=null;reset()}else{const pre=document.createElement('pre');code=document.createElement('code');pre.append(code);host.append(pre)}continue;
   }
   if(code){code.textContent+=(raw+'\n');continue}
   if(!line){reset();continue}
   if(/^(-{3,}|\*{3,})$/.test(line)){host.append(document.createElement('hr'));reset();continue}
   const h=line.match(/^(#{1,4})\s+(.+)/);
   if(h){reset();host.append(textNode('h'+Math.min(h[1].length+1,4),normalizeLine(h[2])));continue}
   const bul=line.match(/^([-*]|\d+[.)])\s+(.+)/);
   if(bul){
    const nextKind=/^\d/.test(bul[1])?'ol':'ul';
    if(!list||kind!==nextKind){list=document.createElement(nextKind);host.append(list);kind=nextKind}
    list.append(textNode('li',normalizeLine(bul[2])));quote=null;continue;
   }
   if(line.startsWith('>')){
    if(!quote){quote=document.createElement('blockquote');host.append(quote)}
    quote.append(textNode('p',normalizeLine(line.replace(/^>\s?/,''))));list=null;kind='';continue;
   }
   quote=null;list=null;kind='';
   host.append(textNode('p',normalizeLine(line)));
  }
 }
 async function init(){
  const id=new URLSearchParams(location.search).get('doc');
  const doc=library[id];
  if(!doc){
   $('guideTitle').textContent='Guide introuvable';
   $('guideDocument').textContent='Choisissez un guide dans la bibliothèque de ressources.';
   $('guideRaw').hidden=true;
   return;
  }
  document.title=doc.title+' — Studio IA';
  $('guideTitle').textContent=doc.title;
  $('guideSubtitle').textContent=doc.description;
  $('guideRaw').href=doc.file;
  $('guideBack').href='./ressources.html?type='+doc.category;
  try{
   const response=await fetch(doc.file,{cache:'no-store'});
   if(!response.ok)throw Error('file unavailable');
   render(await response.text());
  }catch{
   $('guideDocument').textContent='Le guide est momentanément inaccessible. Vous pouvez essayer de télécharger le document source ci-dessus.';
  }
 }
 document.addEventListener('DOMContentLoaded',init);
})();
