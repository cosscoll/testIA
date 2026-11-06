/* LIV-04A — Recette manuelle des compositions, du DOM et des exports. Sans réseau.
   Utilisation : node tests/visual-studio.cjs */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('univers/outils/assets/visual-studio.js');
const html=read('univers/outils/outils/atelier-visuels.html'),css=read('univers/outils/assets/visual-studio.css');
let checks=0,network=0,downloads=[],files=[],urls=0,revoked=0,drawn=0,copied='';
const check=(v,msg)=>{assert.ok(v,msg);checks++;};
class Elem{
 constructor(tag='div',value=''){this.tagName=tag;this.value=value;this.innerHTML='';this.textContent='';this.children=[];this.attributes={};this.dataset={};this.listeners={};this.disabled=false;this.type='';}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=items}
 addEventListener(type,fn){this.listeners[type]=fn}
 setAttribute(k,v){this.attributes[k]=String(v)}
 focus(){this.focused=true}
 select(){this.selected=true}
 click(){downloads.push({name:this.download,href:this.href})}
 remove(){this.removed=true}
 getContext(){return this.tagName==='canvas'?{drawImage(){drawn++}}:null}
 toBlob(fn,type){fn(new BlobShim(['pixel-data'],{type}))}
}
const fields={
 brand:'L’ATELIER DU BOIS',title:'Un intérieur à votre mesure.',
 description:'Des rangements pensés pour chaque espace, fabriqués avec soin.',
 cta:'PARLONS DE VOTRE PROJET',footer:'Sur rendez-vous · Atelier local',
 palette:'orange',format:'square',layout:'editorial'
};
const ids=['visualStudio','vs-preview','vs-status','vs-score','vs-checks','vs-dimensions','vs-brief','vs-export-svg','vs-export-png','vs-export-brief','vs-copy-brief'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Elem()]));
for(const [id,val] of Object.entries(fields))nodes['vs-'+id]=new Elem('input',val);
const buttons=['artisan','marche','conseil'].map(id=>{const b=new Elem('button');b.dataset.vsExample=id;return b;});
const document={getElementById:id=>nodes[id]||null,
 querySelectorAll:q=>q==='[data-vs-example]'?buttons:[],
 createElement:tag=>new Elem(tag),body:new Elem('body')};
class BlobShim{constructor(parts,options){this.parts=parts;this.type=options?.type||'';files.push(this)}}
class ImageShim{constructor(){this.onload=null;this.onerror=null}set src(value){this._src=value;if(this.onload)this.onload()}}
const sandbox={window:{},document,Blob:BlobShim,Image:ImageShim,
 URL:{createObjectURL(){urls++;return 'blob:offline'},revokeObjectURL(){revoked++}},
 navigator:{clipboard:{writeText:async value=>{copied=value}}},
 setTimeout:fn=>fn(),
 fetch(){network++;throw Error('Réseau interdit')},console};
vm.runInNewContext(source,sandbox,{filename:'visual-studio.js',timeout:2000});
const core=sandbox.window.STUDIO_VISUAL_CORE;
check(typeof core?.buildSvg==='function','Le moteur SVG est absent');
check(nodes['vs-preview'].innerHTML.startsWith('<svg'),'L’aperçu initial n’existe pas');
check(nodes['vs-checks'].children.length===5,'Cinq contrôles attendus');
check(nodes['vs-score'].textContent==='5 / 5 repères satisfaits','L’exemple initial ne passe pas les contrôles');
for(const item of Object.values(core.examples)){
 for(const layout of ['editorial','split','center']){
  for(const format of ['square','portrait']){
   const raw={...item,layout,format};
   const svg=core.buildSvg(raw),dim=format==='portrait'?1350:1080;
   check(svg.startsWith('<svg')&&svg.endsWith('</svg>'),'SVG invalide : '+layout+'/'+format);
   check(svg.includes('viewBox="0 0 1080 '+dim+'"'),'Format SVG incorrect');
   check(svg.includes(item.brand),'Marque non présente dans le rendu');
   check(core.quality(raw).length===5,'Checklist incohérente');
  }
 }
}
for(const theme of Object.keys(core.palettes)){
 const p=core.palettes[theme];
 check(core.contrast(p.ink,p.bg)>=4.5,'Contraste insuffisant pour '+theme);
 check(core.contrast(p.accentInk,p.accent)>=4.5,'Contraste CTA insuffisant pour '+theme);
}
const attack={...core.examples.artisan,title:'<script>alert(1)</script> & <iframe />',brand:'<img onerror=alert(1)>'};
const bad=core.buildSvg(attack);
check(!bad.includes('<script')&&!bad.includes('<iframe')&&!bad.includes('<img'),'Code injecté dans un SVG');
check(bad.includes('&lt;script&gt;')&&bad.includes('&lt;img'),'Échappement XML des entrées absent');
check(core.normalize({palette:'__proto__',format:'constructor'}).palette==='orange','Palette non autorisée');
check(core.normalize({palette:'__proto__',format:'constructor'}).format==='square','Format non autorisé');
check(core.wrap('sansespaces'.repeat(80),19,3).truncated,'Troncature non signalée');
check(!core.quality({...core.examples.artisan,cta:''}).find(x=>x.key==='cta').ok,'CTA vide non détecté');
nodes['vs-title'].value='L’annonce révisée';
nodes['vs-title'].listeners.input();
check(nodes['vs-preview'].innerHTML.includes('L’annonce révisée'),'Aperçu pas actualisé');
check(nodes['vs-brief'].value.includes('L’annonce révisée'),'Le brief ne suit pas le titre');
nodes['vs-title'].value='<script>alert(1)</script>';
nodes['vs-title'].listeners.input();
check(!nodes['vs-preview'].innerHTML.includes('<script'),'SVG dangereux après modification');
buttons[1].listeners.click();
check(nodes['vs-title'].value==='Des idées prennent vie.','Exemple événement absent');
check(nodes['vs-palette'].value==='olive'&&nodes['vs-format'].value==='portrait','Variation exemple événement absente');
check(nodes['vs-preview'].innerHTML.includes('height="1350"'),'Rendu portrait absent');
nodes['vs-palette'].value='blue';nodes['vs-palette'].listeners.change();
check(nodes['vs-preview'].innerHTML.includes('fill="#EFF5FA"'),'Changement palette non appliqué');
nodes['vs-export-svg'].listeners.click();
check(downloads.length===1&&downloads[0].name==='studio-ia-portrait.svg','Export SVG indisponible');
check(files[0].type.startsWith('image/svg+xml'),'Fichier SVG incorrect');
nodes['vs-export-brief'].listeners.click();
check(downloads.length===2&&downloads[1].name.endsWith('.txt'),'Export brief indisponible');
(async()=>{
 await nodes['vs-copy-brief'].listeners.click();
 check(copied.includes('Des idées prennent vie.'),'La copie du brief ne fonctionne pas');
 nodes['vs-export-png'].listeners.click();
 check(downloads.length===3&&downloads[2].name==='studio-ia-portrait.png','Export PNG indisponible');
 check(drawn===1,'Image non convertie via le canvas');
 check(files.some(x=>x.type==='image/png'),'Blob PNG non généré');
 check(urls===revoked,'Les URLs temporaires ne sont pas libérées');
 check(network===0,'Appel distant inattendu');
 check(html.includes('visual-studio.js')&&html.includes('visual-studio.css'),'Page non liée à l’atelier');
 check(css.includes('prefers-reduced-motion'),'CSS accessible mouvement réduit absent');
 check(read('assets/data.js').includes("atelier-visuels.html"),'Lien direct produit manquant');
 check(read('assets/resources-data.js').includes("id:'o-visuel'"),'Entrée ressource absente');
 console.log('OK — '+checks+' vérifications LIV-04A : 18 SVG, contrastes, sécurité des textes, aperçu et exports SVG/PNG/TXT.');
})().catch(e=>{console.error(e);process.exitCode=1;});
