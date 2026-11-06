/* Studio IA — LIV-04A. Visuels SVG originaux, fabriqués localement. Aucun appel externe. */
(()=>{
'use strict';
const palettes={
 orange:{name:'Orange & crème',bg:'#FFF5EE',ink:'#111827',accent:'#FF6A3D',accentInk:'#111827',muted:'#4B5563'},
 blue:{name:'Bleu éditorial',bg:'#EFF5FA',ink:'#142A40',accent:'#3D66CE',accentInk:'#FFFFFF',muted:'#405469'},
 olive:{name:'Vert doux',bg:'#F6F7EF',ink:'#203329',accent:'#B1CFA3',accentInk:'#203329',muted:'#47594D'}
};
const formats={square:{width:1080,height:1080,name:'Carré · 1080 × 1080'},portrait:{width:1080,height:1350,name:'Portrait · 1080 × 1350'}};
const layouts=new Set(['editorial','split','center']);
const inputs=['brand','title','description','cta','footer','palette','format','layout'];
const examples={
 artisan:{brand:'L’ATELIER DU BOIS',title:'Un intérieur à votre mesure.',description:'Des rangements pensés pour chaque espace, fabriqués avec soin.',cta:'PARLONS DE VOTRE PROJET',footer:'Sur rendez-vous · Atelier local',palette:'orange',layout:'editorial',format:'square'},
 marche:{brand:'MARCHÉ CRÉATIF',title:'Des idées prennent vie.',description:'Rencontrez des artisans, découvrez des objets et échangez autour de leur savoir-faire.',cta:'DÉCOUVRIR LE PROGRAMME',footer:'Entrée libre · Infos sur demande',palette:'olive',layout:'center',format:'portrait'},
 conseil:{brand:'STUDIO CONSEIL',title:'Votre projet, plus clair.',description:'Un rendez-vous pour structurer votre idée, vos objectifs et les prochaines étapes.',cta:'PRENDRE CONTACT',footer:'Conseil sur mesure · Disponibilités sur demande',palette:'blue',layout:'split',format:'square'}
};
const tidy=v=>String(v??'').replace(/[\u0000-\u001F\u007F]+/g,' ').replace(/\s+/g,' ').trim();
const limit=(v,n)=>tidy(v).slice(0,n);
const escapeXml=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const normalize=raw=>{
 raw=raw||{};
 return{brand:limit(raw.brand,48),title:limit(raw.title,92),description:limit(raw.description,190),
  cta:limit(raw.cta,48),footer:limit(raw.footer,92),palette:Object.prototype.hasOwnProperty.call(palettes,raw.palette)?raw.palette:'orange',
  layout:layouts.has(raw.layout)?raw.layout:'editorial',format:Object.prototype.hasOwnProperty.call(formats,raw.format)?raw.format:'square'};
};
const linear=x=>{const v=x/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
const luminance=hex=>{const c=[1,3,5].map(i=>linear(parseInt(hex.slice(i,i+2),16)));return c[0]*.2126+c[1]*.7152+c[2]*.0722};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function wrap(value,max=19,lines=3){
 const words=tidy(value).split(' ').filter(Boolean);
 const result=[];let current='';
 for(const word of words){
  if(word.length>max){
   if(current){result.push(current);current='';}
   let rest=word;
   while(rest.length>max){result.push(rest.slice(0,max-1)+'-');rest=rest.slice(max-1);}
   current=rest;
  }else if(!current)current=word;
  else if((current+' '+word).length<=max)current+=' '+word;
  else{result.push(current);current=word;}
 }
 if(current)result.push(current);
 if(result.length>lines){
  const short=result.slice(0,lines);
  short[lines-1]=short[lines-1].slice(0,max-1).replace(/[. ]+$/,'')+'…';
  return{lines:short,truncated:true};
 }
 return{lines:result,truncated:false};
}
function quality(raw){
 const v=normalize(raw),p=palettes[v.palette];
 const title=wrap(v.title,v.layout==='split'?16:19,3);
 const description=wrap(v.description,v.layout==='split'?26:40,v.format==='square'?(v.layout==='center'?2:3):4);
 return [
  {key:'title',ok:v.title.length>=8&&!title.truncated,label:'Titre complet et lisible'},
  {key:'description',ok:v.description.length>=12&&!description.truncated,label:'Description sans coupure'},
  {key:'cta',ok:v.cta.length>=5,label:'Appel à l’action présent'},
  {key:'contrast',ok:contrast(p.ink,p.bg)>=4.5&&contrast(p.accentInk,p.accent)>=4.5,label:'Contrastes typographiques suffisants'},
  {key:'review',ok:v.brand.length>=3&&v.footer.length>=5,label:'Identité et information pratique renseignées'}
 ];
}
function rect(x,y,w,h,fill,rx=0,extra=''){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" '+extra+'/>';}
function text(x,y,value,size,color,weight=500,anchor='start',spacing=0){
 return '<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="Arial, Helvetica, sans-serif" font-size="'+size+'" font-weight="'+weight+'" text-anchor="'+anchor+'" letter-spacing="'+spacing+'">'+escapeXml(value)+'</text>';
}
function groupLines(x,y,words,size,color,lineHeight,weight,anchor='start'){
 return words.map((line,i)=>text(x,y+i*lineHeight,line,size,color,weight,anchor)).join('');
}
function buildSvg(raw){
 const v=normalize(raw),p=palettes[v.palette],f=formats[v.format],h=f.height,w=f.width,portrait=h>1100;
 const titleInfo=wrap(v.title,v.layout==='split'?16:19,3);
 const descInfo=wrap(v.description,v.layout==='split'?26:40,v.format==='square'?(v.layout==='center'?2:3):4);
 const mainSize=v.layout==='split'?72:82;
 const headlineLine=mainSize*1.16;
 const parts=[
  '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+escapeXml(v.title||'Aperçu de l’affiche')+'">',
  '<title>'+escapeXml(v.title||'Affiche')+'</title>',
  rect(0,0,w,h,p.bg)
 ];
 if(v.layout==='editorial'){
  parts.push('<circle cx="971" cy="135" r="280" fill="'+p.accent+'" opacity=".94"/>');
  parts.push(rect(84,105,75,9,p.ink,0),text(84,160,v.brand.toLocaleUpperCase('fr'),25,p.ink,700,'start',2.2));
  parts.push(rect(84,257,70,70,p.accent,35));
  const startY=portrait?465:390;
  parts.push(groupLines(84,startY,titleInfo.lines,mainSize,p.ink,headlineLine,800));
  const descTop=startY+titleInfo.lines.length*headlineLine+25;
  parts.push(groupLines(88,descTop,descInfo.lines,portrait?31:28,p.muted,portrait?45:41,400));
  const y=h-241;
  parts.push(rect(84,y,730,79,p.accent,13));
  parts.push(text(122,y+52,v.cta.toLocaleUpperCase('fr'),v.cta.length>31?19:24,p.accentInk,700,'start',.8));
  parts.push(rect(84,h-97,w-168,2,p.ink,0,'opacity=".24"'));
  parts.push(groupLines(84,h-65,wrap(v.footer,46,2).lines,18,p.muted,27,400));
  parts.push(text(996,h-50,'STUDIO / VISUEL',16,p.muted,700,'end',2));
 } else if(v.layout==='split'){
  parts.push(rect(0,0,355,h,p.accent));
  parts.push('<circle cx="177" cy="200" r="104" fill="'+p.accentInk+'" opacity=".085"/>');
  parts.push(groupLines(84,140,wrap(v.brand.toLocaleUpperCase('fr'),17,2).lines,22,p.accentInk,33,700));
  parts.push('<path d="M80 '+(h-455)+' L265 '+(h-455)+' M80 '+(h-422)+' L210 '+(h-422)+'" stroke="'+p.accentInk+'" stroke-width="8" opacity=".28"/>');
  parts.push(groupLines(78,h-324,wrap(v.cta.toLocaleUpperCase('fr'),17,3).lines,23,p.accentInk,39,750));
  parts.push(rect(430,126,76,11,p.accent));
  parts.push(groupLines(430,305,titleInfo.lines,mainSize,p.ink,90,800));
  const descTop=305+titleInfo.lines.length*90+56;
  parts.push(groupLines(430,descTop,descInfo.lines,27,p.muted,42,400));
  parts.push(rect(430,h-140,560,2,p.ink,0,'opacity=".2"'));
  parts.push(groupLines(430,h-92,wrap(v.footer,37,2).lines,20,p.muted,31,500));
 } else {
  parts.push(rect(75,75,w-150,h-150,'none',18,'stroke="'+p.accent+'" stroke-width="5"'));
  parts.push('<circle cx="540" cy="260" r="141" fill="'+p.accent+'"/>');
  parts.push('<circle cx="540" cy="260" r="78" fill="none" stroke="'+p.accentInk+'" stroke-width="4" opacity=".65"/>');
  parts.push(text(540,145,v.brand.toLocaleUpperCase('fr'),23,p.ink,700,'middle',2.3));
  const titleY=portrait?590:485;
  const line=portrait?91:78;
  parts.push(groupLines(540,titleY,titleInfo.lines,portrait?79:73,p.ink,line,800,'middle'));
  const descTop=titleY+titleInfo.lines.length*line+26;
  parts.push(groupLines(540,descTop,descInfo.lines,portrait?30:27,p.muted,portrait?42:36,400,'middle'));
  const ctaY=h-267;
  parts.push(rect(165,ctaY,750,86,p.accent,11));
  parts.push(text(540,ctaY+56,v.cta.toLocaleUpperCase('fr'),v.cta.length>31?19:24,p.accentInk,750,'middle',.6));
  parts.push(groupLines(540,h-118,wrap(v.footer,52,2).lines,19,p.muted,27,500,'middle'));
 }
 parts.push('</svg>');
 return parts.join('');
}
function briefText(raw){
 const v=normalize(raw),p=palettes[v.palette],f=formats[v.format];
 return [
  'STUDIO IA — BRIEF VISUEL / DÉMONSTRATION GRATUITE',
  '', 'Marque : '+v.brand,'Titre : '+v.title,'Description : '+v.description,
  'Action souhaitée : '+v.cta,'Information pratique : '+v.footer,
  'Composition : '+({editorial:'Éditoriale',split:'Bicolore',center:'Centrée'}[v.layout]),
  'Palette : '+p.name,'Format : '+f.name,
  '', 'CONTRÔLES À EFFECTUER AVANT DIFFUSION',
  '- Vérifier les dates, prix, coordonnées et bénéfices annoncés.',
  '- Relire les lignes longues et le rendu à petite taille.',
  '- Vérifier les droits de tout élément ajouté après export.',
  '- Adapter les dimensions et la composition au canal réel.',
  '', 'Visuel SVG original généré localement, sans image externe ni IA connectée.'
 ].join('\n');
}
const core={palettes,formats,examples,normalize,contrast,wrap,quality,buildSvg,briefText};
if(typeof window!=='undefined')window.STUDIO_VISUAL_CORE=core;
if(typeof document==='undefined')return;
const root=document.getElementById('visualStudio');if(!root)return;
const $=id=>document.getElementById(id);
const controls=['brand','title','description','cta','footer','palette','format','layout'];
const getValues=()=>Object.fromEntries(controls.map(id=>[id,$('vs-'+id).value]));
const notify=value=>{$('vs-status').textContent=value};
function render(){
 const v=getValues();
 const svg=buildSvg(v);
 $('vs-preview').innerHTML=svg;  // Texte des visiteurs échappé via escapeXml; aucune balise arbitraire injectée.
 const checks=quality(v),list=$('vs-checks');
 list.replaceChildren();
 let passed=0;
 for(const c of checks){
  if(c.ok)passed++;
  const row=document.createElement('li');
  row.className=c.ok?'vs-pass':'vs-attention';
  row.textContent=(c.ok?'✓ ':'À vérifier · ')+c.label;
  list.append(row);
 }
 $('vs-score').textContent=passed+' / '+checks.length+' repères satisfaits';
 $('vs-dimensions').textContent=formats[normalize(v).format].name;
 $('vs-brief').value=briefText(v);
 $('vs-export-svg').disabled=!normalize(v).title;
 $('vs-export-png').disabled=!normalize(v).title;
 return svg;
}
function applyExample(id){
 const v=examples[id];if(!v)return;
 for(const field of controls)$('vs-'+field).value=v[field]||'';
 document.querySelectorAll('[data-vs-example]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vsExample===id)));
 render();notify('Exemple chargé. Le visuel est entièrement modifiable.');
}
function downloadBlob(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportSvg(){
 const v=normalize(getValues());
 if(!v.title){notify('Renseignez un titre avant l’export.');return;}
 downloadBlob(new Blob([buildSvg(v)],{type:'image/svg+xml;charset=utf-8'}),'studio-ia-'+v.format+'.svg');
 notify('Fichier SVG téléchargé. Aucun contenu n’a été envoyé au serveur.');
}
function exportPng(){
 const v=normalize(getValues());
 if(!v.title){notify('Renseignez un titre avant l’export.');return;}
 if(typeof Image==='undefined'||!document.createElement('canvas').getContext){notify('Export PNG indisponible ici. Utilisez le SVG.');return;}
 const svg=buildSvg(v);
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 const image=new Image();
 image.onload=()=>{
  try{
   const canvas=document.createElement('canvas');canvas.width=formats[v.format].width;canvas.height=formats[v.format].height;
   const context=canvas.getContext('2d');if(!context)throw Error('Canvas indisponible');
   context.drawImage(image,0,0,canvas.width,canvas.height);
   canvas.toBlob(blob=>{
    if(blob){downloadBlob(blob,'studio-ia-'+v.format+'.png');notify('Image PNG téléchargée localement.');}
    else notify('PNG indisponible. Utilisez le SVG pour exporter votre création.');
    URL.revokeObjectURL(url);
   },'image/png');
  }catch(_error){URL.revokeObjectURL(url);notify('PNG indisponible. Utilisez l’export SVG.');}
 };
 image.onerror=()=>{URL.revokeObjectURL(url);notify('Impossible de convertir l’aperçu en PNG. Essayez le SVG.');};
 image.src=url;
}
function exportBrief(){
 downloadBlob(new Blob([briefText(getValues())],{type:'text/plain;charset=utf-8'}),'studio-ia-brief-visuel.txt');
 notify('Brief téléchargé sur votre appareil.');
}
$('vs-export-svg').addEventListener('click',exportSvg);
$('vs-export-png').addEventListener('click',exportPng);
$('vs-export-brief').addEventListener('click',exportBrief);
$('vs-copy-brief').addEventListener('click',async()=>{
 const value=$('vs-brief').value;
 if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText){
  try{await navigator.clipboard.writeText(value);notify('Brief copié.');return;}catch(_e){}
 }
 $('vs-brief').focus();$('vs-brief').select();notify('Brief sélectionné : utilisez Ctrl+C ou Cmd+C.');
});
for(const field of controls)$('vs-'+field).addEventListener('input',()=>{render();notify('Aperçu actualisé. Vérifiez la lisibilité avant l’export.');});
for(const field of ['palette','format','layout'])$('vs-'+field).addEventListener('change',()=>{render();notify('Composition mise à jour.');});
document.querySelectorAll('[data-vs-example]').forEach(b=>b.addEventListener('click',()=>applyExample(b.dataset.vsExample)));
applyExample('artisan');
})();