/* Studio IA — LIV-04B : recette moteur et interactions du constructeur web.
   Manuel : node tests/web-builder.cjs ; aucun accès réseau. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=read('univers/outils/assets/web-builder.js');
const html=read('univers/outils/outils/atelier-sites-web.html');
const css=read('univers/outils/assets/web-builder.css');
let assertions=0,downloads=[],blobs=[],created=0,revoked=0,requests=0,copied='',resized=0;
const check=(ok,message)=>{assert.ok(ok,message);assertions++};
class Node{
 constructor(tag='div',value=''){
  this.tagName=tag;this.value=value;this.textContent='';this.srcdoc='';this.children=[];this.attributes={};
  this.listeners={};this.dataset={};this.style={};this.disabled=false;this.clientWidth=550;this.hidden=false;
 }
 addEventListener(event,callback){this.listeners[event]=callback}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this.children=x}
 setAttribute(key,value){this.attributes[key]=String(value)}
 focus(){this.focused=true}
 select(){this.selected=true}
 click(){downloads.push({filename:this.download,href:this.href})}
 remove(){this.removed=true}
}
const ids=['webPrototypeStudio','wb-device','wb-preview','wb-status','wb-checks','wb-count','wb-brief','wb-download-html','wb-export-brief','wb-copy-code','wb-code-fallback'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Node()]));
const example={brand:'Atelier Sillage',headline:'Des espaces pensés pour vous.',
 pitch:'Nous imaginons des rangements personnalisés pour accompagner vos projets d’aménagement.',
 audience:'les particuliers qui souhaitent aménager leur intérieur',
 offer1:'Un échange pour comprendre vos besoins',offer2:'Un projet adapté aux dimensions disponibles',
 offer3:'Une proposition à valider avant réalisation',cta:'Présenter mon projet',
 email:'bonjour@example.com',layout:'editorial',palette:'cream'};
for(const [id,value] of Object.entries(example))nodes['wb-'+id]=new Node('input',value);
const presets=['artisan','conseil','studio'].map(id=>{const n=new Node('button');n.dataset.webPreset=id;return n});
const devices=['desktop','mobile'].map(id=>{const n=new Node('button');n.dataset.webDevice=id;return n});
const handlers={};
const doc={getElementById:id=>nodes[id]||null,querySelectorAll:query=>query==='[data-web-preset]'?presets:query==='[data-web-device]'?devices:[],
 createElement:tag=>new Node(tag),body:new Node('body')};
const fakeWindow={addEventListener(event,callback){handlers[event]=callback}};
const sandbox={window:fakeWindow,document:doc,console,
 Blob:class FakeBlob{constructor(parts,options){this.parts=parts;this.type=options.type;blobs.push(this)}},
 URL:{createObjectURL(){created++;return 'blob:local'},revokeObjectURL(){revoked++}},
 setTimeout(callback){callback()},
 navigator:{clipboard:{writeText:async code=>{copied=code}}},
 fetch(){requests++;throw Error('Un outil local ne doit pas appeler le réseau')}
};
vm.runInNewContext(src,sandbox,{filename:'web-builder.js',timeout:2500});
const core=fakeWindow.TESTIA_WEB_CORE;
check(typeof core?.build==='function','Moteur HTML manquant');
check(nodes['wb-preview'].srcdoc.startsWith('<!doctype html>'),'Aperçu initial non chargé');
check(nodes['wb-preview'].srcdoc.includes('Content-Security-Policy'),'Aperçu sans CSP');
check(nodes['wb-checks'].children.length===6,'Contrôles attendus');
check(nodes['wb-count'].textContent==='5 / 6 points de contrôle','Exemple d’e-mail fictif non signalé');
check(nodes['wb-preview'].style.width==='1100px','La largeur desktop ne correspond pas au test');
check(nodes['wb-device'].style.height.endsWith('px'),'Échelle responsive non initialisée');
for(const item of Object.values(core.presets)){
 for(const layout of ['editorial','services','portfolio']){
  for(const palette of Object.keys(core.palettes)){
   const v={...item,layout,palette},s=core.build(v);
   check(s.includes('class="page--'+layout+'"'),'Composition incorrecte : '+layout);
   check(s.includes('lang="fr"')&&s.includes('<main id="contenu">'),'HTML non sémantique');
   check(s.includes('@media(max-width:800px)'),'Page non responsive');
   check(s.includes('default-src &#39;none&#39;'),'Politique CSP absente');
   check(s.includes('<section class="section" id="contact"'),'Contact absent');
   check(!s.includes('<script'),'Scripts non interdits dans le HTML exporté');
   check(!s.includes('href="mailto:')||core.emailValid(v.email),'Contact fictif rendu cliquable');
   check(core.quality(v).length===6,'Checklist incomplète');
   check(core.guide(v).includes('RECETTE AVANT MISE EN LIGNE'),'Cahier des charges absent');
  }
 }
}
const hostile={...example,
 brand:'<iframe src=x onload=alert(1)>',
 headline:'<script>alert("attaque")</script>',
 pitch:'</style><img src=x onerror=alert(1)>',
 email:'" onclick="bad@site.com',layout:'__proto__',palette:'constructor'};
const escaped=core.build(hostile);
check(!escaped.includes('<iframe')&&!escaped.includes('<script')&&!escaped.includes('<img src=x'),'Entrée HTML exécutée');
check(escaped.includes('&lt;script&gt;')&&escaped.includes('&lt;iframe'),'Échappement HTML absent');
check(escaped.includes('class="page--editorial"'),'Disposition non autorisée acceptée');
check(escaped.includes('color:#111827'),'Palette non autorisée acceptée');
check(!escaped.includes('href="mailto:'),'Email dangereux transformé en lien');
check(!core.emailValid('bonjour@example.com')&&!core.emailValid('test@sample.test'),'Adresses d’exemple non refusées');
check(core.emailValid('personne@artisan.fr'),'Adresse e-mail valide refusée');
check(core.build({...example,email:'personne@artisan.fr'}).includes('href="mailto:personne@artisan.fr"'),'Lien mail valide manquant');
check(core.quality({...example,email:''}).find(x=>x.key==='contact').ok===false,'Email manquant non signalé');
check(core.contrast(core.palettes.navy.onAccent,core.palettes.navy.accent)>=4.5,'Contraste de CTA insuffisant');
check(core.contrast(core.palettes.forest.ink,core.palettes.forest.background)>=4.5,'Texte insuffisamment contrasté');
presets[1].listeners.click();
check(nodes['wb-brand'].value==='Clair Conseil','Préréglage conseil non appliqué');
check(nodes['wb-layout'].value==='services','Préréglage Services non appliqué');
devices[1].listeners.click();
check(nodes['wb-preview'].style.width==='390px','Largeur mobile non appliquée');
check(nodes['wb-device'].dataset.device==='mobile','État de la prévisualisation incorrect');
check(devices[1].attributes['aria-pressed']==='true','État accessible du sélecteur incorrect');
nodes['wb-device'].clientWidth=270;handlers.resize();resized++;
check(Number.parseFloat(nodes['wb-device'].style.height)>0,'Redimensionnement mobile non effectué');
nodes['wb-headline'].value='Nouvelle proposition pour vous';
nodes['wb-headline'].listeners.input();
check(nodes['wb-preview'].srcdoc.includes('Nouvelle proposition pour vous'),'Aperçu non actualisé');
check(nodes['wb-brief'].value.includes('Nouvelle proposition pour vous'),'Brief non actualisé');
nodes['wb-email'].value='';
nodes['wb-email'].listeners.input();
check(nodes['wb-count'].textContent==='5 / 6 points de contrôle','Absence de contact non signalée');
nodes['wb-download-html'].listeners.click();
check(downloads.length===1&&downloads[0].filename==='studio-ia-site-demo.html','Export HTML en erreur');
check(blobs[0].type.startsWith('text/html'),'Type d’export HTML invalide');
check(blobs[0].parts[0].includes('Nouvelle proposition pour vous'),'Export HTML non à jour');
nodes['wb-export-brief'].listeners.click();
check(downloads.length===2&&downloads[1].filename.endsWith('.txt'),'Export du brief en erreur');
(async()=>{
 await nodes['wb-copy-code'].listeners.click();
 check(copied.startsWith('<!doctype html>'),'Copie HTML non fonctionnelle');
 check(copied.includes('Nouvelle proposition pour vous'),'Code copié obsolète');
 check(created===revoked,'URLs temporaires non libérées');
 check(requests===0,'Réseau appelé');
 check(html.includes('sandbox=""')&&html.includes('referrerpolicy="no-referrer"'),'Iframe non sécurisée');
 check(css.includes('prefers-reduced-motion'),'Mouvement réduit absent');
 check(read('assets/data.js').includes("atelier-sites-web.html"),'Liaison au produit manquante');
 check(read('assets/resources-data.js').includes("id:'o-webbuilder'"),'Liaison aux ressources manquante');
 console.log('OK — '+assertions+' validations LIV-04B : 27 variantes HTML, sécurité, aperçus et exports HTML/TXT.');
})().catch(error=>{console.error(error);process.exitCode=1;});
